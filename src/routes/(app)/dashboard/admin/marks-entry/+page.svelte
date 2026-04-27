<script lang="ts">
	import { getSubjectsForExam, getStudentsForMarks, getSectionsForClass, saveSingleMark } from './marks-entry.remote';
	import { fade } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// --- Filter state ---
	// svelte-ignore state_referenced_locally
	let currentSession = $state(data.defaults.session);
	// svelte-ignore state_referenced_locally
	let currentTerm = $state(data.defaults.term);
	// svelte-ignore state_referenced_locally
	let currentClass = $state(data.defaults.class);
	// svelte-ignore state_referenced_locally
	let currentSection = $state(data.defaults.section);
	// svelte-ignore state_referenced_locally
	let currentSubject = $state(data.defaults.subject);

	// --- Dropdown data (pre-filled from server) ---
	// svelte-ignore state_referenced_locally
	let sections = $state(data.initialSections);
	// svelte-ignore state_referenced_locally
	let subjects = $state(data.initialSubjects);

	// --- Student & marks state (pre-filled from server) ---
	type StudentRow = {
		seid: number;
		rollNo: number;
		studentName: string;
		mid: number | null;
		isPresent: boolean;
		marksObtained: number;
	};
	// svelte-ignore state_referenced_locally
	let students = $state<StudentRow[]>(
		data.initialStudents.map(s => ({
			...s,
			isPresent: s.isPresent ?? true,
			marksObtained: s.marksObtained ?? 0
		}))
	);
	// svelte-ignore state_referenced_locally
	let currentFullMark = $state(data.initialSubjects.length > 0 ? data.initialSubjects[0].fullMark : 0);
	// svelte-ignore state_referenced_locally
	let currentPassMark = $state(data.initialSubjects.length > 0 ? data.initialSubjects[0].passMark : 0);

	// svelte-ignore state_referenced_locally
	let saveStatus = $state<Record<number, string>>(
		Object.fromEntries(data.initialStudents.map(s => [s.seid, 'idle']))
	);

	// --- Loading states ---
	let isLoadingStudents = $state(false);

	// ========================
	// Cascading dropdown logic
	// ========================

	async function fetchSections() {
		if (!currentClass) {
			sections = [];
			currentSection = '';
			return;
		}
		const fetched = await getSectionsForClass(parseInt(currentClass));
		sections = fetched;
		if (fetched.length > 0) {
			currentSection = fetched[0].id.toString();
		} else {
			currentSection = '';
		}
	}

	async function fetchSubjects() {
		if (!currentSession || !currentClass || !currentTerm) {
			subjects = [];
			currentSubject = '';
			return;
		}
		const fetched = await getSubjectsForExam({
			sessionId: parseInt(currentSession),
			classId: parseInt(currentClass),
			examTermId: parseInt(currentTerm)
		});
		subjects = fetched;
		if (fetched.length > 0) {
			currentSubject = fetched[0].setupId.toString();
			currentFullMark = fetched[0].fullMark;
			currentPassMark = fetched[0].passMark;
		} else {
			currentSubject = '';
			currentFullMark = 0;
			currentPassMark = 0;
		}
	}

	async function fetchStudents() {
		if (!currentSession || !currentSection || !currentSubject) {
			students = [];
			return;
		}
		isLoadingStudents = true;
		try {
			const fetched = await getStudentsForMarks({
				sessionId: parseInt(currentSession),
				sectionId: parseInt(currentSection),
				examSetupId: parseInt(currentSubject)
			});
			// Map nulls from left-join to sensible defaults
			students = fetched.map(s => ({
				...s,
				isPresent: s.isPresent ?? true,
				marksObtained: s.marksObtained ?? 0
			}));
			// Reset save statuses
			const newStatus: Record<number, string> = {};
			for (const s of students) {
				newStatus[s.seid] = 'idle';
			}
			saveStatus = newStatus;
		} finally {
			isLoadingStudents = false;
		}
	}

	// --- Handlers for dropdown changes ---

	async function handleClassChange() {
		currentSection = '';
		currentSubject = '';
		subjects = [];
		students = [];
		await fetchSections();
		await fetchSubjects();
		await fetchStudents();
	}

	async function handleSessionOrTermChange() {
		currentSubject = '';
		students = [];
		await fetchSubjects();
		await fetchStudents();
	}

	async function handleSectionChange() {
		students = [];
		await fetchStudents();
	}

	async function handleSubjectChange() {
		// Update fullMark from the selected subject
		const selected = subjects.find(s => s.setupId.toString() === currentSubject);
		currentFullMark = selected?.fullMark ?? 0;
		currentPassMark = selected?.passMark ?? 0;
		students = [];
		await fetchStudents();
	}

	// Initial data is pre-loaded from the server (see +page.server.ts),
	// so no $effect needed for the first render.

	// ========================
	// Auto-save on blur
	// ========================

	async function handleMarkBlur(student: StudentRow) {
		await doSave(student);
	}

	async function handlePresentToggle(student: StudentRow) {
		// Don't zero marks — keep them intact so accidental untick doesn't destroy data.
		// Marksheet generation will use is_present to exclude absent students from totals.
		await doSave(student);
	}

	async function doSave(student: StudentRow) {
		if (!currentSubject) return;

		// Fix negative / NaN silently
		if (student.marksObtained < 0 || isNaN(student.marksObtained)) {
			student.marksObtained = 0;
		}

		// Block save if marks exceed full marks — highlight red for user to fix
		if (student.marksObtained > currentFullMark) {
			saveStatus[student.seid] = 'warning';
			return;
		}

		saveStatus[student.seid] = 'saving';
		try {
			await saveSingleMark({
				sessionEnrollId: student.seid,
				examSetupId: parseInt(currentSubject),
				marksObtained: student.marksObtained,
				isPresent: student.isPresent
			});
			saveStatus[student.seid] = 'saved';
			setTimeout(() => {
				if (saveStatus[student.seid] === 'saved') {
					saveStatus[student.seid] = 'idle';
				}
			}, 2000);
		} catch {
			saveStatus[student.seid] = 'error';
		}
	}

	// --- Mark All Present toggle ---
	let allPresent = $derived(students.length > 0 && students.every(s => s.isPresent));

	async function toggleAllPresent() {
		const newVal = !allPresent;
		for (const s of students) {
			s.isPresent = newVal;
		}
		// Save all in parallel
		await Promise.all(students.map(s => doSave(s)));
	}

	// Student count & stats
	let studentCount = $derived(students.length);
	let presentCount = $derived(students.filter(s => s.isPresent).length);
	let failedCount = $derived(
		students.filter(s => s.isPresent && s.marksObtained < currentPassMark).length
	);

	// Helper to check if a student has failed
	function isFailed(student: StudentRow): boolean {
		return student.isPresent && student.marksObtained < currentPassMark && saveStatus[student.seid] !== 'warning';
	}
</script>

<svelte:head>
	<title>Marks Entry | {APP_NAME}</title>
	<style>
		:global(html) { 
            overflow-y: scroll; 
            scrollbar-width: thin;
            scrollbar-color: rgba(99, 102, 241, 0.5) transparent;
        }
        :global(html::-webkit-scrollbar) { width: 6px; }
        :global(html::-webkit-scrollbar-track) { background: transparent; }
        :global(html::-webkit-scrollbar-thumb) { background: rgba(99, 102, 241, 0.5); border-radius: 10px; }
        :global(html::-webkit-scrollbar-thumb:hover) { background: rgba(99, 102, 241, 0.8); }
	</style>
</svelte:head>

<main class="mx-auto min-h-[101vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8" in:fade={{ duration: 400 }}>
	<!-- Header Section -->
	<div class="mb-10 sm:flex sm:items-start sm:justify-between relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 transition-colors bg-linear-to-b from-slate-100 dark:from-white/5 to-transparent p-8 shadow-2xl">
		<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50 dark:bg-indigo-500/10 blur-[80px]"></div>
		<div class="relative z-10 flex-1 mb-6 sm:mb-0">
			<h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Marks Entry</h1>
			<p class="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400 transition-colors">Enter marks for each student. Changes save automatically when you move to the next field.</p>
			{#if students.length > 0}
				<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
					<div class="flex items-center gap-2">
						<span class="relative flex h-2.5 w-2.5">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
						</span>
						<span class="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
							<strong class="text-slate-900 dark:text-white transition-colors text-base">{studentCount}</strong> students
						</span>
					</div>
					<span class="text-slate-600">•</span>
					<span class="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
						<strong class="text-slate-900 dark:text-white transition-colors text-base">{presentCount}</strong> present
					</span>
					{#if failedCount > 0}
						<span class="text-slate-600">•</span>
						<span class="text-sm font-medium text-amber-700 dark:text-amber-400">
							<strong class="text-amber-800 dark:text-amber-300 text-base">{failedCount}</strong> failed
						</span>
					{/if}
				</div>
			{/if}
		</div>
		
		<div class="relative z-10 w-full sm:w-auto mt-6 sm:mt-0">
			<div class="flex flex-col items-end gap-4">
				<!-- Row 1: Session, Term, Class -->
				<div class="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
					<select bind:value={currentSession} onchange={handleSessionOrTermChange} class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
						{#each data.sessions as session (session.id)}
							<option value={session.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{session.name}</option>
						{/each}
					</select>

					<select bind:value={currentTerm} onchange={handleSessionOrTermChange} class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
						{#each data.examTerms as term (term.id)}
							<option value={term.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{term.name}</option>
						{/each}
					</select>

					<select bind:value={currentClass} onchange={handleClassChange} class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
						{#each data.classes as cls (cls.id)}
							<option value={cls.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{cls.name}</option>
						{/each}
					</select>
				</div>

				<!-- Separator -->
				<div class="h-px w-full bg-white/10"></div>

				<!-- Row 2: Section, Subject -->
				<div class="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
					<select bind:value={currentSection} onchange={handleSectionChange} class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
						{#if sections.length === 0}
							<option value="" class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">No sections</option>
						{/if}
						{#each sections as sec (sec.id)}
							<option value={sec.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">Section {sec.letter}</option>
						{/each}
					</select>

					<select bind:value={currentSubject} onchange={handleSubjectChange} class="rounded-xl border-2 border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/10 py-2.5 pl-3 pr-8 text-sm font-semibold text-slate-900 dark:text-white transition-colors focus:border-indigo-400 focus:bg-indigo-100 dark:bg-indigo-500/15 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-[0_0_12px_rgba(99,102,241,0.15)]">
						{#if subjects.length === 0}
							<option value="" class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">No subjects configured</option>
						{/if}
						{#each subjects as sub (sub.setupId)}
							<option value={sub.setupId.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{sub.subjectName}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Data Table -->
	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<div class="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 transition-colors bg-white dark:bg-white/2 shadow-sm dark:shadow-none transition-colors shadow-2xl ring-1 ring-slate-200 dark:ring-white/5">
					<table class="min-w-full divide-y divide-slate-200 dark:divide-white/5">
						<thead class="bg-slate-100 dark:bg-white/5 transition-colors">
							<tr>
								<th scope="col" class="py-3 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors sm:pl-6 w-20">Roll</th>
								<th scope="col" class="px-3 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Student Name</th>
								<th scope="col" class="px-3 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white transition-colors w-28">
									<div class="flex items-center justify-center gap-2">
										<input 
											type="checkbox"
											checked={allPresent}
											onchange={toggleAllPresent}
											title="Mark all present / absent"
											class="h-4 w-4 rounded border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition cursor-pointer"
										>
										<span>Present</span>
									</div>
								</th>
								<th scope="col" class="px-3 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors w-36">
									Marks {#if currentFullMark > 0} <span class="text-slate-500 dark:text-slate-400 transition-colors font-normal">({currentFullMark})</span>{/if}
								</th>
								<th scope="col" class="px-3 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white transition-colors w-16"></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
							{#each students as student (student.seid)}
								<tr class="transition hover:bg-slate-200 dark:hover:bg-white/10 transition-colors even:bg-slate-50 dark:even:bg-white/2 transition-colors">
									<td class="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors sm:pl-6 tabular-nums">
										{student.rollNo}
									</td>
									<td class="whitespace-nowrap px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 transition-colors font-medium">
										{student.studentName}
									</td>
									<td class="whitespace-nowrap px-3 py-2.5 text-sm text-center">
										<input 
											type="checkbox"
											bind:checked={student.isPresent}
											onchange={() => handlePresentToggle(student)}
											tabindex={-1}
											class="h-5 w-5 rounded border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition cursor-pointer mx-auto"
										>
									</td>
									<td class="whitespace-nowrap px-3 py-2.5 text-sm">
										<input 
											type="number"
											min="0"
											bind:value={student.marksObtained}
											onblur={() => handleMarkBlur(student)}
											disabled={!student.isPresent}
											placeholder="0"
											class="block w-full rounded-xl py-1.5 px-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 transition disabled:opacity-30 disabled:cursor-not-allowed tabular-nums {saveStatus[student.seid] === 'warning' ? 'border-2 border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/30 focus:border-rose-400 focus:ring-rose-500' : isFailed(student) ? 'border border-amber-500/50 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 focus:border-amber-400 focus:bg-amber-100 dark:focus:bg-amber-500/15 focus:ring-amber-500' : 'border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:ring-indigo-500'}"
										>
									</td>
									<td class="whitespace-nowrap px-1 py-2.5 text-center w-10">
										{#if saveStatus[student.seid] === 'saved'}
											<span class="text-emerald-600 dark:text-emerald-400 text-base" in:fade={{ duration: 200 }}>✓</span>
										{:else if saveStatus[student.seid] === 'warning'}
											<span class="text-rose-600 dark:text-rose-400 text-xs font-medium" title="Marks exceed full marks — please correct">&gt;{currentFullMark}</span>
										{:else if saveStatus[student.seid] === 'error'}
											<span class="text-rose-600 dark:text-rose-400 text-base" title="Save failed — try again">✗</span>
										{/if}
									</td>
								</tr>
							{/each}

							{#if students.length === 0 && !isLoadingStudents}
								<tr>
									<td colspan="5" class="px-6 py-16 text-center">
										<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors ring-1 ring-slate-200 dark:ring-white/10 mb-4">
											<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
											</svg>
										</div>
										{#if subjects.length === 0}
											<h3 class="text-sm font-semibold text-slate-900 dark:text-white transition-colors">No subjects configured</h3>
											<p class="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">Set up exam configuration first for this session, class, and term.</p>
										{:else}
											<h3 class="text-sm font-semibold text-slate-900 dark:text-white transition-colors">No students found</h3>
											<p class="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">No students are enrolled for the selected section.</p>
										{/if}
									</td>
								</tr>
							{/if}

						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</main>

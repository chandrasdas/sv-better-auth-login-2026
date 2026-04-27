<script lang="ts">
	import { getExistingSetups, saveExamSetups } from './setup.remote';
	import { fade } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Reactive state for filters
	// svelte-ignore state_referenced_locally
	let currentSession = $state(data.defaults.session);
	// svelte-ignore state_referenced_locally
	let currentTerm = $state(data.defaults.term);
	// svelte-ignore state_referenced_locally
	let currentClass = $state(data.defaults.class);

	// Reactive state for marks inputs
	let markInputs = $state<Record<number, number | null>>({});
	let passMarkInputs = $state<Record<number, number | null>>({});
	let sortInputs = $state<Record<number, number | null>>({});
	let includeMarksheetInputs = $state<Record<number, boolean>>({});
	let includeInputs = $state<Record<number, boolean>>({});
	let isSaving = $state(false);
	let saveMessage = $state('');
	// svelte-ignore state_referenced_locally
	let displaySubjects = $state(data.subjects);

	async function fetchSetups() {
		if (!currentSession || !currentTerm || !currentClass) return;
		
		saveMessage = '';
		const setups = await getExistingSetups({
			sessionId: parseInt(currentSession),
			examTermId: parseInt(currentTerm),
			classId: parseInt(currentClass)
		});

		// Reset inputs
		const newInputs: Record<number, number | null> = {};
		const newPassMarks: Record<number, number | null> = {};
		const newSorts: Record<number, number | null> = {};
		const newIncludeMarksheet: Record<number, boolean> = {};
		const newIncludes: Record<number, boolean> = {};
		let initialSortIndex = 1;
		for (const sub of data.subjects) {
			newInputs[sub.id] = null;
			newPassMarks[sub.id] = null;
			newSorts[sub.id] = initialSortIndex++;
			newIncludeMarksheet[sub.id] = false;
			newIncludes[sub.id] = true;
		}

		// Populate with existing
		for (const setup of setups) {
			newInputs[setup.subjectId] = setup.fullMark;
			newPassMarks[setup.subjectId] = setup.passMark;
			newSorts[setup.subjectId] = setup.sortIndex;
			newIncludeMarksheet[setup.subjectId] = setup.includeInMarksheet;
			newIncludes[setup.subjectId] = setup.includeInTotal;
		}
		markInputs = newInputs;
		passMarkInputs = newPassMarks;
		sortInputs = newSorts;
		includeMarksheetInputs = newIncludeMarksheet;
		includeInputs = newIncludes;

		// Use database order (no sorting)
		displaySubjects = [...data.subjects];
	}

	// Fetch initial setups when page loads
	$effect(() => {
		fetchSetups();
	});

	async function handleSave() {
		if (!currentSession || !currentTerm || !currentClass) return;
		isSaving = true;
		saveMessage = '';

		const setupsToSave = [];
		for (const sub of data.subjects) {
			const includeInMarksheet = includeMarksheetInputs[sub.id];
			if (includeInMarksheet) {
				const mark = markInputs[sub.id];
				const passMark = passMarkInputs[sub.id];
				const sort = sortInputs[sub.id];
				const includeInTotal = includeInputs[sub.id];
				setupsToSave.push({
					subjectId: sub.id,
					fullMark: mark !== null && mark !== undefined && mark.toString() !== '' ? (typeof mark === 'string' ? parseFloat(mark) : mark) : 0,
					passMark: passMark !== null && passMark !== undefined && passMark.toString() !== '' ? (typeof passMark === 'string' ? parseFloat(passMark) : passMark) : 0,
					sortIndex: sort !== null && sort !== undefined && sort.toString() !== '' ? (typeof sort === 'string' ? parseInt(sort) : sort) : 0,
					includeInMarksheet: true,
					includeInTotal: includeInTotal !== undefined ? includeInTotal : true
				});
			}
		}

		try {
			await saveExamSetups({
				sessionId: parseInt(currentSession),
				examTermId: parseInt(currentTerm),
				classId: parseInt(currentClass),
				setups: setupsToSave
			});
			saveMessage = 'Configuration saved successfully!';
			setTimeout(() => saveMessage = '', 3000);
		} catch {
			saveMessage = 'Failed to save configuration.';
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Exam Setup | {APP_NAME}</title>
</svelte:head>

<main class="mx-auto min-h-[101vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8" in:fade={{ duration: 400 }}>
	<!-- Header Section -->
	<div class="mb-10 sm:flex sm:items-start sm:justify-between relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 transition-colors bg-linear-to-b from-slate-100 dark:from-white/5 to-transparent p-8 shadow-2xl">
		<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50 dark:bg-indigo-500/10 blur-[80px]"></div>
		<div class="relative z-10 flex-1 mb-6 sm:mb-0">
			<h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Exam Setup</h1>
			<p class="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400 transition-colors">Configure full marks for each subject. Check 'Include in Marksheet' to add a subject to the exam.</p>
		</div>
		
		<div class="relative z-10 w-full sm:w-auto mt-6 sm:mt-0">
			<div class="flex flex-col items-end gap-4">
				<!-- Filters -->
				<div class="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
					<select bind:value={currentSession} onchange={fetchSetups} class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
						{#each data.sessions as session (session.id)}
							<option value={session.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{session.name}</option>
						{/each}
					</select>

					<select 
						bind:value={currentTerm} 
						onchange={fetchSetups}
						class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
					>
						{#each data.examTerms as term (term.id)}
							<option value={term.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{term.name}</option>
						{/each}
					</select>

					<select 
						bind:value={currentClass} 
						onchange={fetchSetups}
						class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
					>
						{#each data.classes as cls (cls.id)}
							<option value={cls.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{cls.name}</option>
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
								<th scope="col" class="py-2 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors sm:pl-6 w-16">SL</th>
								<th scope="col" class="px-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Subject Name</th>
								<th scope="col" class="px-3 py-2 text-center text-sm font-semibold text-slate-900 dark:text-white transition-colors w-32">Include in Marksheet</th>
								<th scope="col" class="px-3 py-2 text-center text-sm font-semibold text-slate-900 dark:text-white transition-colors w-32">Include in Total</th>
								<th scope="col" class="px-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors w-32">Sort Order</th>
								<th scope="col" class="px-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors w-48">Full Marks</th>
								<th scope="col" class="px-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors w-48">Pass Marks</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
							{#each displaySubjects as subject, i (subject.id)}
							<tr class="transition hover:bg-slate-200 dark:hover:bg-white/10 transition-colors even:bg-slate-50 dark:even:bg-white/2 transition-colors">
								<td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors sm:pl-6">
									{i + 1}
								</td>
								<td class="whitespace-nowrap px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition-colors font-medium">
									{subject.name}
								</td>
								<td class="whitespace-nowrap px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors text-center">
									<input 
										type="checkbox"
										bind:checked={includeMarksheetInputs[subject.id]}
										class="h-5 w-5 rounded border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition mx-auto"
									>
								</td>
								<td class="whitespace-nowrap px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors text-center">
									<input 
										type="checkbox"
										bind:checked={includeInputs[subject.id]}
										disabled={!includeMarksheetInputs[subject.id]}
										class="h-5 w-5 rounded border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
									>
								</td>
								<td class="whitespace-nowrap px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
									<input 
										type="number"
										min="0"
										bind:value={sortInputs[subject.id]}
										placeholder="0"
										disabled={!includeMarksheetInputs[subject.id]}
										class="block w-full rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-1.5 px-3 text-sm text-slate-900 dark:text-white transition-colors placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
									>
								</td>
								<td class="whitespace-nowrap px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
									<input 
										type="number"
										min="0"
										max="1000"
										bind:value={markInputs[subject.id]}
										placeholder="-"
										disabled={!includeMarksheetInputs[subject.id]}
										class="block w-full rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-1.5 px-3 text-sm text-slate-900 dark:text-white transition-colors placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
									>
								</td>
								<td class="whitespace-nowrap px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
									<input 
										type="number"
										min="0"
										max="1000"
										bind:value={passMarkInputs[subject.id]}
										placeholder="0"
										disabled={!includeMarksheetInputs[subject.id]}
										class="block w-full rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-1.5 px-3 text-sm text-slate-900 dark:text-white transition-colors placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
									>
								</td>
							</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-8 flex items-center justify-end gap-4">
		{#if saveMessage}
			<span class="text-sm font-medium {saveMessage.includes('Failed') ? 'text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} transition-opacity duration-300" in:fade>
				{saveMessage}
			</span>
		{/if}
		<button 
			onclick={handleSave} 
			disabled={isSaving}
			class="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-medium text-slate-900 dark:text-white transition-colors shadow-xs hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
		>
			{isSaving ? 'Saving...' : 'Save Configuration'}
		</button>
	</div>
</main>

<script lang="ts">
	import { getSections, getFilteredStudents } from './students.remote';
	import { fade } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Reactive state for filters and list
	// svelte-ignore state_referenced_locally
	let currentQuery = $state(data.query || '');
	// svelte-ignore state_referenced_locally
	let currentSession = $state(data.filters.session);
	// svelte-ignore state_referenced_locally
	let currentClass = $state(data.filters.class);
	// svelte-ignore state_referenced_locally
	let currentSection = $state(data.filters.section);
	// svelte-ignore state_referenced_locally
	let sections = $state(data.sections);

	// svelte-ignore state_referenced_locally
	let students = $state(data.students);
	// svelte-ignore state_referenced_locally
	let currentPage = $state(data.page);
	// svelte-ignore state_referenced_locally
	let totalPages = $state(data.totalPages);
	// svelte-ignore state_referenced_locally
	let hasNextPage = $state(data.hasNextPage);
	// svelte-ignore state_referenced_locally
	let totalRecords = $state(data.totalRecords);

	async function fetchStudents(pageToFetch = 1) {
		const result = await getFilteredStudents({
			q: currentQuery,
			session: currentSession,
			class: currentClass,
			section: currentSection,
			page: pageToFetch
		});
		students = result.students;
		currentPage = result.page;
		totalPages = result.totalPages;
		hasNextPage = result.hasNextPage;
		totalRecords = result.totalRecords;
	}

	async function handleClassChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newClassId = target.value;
		currentClass = newClassId;
		
		if (newClassId) {
			const fetchedSections = await getSections(parseInt(newClassId));
			sections = fetchedSections;
			if (fetchedSections.length > 0) {
				currentSection = fetchedSections[0].id.toString();
			} else {
				currentSection = '';
			}
		} else {
			sections = [];
			currentSection = '';
		}
		fetchStudents(1);
	}

	async function handleSessionChange() {
		currentClass = '';
		currentSection = '';
		sections = [];
		fetchStudents(1);
	}

	function handleSearchInput() {
		if (currentQuery.length >= 3 || currentQuery.length === 0) {
			fetchStudents(1);
		}
	}
</script>

<svelte:head>
	<title>Students | {APP_NAME}</title>
	<style>
		:global(html) { 
            overflow-y: scroll; 
            scrollbar-width: thin;
            scrollbar-color: rgba(99, 102, 241, 0.5) transparent; /* Indigo shadow */
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
            <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Students Registry</h1>
            <p class="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400 transition-colors">Manage and search through the student records.</p>
            <div class="mt-4 flex items-center gap-2">
                <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full {totalRecords === 0 ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 {totalRecords === 0 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}"></span>
                </span>
                <span class="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
                    Showing <strong class="text-slate-900 dark:text-white transition-colors text-base">{totalRecords}</strong> students
                </span>
            </div>
        </div>
        
        <div class="relative z-10 w-full sm:w-auto mt-6 sm:mt-0">
            <div class="flex flex-col items-end gap-4">
                <!-- Search -->
                <div class="relative w-full sm:w-72">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        type="search" 
                        bind:value={currentQuery}
                        oninput={handleSearchInput}
                        onkeydown={(e) => { if (e.key === 'Enter') fetchStudents(1); }}
                        placeholder="Search name or Portal ID..." 
                        class="block w-full rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white transition-colors placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                </div>

                <!-- Horizontal Separator -->
                <div class="h-px w-full bg-white/10"></div>

                <!-- Filters -->
                <div class="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
                    <select bind:value={currentSession} onchange={handleSessionChange} class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
                        {#each data.sessions as session (session.id)}
                            <option value={session.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{session.name}</option>
                        {/each}
                    </select>

                    <select 
                        bind:value={currentClass} 
                        onchange={handleClassChange}
                        class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        <option value="" class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">Select class</option>
                        {#each data.classes as cls (cls.id)}
                            <option value={cls.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">{cls.name}</option>
                        {/each}
                    </select>

                    <select 
                        bind:value={currentSection}
                        onchange={() => fetchStudents(1)}
                        class="rounded-xl border border-slate-200 dark:border-white/10 transition-colors bg-slate-100 dark:bg-white/5 transition-colors py-2.5 pl-3 pr-8 text-sm text-slate-900 dark:text-white transition-colors focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        <option value="" class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">Select section</option>
                        {#each sections as sec (sec.id)}
                            <option value={sec.id.toString()} class="bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white transition-colors">Section {sec.letter}</option>
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
								<th scope="col" class="py-4 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors sm:pl-6">SL</th>
								<th scope="col" class="py-4 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Portal ID</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Name</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Class</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Section</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Roll</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">DOB</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Father's Name</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white transition-colors">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
							{#each students as student, i (student.sid)}
							<tr class="transition hover:bg-slate-50 dark:hover:bg-white/4">
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors sm:pl-6">
                                    {((currentPage - 1) * 80) + (i + 1)}
                                </td>
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
                                    <span class="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                                    {student.portalId}
                                    </span>
                                </td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-200 transition-colors font-medium">{student.name}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">{student.className || '-'}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">{student.sectionLetter || '-'}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">{student.rollNo || '-'}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">{student.dob}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">{student.fname}</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
									<a href={resolve(`/dashboard/students/${student.sid}`)} class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 transition inline-block">
                                        View Details
                                    </a>
								</td>
							</tr>
                            {/each}
                            {#if students.length === 0}
                            <tr>
                                <td colspan="9" class="px-6 py-16 text-center">
                                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors ring-1 ring-white/10 mb-4">
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 class="text-sm font-semibold text-slate-900 dark:text-white transition-colors">No students found</h3>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">We couldn't find any records matching your criteria.</p>
                                </td>
                            </tr>
                            {/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400 transition-colors">
            Page <span class="font-medium text-slate-900 dark:text-white transition-colors">{currentPage}</span> of <span class="font-medium text-slate-900 dark:text-white transition-colors">{totalPages}</span>
        </p>
        <div class="flex gap-2">
            <button 
                onclick={() => fetchStudents(1)} 
                disabled={currentPage === 1}
                title="First Page"
                class="hidden sm:inline-flex rounded-xl bg-slate-100 dark:bg-white/5 transition-colors px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors shadow-xs ring-1 ring-inset ring-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                First
            </button>
            <button 
                onclick={() => fetchStudents(currentPage - 1)} 
                disabled={currentPage === 1}
                class="rounded-xl bg-slate-100 dark:bg-white/5 transition-colors px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors shadow-xs ring-1 ring-inset ring-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Previous
            </button>
            <button 
                onclick={() => fetchStudents(currentPage + 1)} 
                disabled={!hasNextPage}
                class="rounded-xl bg-slate-100 dark:bg-white/5 transition-colors px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors shadow-xs ring-1 ring-inset ring-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next
            </button>
            <button 
                onclick={() => fetchStudents(totalPages)} 
                disabled={currentPage === totalPages}
                title="Last Page"
                class="hidden sm:inline-flex rounded-xl bg-slate-100 dark:bg-white/5 transition-colors px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors shadow-xs ring-1 ring-inset ring-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Last
            </button>
        </div>
    </div>
</main>

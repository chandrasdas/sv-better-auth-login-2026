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
    <div class="mb-10 sm:flex sm:items-start sm:justify-between relative overflow-hidden rounded-3xl border border-white/5 bg-linear-to-b from-white/5 to-transparent p-8 shadow-2xl">
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]"></div>
        <div class="relative z-10 flex-1 mb-6 sm:mb-0">
            <h1 class="text-4xl font-bold tracking-tight text-white">Students Registry</h1>
            <p class="mt-3 max-w-2xl text-lg text-slate-400">Manage and search through the student records.</p>
        </div>
        
        <div class="relative z-10 w-full sm:w-auto">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col sm:flex-row gap-3">
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
                            class="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                        >
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-3">
                    <select bind:value={currentSession} onchange={handleSessionChange} class="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-8 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
                        {#each data.sessions as session (session.id)}
                            <option value={session.id.toString()} class="bg-slate-900 text-white">{session.name}</option>
                        {/each}
                    </select>

                    <select 
                        bind:value={currentClass} 
                        onchange={handleClassChange}
                        class="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-8 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        <option value="" class="bg-slate-900 text-white">Select class</option>
                        {#each data.classes as cls (cls.id)}
                            <option value={cls.id.toString()} class="bg-slate-900 text-white">{cls.name}</option>
                        {/each}
                    </select>

                    <select 
                        bind:value={currentSection}
                        onchange={() => fetchStudents(1)}
                        class="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-8 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        <option value="" class="bg-slate-900 text-white">Select section</option>
                        {#each sections as sec (sec.id)}
                            <option value={sec.id.toString()} class="bg-slate-900 text-white">Section {sec.letter}</option>
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
				<div class="overflow-hidden rounded-3xl border border-white/5 bg-white/2 shadow-2xl ring-1 ring-white/5">
					<table class="min-w-full divide-y divide-white/5">
						<thead class="bg-white/5">
							<tr>
								<th scope="col" class="py-4 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">SL</th>
								<th scope="col" class="py-4 pl-4 pr-3 text-left text-sm font-semibold text-white">Portal ID</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Name</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Class</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Section</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Roll</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">DOB</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Father's Name</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5 bg-transparent">
							{#each students as student, i (student.sid)}
							<tr class="transition hover:bg-white/4">
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300 sm:pl-6">
                                    {((currentPage - 1) * 80) + (i + 1)}
                                </td>
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300">
                                    <span class="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                                    {student.portalId}
                                    </span>
                                </td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-200 font-medium">{student.name}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.className || '-'}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.sectionLetter || '-'}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.rollNo || '-'}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.dob}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.fname}</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
									<a href={resolve(`/dashboard/students/${student.sid}`)} class="text-indigo-400 hover:text-indigo-300 transition inline-block">
                                        View Details
                                    </a>
								</td>
							</tr>
                            {/each}
                            {#if students.length === 0}
                            <tr>
                                <td colspan="9" class="px-6 py-16 text-center">
                                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400 ring-1 ring-white/10 mb-4">
                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 class="text-sm font-semibold text-white">No students found</h3>
                                    <p class="mt-1 text-sm text-slate-400">We couldn't find any records matching your criteria.</p>
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
        <p class="text-sm text-slate-400">
            Page <span class="font-medium text-white">{currentPage}</span> of <span class="font-medium text-white">{totalPages}</span>
        </p>
        <div class="flex gap-2">
            <button 
                onclick={() => fetchStudents(1)} 
                disabled={currentPage === 1}
                title="First Page"
                class="hidden sm:inline-flex rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                First
            </button>
            <button 
                onclick={() => fetchStudents(currentPage - 1)} 
                disabled={currentPage === 1}
                class="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Previous
            </button>
            <button 
                onclick={() => fetchStudents(currentPage + 1)} 
                disabled={!hasNextPage}
                class="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next
            </button>
            <button 
                onclick={() => fetchStudents(totalPages)} 
                disabled={currentPage === totalPages}
                title="Last Page"
                class="hidden sm:inline-flex rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Last
            </button>
        </div>
    </div>
</main>

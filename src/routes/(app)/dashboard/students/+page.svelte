<script lang="ts">
	import { getSections } from './students.remote';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { APP_NAME } from '$lib/config';

	let { data } = $props();
	let hasFilters = $derived(data.query || data.filters.session || data.filters.class || data.filters.section);

	// Reactive state for dropdowns
	let currentClass = $state(data.filters.class);
	let sections = $state(data.sections);
	let currentSection = $state(data.filters.section);

	$effect(() => {
		currentClass = data.filters.class;
		sections = data.sections;
		currentSection = data.filters.section;
	});

	// Get the display names for the active filter badges
	let sessionName = $derived(
		data.filters.session
			? data.sessions.find(s => s.id.toString() === data.filters.session)?.name ?? data.filters.session
			: ''
	);

	let className = $derived(
		data.filters.class
			? data.classes.find(c => c.id.toString() === data.filters.class)?.name ?? data.filters.class
			: ''
	);

	let sectionLetter = $derived(
		data.filters.section
			? data.sections.find(s => s.id.toString() === data.filters.section)?.letter ?? data.filters.section
			: ''
	);

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
	}

	// Returns only the query string (e.g. "?page=1&session=2") after removing keyToRemove.
	function removeFilterQs(keyToRemove: string): string {
		const params = new SvelteURLSearchParams();
		if (keyToRemove !== 'q' && data.query) params.set('q', data.query);
		if (keyToRemove !== 'session' && data.filters.session) params.set('session', data.filters.session);
		if (keyToRemove !== 'class' && data.filters.class) params.set('class', data.filters.class);
		if (keyToRemove !== 'section' && data.filters.section) params.set('section', data.filters.section);
		params.set('page', '1');
		const qs = params.toString();
		return qs ? `?${qs}` : '';
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
            <form action="" method="GET" class="flex flex-col gap-3">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative w-full sm:w-72">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            name="q"
                            value={data.query || ''}
                            placeholder="Search name or Portal ID..." 
                            class="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                        >
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-3">
                    <select name="session" value={data.filters.session} class="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-8 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition">
                        {#each data.sessions as session (session.id)}
                            <option value={session.id.toString()} class="bg-slate-900 text-white">{session.name}</option>
                        {/each}
                    </select>

                    <select 
                        name="class" 
                        value={currentClass} 
                        onchange={handleClassChange}
                        class="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-8 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        {#each data.classes as cls (cls.id)}
                            <option value={cls.id.toString()} class="bg-slate-900 text-white">Class {cls.name}</option>
                        {/each}
                    </select>

                    <select 
                        name="section" 
                        bind:value={currentSection}
                        class="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-8 text-sm text-white focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        {#each sections as sec (sec.id)}
                            <option value={sec.id.toString()} class="bg-slate-900 text-white">Section {sec.letter}</option>
                        {/each}
                    </select>
                    
                    <!-- We always submit page 1 when clicking the main search button -->
                    <button type="submit" name="page" value="1" class="inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        Filter
                    </button>

                    <a 
                        href={resolve('/(app)/dashboard/students')} 
                        class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 {hasFilters ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 opacity-50 cursor-not-allowed pointer-events-none'}"
                        aria-disabled={!hasFilters}
                    >
                        Clear
                    </a>
                </div>
            </form>
        </div>
    </div>

    <!-- Active Filter Badges -->
    {#if hasFilters}
    <div class="mt-6 flex flex-wrap items-center gap-2" transition:fade={{ duration: 200 }}>
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider mr-1">Active filters:</span>
        {#if data.query}
            <a href="{resolve('/(app)/dashboard/students')}{removeFilterQs('q')}"
               class="group inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/25 hover:bg-indigo-500/25 hover:ring-indigo-400/40 transition-all">
                <span class="text-indigo-400/70">Search:</span> {data.query}
                <svg class="h-3.5 w-3.5 text-indigo-400/50 group-hover:text-indigo-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
        {/if}
        {#if data.filters.session}
            <a href="{resolve('/(app)/dashboard/students')}{removeFilterQs('session')}"
               class="group inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/25 hover:bg-emerald-500/25 hover:ring-emerald-400/40 transition-all">
                <span class="text-emerald-400/70">Session:</span> {sessionName}
                <svg class="h-3.5 w-3.5 text-emerald-400/50 group-hover:text-emerald-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
        {/if}
        {#if data.filters.class}
            <a href="{resolve('/(app)/dashboard/students')}{removeFilterQs('class')}"
               class="group inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-500/25 hover:bg-amber-500/25 hover:ring-amber-400/40 transition-all">
                <span class="text-amber-400/70">Class:</span> {className}
                <svg class="h-3.5 w-3.5 text-amber-400/50 group-hover:text-amber-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
        {/if}
        {#if data.filters.section}
            <a href="{resolve('/(app)/dashboard/students')}{removeFilterQs('section')}"
               class="group inline-flex items-center gap-1.5 rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-inset ring-rose-500/25 hover:bg-rose-500/25 hover:ring-rose-400/40 transition-all">
                <span class="text-rose-400/70">Section:</span> {sectionLetter}
                <svg class="h-3.5 w-3.5 text-rose-400/50 group-hover:text-rose-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </a>
        {/if}
    </div>
    {/if}

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
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">DOB</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Father's Name</th>
								<th scope="col" class="px-3 py-4 text-left text-sm font-semibold text-white">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5 bg-transparent">
							{#each data.students as student, i (student.sid)}
							<tr class="transition hover:bg-white/4">
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300 sm:pl-6">
                                    {((data.page - 1) * 20) + (i + 1)}
                                </td>
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-300">
                                    <span class="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                                    {student.portalId}
                                    </span>
                                </td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-200 font-medium">{student.name}</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.dob}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{student.fname}</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
									<button class="text-indigo-400 hover:text-indigo-300 transition">
                                        View Details
                                    </button>
								</td>
							</tr>
                            {/each}
                            {#if data.students.length === 0}
                            <tr>
                                <td colspan="6" class="px-6 py-16 text-center">
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
            Page <span class="font-medium text-white">{data.page}</span> of <span class="font-medium text-white">{data.totalPages}</span>
        </p>
        <form method="GET" class="flex gap-2">
            <!-- Hidden inputs to preserve filters during pagination -->
            <input type="hidden" name="q" value={data.query || ''} />
            <input type="hidden" name="session" value={data.filters.session} />
            <input type="hidden" name="class" value={data.filters.class} />
            <input type="hidden" name="section" value={data.filters.section} />

            <button 
                type="submit" 
                name="page" 
                value="1" 
                disabled={data.page === 1}
                title="First Page"
                class="hidden sm:inline-flex rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                First
            </button>
            <button 
                type="submit" 
                name="page" 
                value={data.page - 1} 
                disabled={data.page === 1}
                class="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Previous
            </button>
            <button 
                type="submit" 
                name="page" 
                value={data.page + 1} 
                disabled={!data.hasNextPage}
                class="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next
            </button>
            <button 
                type="submit" 
                name="page" 
                value={data.totalPages} 
                disabled={data.page === data.totalPages}
                title="Last Page"
                class="hidden sm:inline-flex rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 shadow-xs ring-1 ring-inset ring-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Last
            </button>
        </form>
    </div>
</main>

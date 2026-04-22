<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { APP_NAME } from '$lib/config';
    import { resolve } from '$app/paths';

    let { data } = $props();
    let student = $derived(data.student);
    let enrollment = $derived(data.enrollment);

    // Format DOB for display (assuming format like YYYY-MM-DD or whatever is stored)
    let formattedDob = $derived(student.dob); 
    let isTransferred = $derived(student.transferDate !== null);
</script>

<svelte:head>
    <title>{student.name} | {APP_NAME}</title>
</svelte:head>

<main class="mx-auto min-h-[101vh] max-w-5xl px-4 py-12 sm:px-6 lg:px-8" in:fade={{ duration: 400 }}>
    
    <!-- Breadcrumb / Back Navigation -->
    <nav class="mb-8 flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
            <li>
                <div>
                    <a href={resolve('/dashboard/students')} class="text-slate-400 hover:text-white transition flex items-center gap-2">
                        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span class="text-sm font-medium">Back to Students</span>
                    </a>
                </div>
            </li>
        </ol>
    </nav>

    <!-- Profile Header Card -->
    <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl mb-8" in:fly={{ y: 20, duration: 500, delay: 100 }}>
        <!-- Glow effects -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]"></div>
        <div class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <!-- Profile Image Placeholder -->
            <div class="relative shrink-0">
                <div class="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 blur-md opacity-50"></div>
                <div class="relative h-32 w-32 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                    <svg class="h-20 w-20 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                {#if isTransferred}
                    <span class="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 ring-2 ring-slate-900" title="Transferred">
                        <span class="h-2.5 w-2.5 rounded-full bg-white"></span>
                    </span>
                {:else}
                    <span class="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Active"></span>
                {/if}
            </div>

            <!-- Profile Primary Info -->
            <div class="flex-1 text-center md:text-left">
                <div class="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                    <h1 class="text-3xl font-bold tracking-tight text-white">{student.name}</h1>
                    <span class="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                        Portal ID: {student.portalId}
                    </span>
                </div>
                <p class="text-lg text-slate-300 mb-4">{student.fname} <span class="text-slate-500 text-sm">(Father's Name)</span></p>

                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    {#if enrollment}
                        <div class="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 ring-1 ring-white/10">
                            <span class="text-sm text-slate-400">Class:</span>
                            <span class="font-semibold text-white">{enrollment.className}</span>
                        </div>
                        <div class="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 ring-1 ring-white/10">
                            <span class="text-sm text-slate-400">Section:</span>
                            <span class="font-semibold text-white">{enrollment.sectionLetter}</span>
                        </div>
                        <div class="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 ring-1 ring-white/10">
                            <span class="text-sm text-slate-400">Roll No:</span>
                            <span class="font-semibold text-white">{enrollment.rollNo}</span>
                        </div>
                    {:else}
                        <div class="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 ring-1 ring-amber-500/20 text-amber-400 text-sm">
                            No current session enrollment
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8" in:fly={{ y: 20, duration: 500, delay: 200 }}>
        
        <!-- Personal Details -->
        <div class="rounded-3xl border border-white/5 bg-white/5 p-6 h-full">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Details
            </h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                    <dt class="text-sm font-medium text-slate-400">Date of Birth</dt>
                    <dd class="mt-1 text-sm text-white font-medium">{formattedDob}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-400">Caste</dt>
                    <dd class="mt-1 text-sm text-white font-medium">{student.caste}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-400">Guardian Contact</dt>
                    <dd class="mt-1 text-sm text-white font-medium">{student.guardianNo}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-400">Message Contact</dt>
                    <dd class="mt-1 text-sm text-white font-medium">{student.messageNo}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-400">PEN Number</dt>
                    <dd class="mt-1 text-sm text-white font-medium">{student.penNo || 'N/A'}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-400">Status</dt>
                    <dd class="mt-1 text-sm">
                        {#if isTransferred}
                            <span class="text-red-400 font-medium">Transferred on {student.transferDate}</span>
                        {:else}
                            <span class="text-emerald-400 font-medium">Active</span>
                        {/if}
                    </dd>
                </div>
            </dl>
        </div>

        <!-- Academic History / Additional Info Placeholder -->
        <div class="rounded-3xl border border-white/5 bg-white/5 p-6 flex flex-col h-full">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Academic Context
            </h2>
            
            <div class="flex-1 flex flex-col items-center justify-center min-h-[12rem] rounded-xl border border-dashed border-white/10 bg-white/2 p-6">
                <svg class="h-10 w-10 text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm text-slate-400 text-center">
                    Academic performance and historical records will be displayed here in future updates.
                </p>
            </div>
        </div>

    </div>

</main>

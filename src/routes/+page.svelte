<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import { APP_NAME } from '$lib/config';
	import LogoIcon from '$lib/components/LogoIcon.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	let { data } = $props();

	const authSession = authClient.useSession();
</script>

<svelte:head>
	<title>{APP_NAME} | School Management Portal</title>
</svelte:head>

<div class="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
	<!-- Ambient Background Gradients -->
	<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100 dark:from-indigo-900/20 via-slate-50 dark:via-slate-950 to-slate-50 dark:to-slate-950 pointer-events-none transition-colors"></div>
	<div class="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-200/40 dark:bg-indigo-600/10 blur-[120px] pointer-events-none transition-colors"></div>
	<div class="absolute -bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-200/40 dark:bg-violet-600/10 blur-[120px] pointer-events-none transition-colors"></div>

	<!-- Navigation Menu -->
	<nav class="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl transition-colors">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg">
					<LogoIcon class="h-5 w-5 text-white" />
				</div>
				<span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">{APP_NAME}</span>
			</div>

			<div class="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
				<ThemeToggle />
				{#if $authSession?.data?.session || data.session}
					<span class="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Welcome, {$authSession?.data?.user?.name || data.user?.name || 'User'}</span>
					<a href={resolve('/dashboard')} data-sveltekit-reload class="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-400">Go to Dashboard</a>
				{:else}
					<a href={resolve('/login')} class="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Sign In</a>
					<a href={resolve('/register')} class="rounded-full bg-slate-900 dark:bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:hover:bg-white/20 hover:-translate-y-0.5">Register</a>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<header class="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 text-center">
		<div class="mx-auto max-w-4xl">
			<div class="inline-flex items-center rounded-full border border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-8 transition-colors">
				<span class="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
				Next-Generation School Management
			</div>
			<h1 class="mb-8 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-7xl leading-tight transition-colors">
				Manage your institution with 
				<span class="bg-linear-to-r from-indigo-500 dark:from-indigo-400 to-violet-600 dark:to-violet-500 bg-clip-text text-transparent">clarity & precision.</span>
			</h1>
			<p class="mb-10 text-lg text-slate-500 dark:text-slate-400 sm:text-xl max-w-2xl mx-auto leading-relaxed transition-colors">
				{APP_NAME} is a modern, comprehensive portal designed to streamline administrative tasks, track academic progress, and empower educators and students alike.
			</p>
			
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				{#if $authSession?.data?.session || data.session}
					<a href={resolve('/dashboard')} data-sveltekit-reload class="w-full sm:w-auto rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-1 hover:bg-indigo-400">
						Go to Dashboard
					</a>
				{:else}
					<a href={resolve('/register')} class="w-full sm:w-auto rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-1 hover:bg-indigo-400">
						Create Institution Account
					</a>
					<a href={resolve('/login')} class="w-full sm:w-auto rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-8 py-4 text-base font-semibold text-slate-900 dark:text-white transition hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-white/10">
						Sign In
					</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- Features Section -->
	<section class="relative z-10 mx-auto max-w-7xl px-6 py-20 pb-32">
		<div class="mb-16 text-center">
			<h2 class="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl transition-colors">Everything you need to run your school</h2>
			<p class="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">Powerful features packed into an intuitive, modern interface.</p>
		</div>
		
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Feature 1 -->
			<div class="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-none backdrop-blur-sm transition hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:-translate-y-1">
				<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold text-slate-900 dark:text-white transition-colors">Student Management</h3>
				<p class="text-slate-500 dark:text-slate-400 leading-relaxed text-sm transition-colors">Easily maintain dynamic profiles for all students. Formatted records, instant lookups, and rich insights kept secure.</p>
			</div>
			
			<!-- Feature 2 -->
			<div class="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-none backdrop-blur-sm transition hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:-translate-y-1">
				<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 transition-colors">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold text-slate-900 dark:text-white transition-colors">Academic Tracking</h3>
				<p class="text-slate-500 dark:text-slate-400 leading-relaxed text-sm transition-colors">Monitor grades, assignments, and attendance in real time. Provide transparent reports to students and parents.</p>
			</div>
			
			<!-- Feature 3 -->
			<div class="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-none backdrop-blur-sm transition hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:-translate-y-1">
				<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold text-slate-900 dark:text-white transition-colors">Secure Access</h3>
				<p class="text-slate-500 dark:text-slate-400 leading-relaxed text-sm transition-colors">Built with the modern Better Auth standard, ensuring all your institutional data is encrypted, compliant, and safe.</p>
			</div>
		</div>
	</section>
</div>

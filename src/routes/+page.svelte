<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	let { data } = $props();

	const authSession = authClient.useSession();
</script>

<svelte:head>
	<title>Darpan | School Management Portal</title>
</svelte:head>

<div class="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
	<!-- Ambient Background Gradients -->
	<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
	<div class="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
	<div class="absolute -bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

	<!-- Navigation Menu -->
	<nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg">
					<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6M12 14l5-2.778" />
					</svg>
				</div>
				<span class="text-xl font-bold tracking-tight text-white">Darpan</span>
			</div>

			<div class="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
				{#if $authSession?.data?.session || data.session}
					<span class="text-sm font-medium text-slate-300">Welcome, {$authSession?.data?.user?.name || data.user?.name || 'User'}</span>
					<a href={resolve('/dashboard')} class="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-400">Go to Dashboard</a>
				{:else}
					<a href={resolve('/login')} class="text-sm font-medium text-slate-300 transition hover:text-indigo-400">Sign In</a>
					<a href={resolve('/register')} class="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20 hover:-translate-y-0.5">Register</a>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<header class="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 text-center">
		<div class="mx-auto max-w-4xl">
			<div class="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-8">
				<span class="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
				Next-Generation School Management
			</div>
			<h1 class="mb-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-7xl leading-tight">
				Manage your institution with 
				<span class="bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">clarity & precision.</span>
			</h1>
			<p class="mb-10 text-lg text-slate-400 sm:text-xl max-w-2xl mx-auto leading-relaxed">
				Darpan is a modern, comprehensive portal designed to streamline administrative tasks, track academic progress, and empower educators and students alike.
			</p>
			
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				{#if $authSession?.data?.session || data.session}
					<a href={resolve('/dashboard')} class="w-full sm:w-auto rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-1 hover:bg-indigo-400">
						Go to Dashboard
					</a>
				{:else}
					<a href={resolve('/register')} class="w-full sm:w-auto rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-1 hover:bg-indigo-400">
						Create Institution Account
					</a>
					<a href={resolve('/login')} class="w-full sm:w-auto rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10">
						Sign In
					</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- Features Section -->
	<section class="relative z-10 mx-auto max-w-7xl px-6 py-20 pb-32">
		<div class="mb-16 text-center">
			<h2 class="text-3xl font-bold text-white sm:text-4xl">Everything you need to run your school</h2>
			<p class="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Powerful features packed into an intuitive, modern interface.</p>
		</div>
		
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Feature 1 -->
			<div class="rounded-2xl border border-white/5 bg-slate-900/50 p-8 backdrop-blur-sm transition hover:bg-slate-900/80 hover:-translate-y-1">
				<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold text-white">Student Management</h3>
				<p class="text-slate-400 leading-relaxed text-sm">Easily maintain dynamic profiles for all students. Formatted records, instant lookups, and rich insights kept secure.</p>
			</div>
			
			<!-- Feature 2 -->
			<div class="rounded-2xl border border-white/5 bg-slate-900/50 p-8 backdrop-blur-sm transition hover:bg-slate-900/80 hover:-translate-y-1">
				<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold text-white">Academic Tracking</h3>
				<p class="text-slate-400 leading-relaxed text-sm">Monitor grades, assignments, and attendance in real time. Provide transparent reports to students and parents.</p>
			</div>
			
			<!-- Feature 3 -->
			<div class="rounded-2xl border border-white/5 bg-slate-900/50 p-8 backdrop-blur-sm transition hover:bg-slate-900/80 hover:-translate-y-1">
				<div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold text-white">Secure Access</h3>
				<p class="text-slate-400 leading-relaxed text-sm">Built with the modern Better Auth standard, ensuring all your institutional data is encrypted, compliant, and safe.</p>
			</div>
		</div>
	</section>
</div>

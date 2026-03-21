<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Home | NextGen App</title>
</svelte:head>

<div class="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
	<!-- Ambient Background Gradients -->
	<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
	<div class="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
	<div class="absolute -bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

	<!-- Navigation Menu -->
	<nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg">
					<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<span class="text-lg font-bold tracking-tight text-white">NextGen App</span>
			</div>

			<div class="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
				<a href={resolve('/')} class="text-sm font-medium text-white transition hover:text-indigo-400">Home</a>
				<a href={resolve('/about')} class="text-sm font-medium text-slate-300 transition hover:text-indigo-400">About</a>
				<a href={resolve('/login')} class="text-sm font-medium text-slate-300 transition hover:text-indigo-400">Login</a>
				<a href={resolve('/register')} class="rounded-full bg-white/10 px-4 md:px-5 py-1.5 md:py-2 text-sm font-medium text-white transition hover:bg-white/20">Register</a>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<main class="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 text-center">
		<div class="mx-auto max-w-3xl">
			<h1 class="mb-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
				Build your next big idea
				<span class="bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">faster.</span>
			</h1>
			<p class="mb-10 text-lg text-slate-400 sm:text-xl max-w-2xl mx-auto">
				A beautiful, modern, and high-performance template built with SvelteKit, Tailwind CSS, and Better Auth. Everything you need to launch today.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<a href={resolve('/register')} class="w-full sm:w-auto rounded-full bg-indigo-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-1 hover:bg-indigo-400">
					Get Started Free
				</a>
				<a href={resolve('/about')} class="w-full sm:w-auto rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10">
					Learn More
				</a>
			</div>
		</div>
	</main>
</div>

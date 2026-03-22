<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>About Us | NextGen App</title>
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
				<a href={resolve('/')} class="text-sm font-medium text-slate-300 transition hover:text-indigo-400">Home</a>
				<a href={resolve('/about')} class="text-sm font-medium text-white transition hover:text-indigo-400">About</a>
				<a href={resolve('/login')} class="text-sm font-medium text-slate-300 transition hover:text-indigo-400">Login</a>
				<a href={resolve('/register')} class="rounded-full bg-white/10 px-4 md:px-5 py-1.5 md:py-2 text-sm font-medium text-white transition hover:bg-white/20">Register</a>
			</div>
		</div>
	</nav>

	<!-- About Section -->
	<main class="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 text-center">
		<div class="mx-auto max-w-4xl">
			<h1 class="mb-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
				We are building the
				<span class="bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">future of auth.</span>
			</h1>
			<p class="mb-16 text-lg text-slate-400 sm:text-xl max-w-2xl mx-auto leading-relaxed">
				Security should be simple. We've dedicated our efforts to providing developers with tools that protect their users, scale flawlessly, and feel effortless.
			</p>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-20">
				<!-- Feature Value 1 -->
				<div class="rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-white/10">
					<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold text-white">Uncompromising Security</h3>
					<p class="text-slate-400 leading-relaxed text-sm">
						Built on universally trusted standards, deeply audited, and equipped to handle edge-case vulnerabilities by design, not as an afterthought.
					</p>
				</div>

				<!-- Feature Value 2 -->
				<div class="rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-md transition-all hover:border-blue-500/50 hover:bg-white/10">
					<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold text-white">Ludicrous Speed</h3>
					<p class="text-slate-400 leading-relaxed text-sm">
						With zero-cold-start edge capabilities and tiny bundle sizes, your authentications resolve faster than the blink of an eye.
					</p>
				</div>

				<!-- Feature Value 3 -->
				<div class="rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-md transition-all hover:border-violet-500/50 hover:bg-white/10">
					<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold text-white">Developer Joy</h3>
					<p class="text-slate-400 leading-relaxed text-sm">
						Intuitive APIs, comprehensive documentation, and a thriving community. We obsess over the developer experience so you don't have to.
					</p>
				</div>
			</div>
			
			<div class="mt-24 pt-10 border-t border-white/10">
				<p class="text-slate-500 text-sm">
					© 2026 NextGen App. Built with precision and care.
				</p>
			</div>
		</div>
	</main>
</div>

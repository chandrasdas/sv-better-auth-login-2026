<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade, slide } from 'svelte/transition';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: loginError } = await authClient.signIn.email({
			email,
			password
		});

		loading = false;

		if (loginError) {
			error = loginError.message || 'Invalid email or password.';
		} else {
			await goto(resolve('/dashboard'));
		}
	}
</script>

<svelte:head>
	<title>Login | NextGen App</title>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30">
	<!-- Back to Home Link -->
	<a href={resolve('/')} class="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
		Back to Home
	</a>

	<!-- Ambient Background Gradients -->
	<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
	<div class="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]"></div>
	<div class="absolute -bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[120px]"></div>

	<div class="relative z-10 w-full max-w-md p-8" in:fade={{ duration: 600, delay: 100 }}>
		<div class="mb-10 text-center">
			<div class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
				<svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
				</svg>
			</div>
			<h1 class="bg-linear-to-br from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">Welcome back</h1>
			<p class="mt-3 text-sm text-slate-400">Enter your credentials to access your account.</p>
		</div>

		<div class="rounded-3xl border border-white/5 bg-white/2 p-8 shadow-2xl backdrop-blur-3xl">
			<form onsubmit={handleLogin} class="space-y-5">
				{#if error}
					<div in:slide class="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
						{error}
					</div>
				{/if}

				<div class="space-y-1">
					<label for="email" class="text-xs font-medium uppercase tracking-wider text-slate-400">Email Address</label>
					<div class="relative">
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							placeholder="name@example.com"
							class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<div class="flex items-center justify-between">
						<label for="password" class="text-xs font-medium uppercase tracking-wider text-slate-400">Password</label>
						<a href={resolve('/forgot-password')} class="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
					</div>
					<div class="relative">
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							placeholder="••••••••"
							class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70"
				>
					<div class="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
						<div class="relative h-full w-8 bg-white/20"></div>
					</div>
					{#if loading}
						<svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
						Signing in...
					{:else}
						Sign In
						<svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
					{/if}
				</button>
			</form>
		</div>

		<p class="mt-8 text-center text-sm text-slate-400">
			Don't have an account?
			<a href={resolve('/register')} class="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Sign up here</a>
		</p>
	</div>
</div>

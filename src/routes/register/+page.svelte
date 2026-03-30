<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade, slide } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';
	import LogoIcon from '$lib/components/LogoIcon.svelte';

	let step = $state(1); // 1 = Email, 2 = OTP, 3 = Password
	let email = $state('');
	let otp = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let name = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSendOTP(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/register/otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'send', email })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Failed to send verification code.';
			} else {
				// OTP sent successfully, save the given name (if any)
				if (data.name) {
					name = data.name;
				}
				step = 2;
			}
		} catch {
			error = 'Network error. Please try again later.';
		} finally {
			loading = false;
		}
	}

	async function handleVerifyOTP(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/register/otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'verify', email, otp })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Invalid verification code.';
			} else {
				// OTP verified successfully
				step = 3;
			}
		} catch {
			error = 'Network error. Please try again later.';
		} finally {
			loading = false;
		}
	}

	async function handleFinalRegister(e: Event) {
		e.preventDefault();
		
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}
		
		loading = true;
		error = '';

		const { error: registerError } = await authClient.signUp.email({
			email,
			password,
			name
		});

		loading = false;

		if (registerError) {
			if (registerError.status === 500) {
				error = 'Internal server error. Please try again later.';
			} else {
				error = registerError.message || 'An error occurred during registration.';
			}
		} else {
			await goto(resolve('/dashboard'));
		}
	}
</script>

<svelte:head>
	<title>Register | {APP_NAME}</title>
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
				<LogoIcon class="h-7 w-7 text-white" />
			</div>
			<h1 class="bg-linear-to-br from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
				{#if step === 1}
					Create an account
				{:else if step === 2}
					Verify your email
				{:else}
					Set your password
				{/if}
			</h1>
			<p class="mt-3 text-sm text-slate-400">
				{#if step === 1}
					Staff registration is an invite-only process.
				{:else if step === 2}
					We've sent a 6-digit code to {email}
				{:else}
					Almost done! Choose a secure password.
				{/if}
			</p>
		</div>

		<div class="rounded-3xl border border-white/5 bg-white/2 p-8 shadow-2xl backdrop-blur-3xl">
			<form onsubmit={step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleFinalRegister} class="space-y-5">
				{#if error}
					<div in:slide class="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
						{error}
					</div>
				{/if}

				{#if step === 1}
					<div class="space-y-1" in:fade>
						<label for="email" class="text-xs font-medium uppercase tracking-wider text-slate-400">School Email Address</label>
						<div class="relative">
							<input
								type="email"
								id="email"
								bind:value={email}
								required
								placeholder="name@school.edu"
								class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							/>
						</div>
					</div>
				{/if}

				{#if step === 2}
					<div class="space-y-1" in:fade>
						<label for="otp" class="text-xs font-medium uppercase tracking-wider text-slate-400">6-Digit Verification Code</label>
						<div class="relative">
							<input
								type="text"
								id="otp"
								bind:value={otp}
								required
								maxlength="6"
								placeholder="123456"
								class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							/>
						</div>
					</div>
				{/if}

				{#if step === 3}
					<div class="space-y-1" in:fade>
						<label for="password" class="text-xs font-medium uppercase tracking-wider text-slate-400">Password</label>
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
					
					<div class="space-y-1" in:fade>
						<label for="confirmPassword" class="text-xs font-medium uppercase tracking-wider text-slate-400">Confirm Password</label>
						<div class="relative">
							<input
								type="password"
								id="confirmPassword"
								bind:value={confirmPassword}
								required
								placeholder="••••••••"
								class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							/>
						</div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading || (step === 2 && otp.length !== 6)}
					class="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70"
				>
					<div class="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(100%)]">
						<div class="relative h-full w-8 bg-white/20"></div>
					</div>
					{#if loading}
						<svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
						Processing...
					{:else}
						{#if step === 1}
							Send Verification Code
						{:else if step === 2}
							Verify Code
						{:else}
							Complete Registration
						{/if}
						<svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
					{/if}
				</button>
				
				{#if step > 1 && !loading}
					<button 
						type="button" 
						onclick={() => step = step - 1}
						class="mt-4 w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
					>
						Go Back
					</button>
				{/if}
			</form>
		</div>

		{#if step === 1}
			<p class="mt-8 text-center text-sm text-slate-400">
				Already have an account?
				<a href={resolve('/login')} class="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Sign in here</a>
			</p>
		{/if}
	</div>
</div>

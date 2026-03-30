<script lang="ts">
	import { resolve } from '$app/paths';

	let step = $state(1); // 1: Email, 2: OTP, 3: Reset Password
	let email = $state('');
	let otp = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let token = $state(''); // Stores the Better-Auth compatible token returned from OTP verify
	
	let loading = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	async function handleSendEmail(e: Event) {
		e.preventDefault();
		errorMsg = '';
		loading = true;
		
		try {
			const res = await fetch('/api/forgot-password/otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'send', email })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
			
			step = 2;
			successMsg = 'An OTP has been sent to your email address.';
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}

	async function handleVerifyOTP(e: Event) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';
		loading = true;
		
		try {
			const res = await fetch('/api/forgot-password/otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'verify', email, otp })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to verify OTP.');
			
			token = data.verifiedToken; // Set the internal auth token temporarily
			step = 3; 
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}

	async function handleResetPassword(e: Event) {
		e.preventDefault();
		errorMsg = '';
		
		if (newPassword !== confirmPassword) {
			errorMsg = 'Passwords do not match.';
			return;
		}
		if (newPassword.length < 8) {
			errorMsg = 'Password must be at least 8 characters long.';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/forgot-password/reset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, newPassword })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to reset password.');
			
			successMsg = 'Your password has been successfully reset! Redirecting to login...';
			step = 4; // Final success state
			setTimeout(() => {
				window.location.href = resolve('/login');
			}, 3000);
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30">
	<!-- Ambient Background Glow -->
	<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
		<div class="h-160 w-160 rounded-full bg-indigo-600/10 mix-blend-screen blur-3xl filter transition-opacity duration-1000"></div>
	</div>

	<div class="relative z-10 w-full max-w-md px-4 sm:px-0">
		<div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl transition-all duration-300">
			<div class="p-8 sm:p-10">
				
				<div class="mb-8 text-center">
					<h1 class="text-3xl font-bold tracking-tight text-white mb-2">Forgot Password</h1>
					{#if step === 1}
						<p class="text-sm text-slate-400">Enter your email to receive a secure 6-digit OTP code.</p>
					{:else if step === 2}
						<p class="text-sm text-slate-400">Check your email. We've sent a 6-digit verification code to <span class="font-medium text-slate-300">{email}</span>.</p>
					{:else if step === 3}
						<p class="text-sm text-slate-400">Create a new, strong password.</p>
					{:else if step === 4}
						<p class="text-sm text-emerald-400">Password Reset Complete.</p>
					{/if}
				</div>

				{#if errorMsg}
					<div class="mb-6 rounded-lg bg-orange-500/10 border border-orange-500/20 p-4 animate-in fade-in slide-in-from-top-2 text-center text-sm font-medium text-orange-400 shadow-sm backdrop-blur-md">
						{errorMsg}
					</div>
				{/if}

				{#if successMsg && step !== 4}
					<div class="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 animate-in fade-in slide-in-from-top-2 text-center text-sm font-medium text-emerald-400 shadow-sm backdrop-blur-md">
						{successMsg}
					</div>
				{/if}

				{#if step === 1}
					<form onsubmit={handleSendEmail} class="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
						<div class="space-y-2">
							<label for="email" class="text-xs font-medium uppercase tracking-wider text-slate-400">Email Address</label>
							<div class="relative">
								<input
									id="email"
									type="email"
									autocomplete="email"
									bind:value={email}
									required
									placeholder="you@example.com"
									class="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading || !email}
							class="group relative flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
						>
							{#if loading}
								<svg class="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							{:else}
								Get Verification Code
							{/if}
						</button>
					</form>
				{:else if step === 2}
					<form onsubmit={handleVerifyOTP} class="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
						<div class="space-y-2">
							<label for="otp" class="text-xs font-medium uppercase tracking-wider text-slate-400">6-Digit Verification Code</label>
							<input
								id="otp"
								type="text"
								inputmode="numeric"
								maxlength="6"
								pattern="[0-9]*"
								bind:value={otp}
								required
								placeholder="------"
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white transition-colors focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							/>
						</div>

						<div class="flex flex-col gap-3">
							<button
								type="submit"
								disabled={loading || otp.length !== 6}
								class="group relative flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
							>
								{#if loading}
									<svg class="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Verifying...
								{:else}
									Verify Code
								{/if}
							</button>
							<button 
								type="button" 
								onclick={handleSendEmail} 
								disabled={loading}
								class="w-full text-center text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50"
							>
								Resend Code
							</button>
						</div>
					</form>
				{:else if step === 3}
					<form onsubmit={handleResetPassword} class="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
						<div class="space-y-2">
							<label for="new-password" class="text-xs font-medium uppercase tracking-wider text-slate-400">New Password</label>
							<input
								id="new-password"
								type="password"
								bind:value={newPassword}
								required
								placeholder="••••••••"
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white transition-colors focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							/>
						</div>

						<div class="space-y-2">
							<label for="confirm-password" class="text-xs font-medium uppercase tracking-wider text-slate-400">Confirm Password</label>
							<input
								id="confirm-password"
								type="password"
								bind:value={confirmPassword}
								required
								placeholder="••••••••"
								class="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white transition-colors focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							/>
						</div>

						<button
							type="submit"
							disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
							class="group relative flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
						>
							{#if loading}
								<svg class="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Saving...
							{:else}
								Save Password
							{/if}
						</button>
					</form>
				{:else if step === 4}
					<div class="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-500">
						<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30">
							<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 class="mb-2 text-xl font-bold text-white">Password Updated</h3>
						<p class="text-sm text-slate-400">{successMsg}</p>
					</div>
				{/if}
			</div>

			<div class="border-t border-slate-800 bg-slate-800/20 px-8 py-5 text-center text-sm">
				<p class="text-slate-400">
					Remembered your password?
					<a href={resolve('/login')} class="font-medium text-indigo-400 transition-colors hover:text-indigo-300">Log in</a>
				</p>
			</div>
		</div>
	</div>
</div>

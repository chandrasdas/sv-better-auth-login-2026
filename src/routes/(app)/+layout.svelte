<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { APP_NAME } from '$lib/config';
	import LogoIcon from '$lib/components/LogoIcon.svelte';

	let { data, children } = $props();
	let loading = $state(false);

	async function handleLogout() {
		loading = true;
		await authClient.signOut();
		loading = false;
		await goto(resolve('/login'), { invalidateAll: true });
	}
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
	<!-- Navbar -->
	<nav class="sticky top-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<a href={resolve('/')} class="flex items-center gap-3 group transition hover:opacity-80">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
						<LogoIcon class="h-4 w-4 text-white" />
					</div>
					<span class="text-xl font-bold tracking-tight text-white">{APP_NAME}</span>
				</a>
				<div class="flex items-center gap-4">
					<a href={resolve('/')} class="text-sm font-medium text-slate-300 hover:text-white transition">
						Home
					</a>
					<div class="hidden md:block">
						<span class="text-sm font-medium text-slate-300">{data.user?.name}</span>
						{#if data.user?.role}
							<span class="ml-2 rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
								{data.user.role}
							</span>
						{/if}
					</div>
					<button
						onclick={handleLogout}
						disabled={loading}
						class="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
					>
						{#if loading}
							<svg class="h-4 w-4 animate-spin text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
						{:else}
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							Sign Out
						{/if}
					</button>
				</div>
			</div>
		</div>
	</nav>

	{@render children()}
</div>

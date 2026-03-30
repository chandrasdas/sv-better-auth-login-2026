<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';
	import LogoIcon from '$lib/components/LogoIcon.svelte';

	let { data } = $props();
	let loading = $state(false);

	async function handleLogout() {
		loading = true;
		await authClient.signOut();
		loading = false;
		await goto(resolve('/login'), { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Dashboard | {APP_NAME}</title>
</svelte:head>

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

	<main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" in:fade={{ duration: 400 }}>
		<!-- Welcome Section -->
		<div class="mb-12 relative overflow-hidden rounded-3xl border border-white/5 bg-linear-to-b from-white/5 to-transparent p-8 sm:p-10 shadow-2xl">
			<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]"></div>
			<div class="relative z-10">
				<h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
					Welcome back, <span class="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{data.user?.name?.split(' ')[0] || 'User'}</span>
				</h1>
				<p class="mt-4 max-w-2xl text-lg text-slate-400">
					This is your secure dashboard. You've successfully authenticated using Better-Auth with SvelteKit.
				</p>
			</div>
		</div>

		<!-- Dashboard Grid -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Profile Card -->
			<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</div>
				<h3 class="font-semibold text-white">Your Profile</h3>
				<div class="mt-4 space-y-2 text-sm text-slate-400">
					<p><span class="font-medium text-slate-300">Name:</span> {data.user?.name}</p>
					<p><span class="font-medium text-slate-300">Email:</span> {data.user?.email}</p>
					<p><span class="font-medium text-slate-300">ID:</span> {data.user?.id.slice(0, 8)}...</p>
				</div>
			</div>

			<!-- Staff Form Card -->
			<a href={resolve('/dashboard/staff-entry')} class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4 block">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<h3 class="font-semibold text-white">Staff Data Entry</h3>
				<p class="mt-2 text-sm text-slate-400">
					Fill out or update your official staff employment details.
				</p>
				<div class="mt-4 flex items-center text-sm font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
					Open Form <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
				</div>
			</a>

			<!-- Security Card -->
			<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:text-emerald-300">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<h3 class="font-semibold text-white">Security</h3>
				<p class="mt-2 text-sm text-slate-400">
					Your account is protected by industry-standard encryption and secure session management.
				</p>
			</div>
			<!-- Admin: Allowed Staff Card -->
			{#if data.user?.role === 'admin'}
			<a href={resolve('/dashboard/admin/allowed-staff')} class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4 block">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</div>
				<h3 class="font-semibold text-white">Allowed Staff Management</h3>
				<p class="mt-2 text-sm text-slate-400">
					View, add, edit, or remove approved staff members from the registry.
				</p>
				<div class="mt-4 flex items-center text-sm font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
					Manage Staff <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
				</div>
			</a>
			{/if}
			
			<!-- Activity Card -->
			<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4 sm:col-span-2 lg:col-span-3">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 group-hover:bg-amber-500/20 group-hover:text-amber-300">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="font-semibold text-white">Recent Activity</h3>
				<div class="mt-4 flex items-center gap-3">
					<div class="h-2 w-2 rounded-full bg-emerald-400"></div>
					<p class="text-sm text-slate-400">Signed in successfully just now</p>
				</div>
			</div>
		</div>
	</main>
</div>

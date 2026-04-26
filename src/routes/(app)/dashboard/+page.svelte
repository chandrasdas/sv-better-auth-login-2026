<script lang="ts">
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard | {APP_NAME}</title>
</svelte:head>

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

		<!-- Admin: Exam Setup Card -->
		<a href={resolve('/dashboard/admin/exam-setup')} class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4 block">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20 group-hover:bg-teal-500/20 group-hover:text-teal-300 transition">
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
				</svg>
			</div>
			<h3 class="font-semibold text-white">Exam Setup</h3>
			<p class="mt-2 text-sm text-slate-400">
				Configure full marks, pass marks, and other settings for exams across different classes.
			</p>
			<div class="mt-4 flex items-center text-sm font-medium text-teal-400 opacity-0 transition-opacity group-hover:opacity-100">
				Configure Exams <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
			</div>
		</a>

		<!-- Admin: Marks Entry Card -->
		<a href={resolve('/dashboard/admin/marks-entry')} class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4 block">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20 group-hover:bg-orange-500/20 group-hover:text-orange-300 transition">
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</div>
			<h3 class="font-semibold text-white">Marks Entry</h3>
			<p class="mt-2 text-sm text-slate-400">
				Enter and update student marks for any exam. Auto-saves as you type.
			</p>
			<div class="mt-4 flex items-center text-sm font-medium text-orange-400 opacity-0 transition-opacity group-hover:opacity-100">
				Enter Marks <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
			</div>
		</a>
		{/if}
		<!-- Students Card -->
		<a href={resolve('/dashboard/students')} class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:bg-white/4 block">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20 group-hover:bg-pink-500/20 group-hover:text-pink-300 transition">
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			</div>
			<h3 class="font-semibold text-white">Students List</h3>
			<p class="mt-2 text-sm text-slate-400">
				View all registered students and search records by name or portal ID.
			</p>
			<div class="mt-4 flex items-center text-sm font-medium text-pink-400 opacity-0 transition-opacity group-hover:opacity-100">
				View Students <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
			</div>
		</a>
		
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

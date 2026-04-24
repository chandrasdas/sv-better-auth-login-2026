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

	const links = [
		{ name: 'Dashboard', href: '/dashboard-light', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ name: 'Teacher', href: '#', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
		{ name: 'Student', href: '/dashboard/students', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14v5' },
		{ name: 'Exam', href: '#', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
	];
</script>

<div class="min-h-screen bg-slate-50 text-slate-900 font-sans flex selection:bg-indigo-500/30">
	<!-- Sidebar -->
	<aside class="w-64 border-r border-slate-200 bg-white flex-col hidden md:flex sticky top-0 h-screen shadow-sm">
		<div class="h-16 flex items-center px-6 border-b border-slate-100">
			<a href={resolve('/')} class="flex items-center gap-3 group transition hover:opacity-80">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-500/20">
					<LogoIcon class="h-4 w-4 text-white" />
				</div>
				<span class="text-lg font-bold tracking-tight text-slate-800">{APP_NAME}</span>
			</a>
		</div>

		<div class="p-4 flex-1 overflow-y-auto">
			<ul class="space-y-1">
				{#each links as link (link.name)}
					<li>
						<a
							href={resolve(link.href as "/")}
							class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 text-slate-600 hover:text-slate-900"
						>
							<svg class="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon}></path>
							</svg>
							{link.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="p-4 border-t border-slate-100">
			<div class="mb-4 px-2">
				<div class="text-sm font-medium text-slate-800">{data.user?.name}</div>
				{#if data.user?.role}
					<div class="mt-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 uppercase tracking-wide">
						{data.user.role}
					</div>
				{/if}
			</div>
			
			<button
				onclick={handleLogout}
				disabled={loading}
				class="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
			>
				{#if loading}
					<svg class="h-4 w-4 animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					Sign Out
				{/if}
			</button>
		</div>
	</aside>

	<!-- Main Content Wrapper -->
	<div class="flex-1 flex flex-col min-h-0 overflow-hidden">
		<!-- Mobile Header -->
		<header class="md:hidden h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
			<a href={resolve('/')} class="flex items-center gap-2">
				<div class="flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-violet-600 shadow-sm">
					<LogoIcon class="h-3.5 w-3.5 text-white" />
				</div>
				<span class="font-bold text-slate-800">{APP_NAME}</span>
			</a>
			<!-- We'll keep mobile nav simple or omitted for now, user can use desktop view -->
		</header>

		<!-- Main Content Area -->
		<main class="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
			{@render children()}
		</main>
	</div>
</div>

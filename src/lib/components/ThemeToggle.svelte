<script lang="ts">
	import { onMount } from 'svelte';

	let { class: className = '', fullWidth = false } = $props();
	let isDarkMode = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			isDarkMode = true;
			document.documentElement.classList.add('dark');
		} else {
			isDarkMode = false;
			document.documentElement.classList.remove('dark');
		}
	});

	function toggle() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<button
	onclick={toggle}
	class={fullWidth 
		? `w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${className}`
		: `flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm ${className}`}
	aria-label="Toggle Dark Mode"
>
	{#if !mounted}
		<div class="h-5 w-5 opacity-0"></div>
		{#if fullWidth}<span class="opacity-0">Theme</span>{/if}
	{:else if isDarkMode}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
		</svg>
		{#if fullWidth}<span>Light Mode</span>{/if}
	{:else}
		<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
		</svg>
		{#if fullWidth}<span>Dark Mode</span>{/if}
	{/if}
</button>

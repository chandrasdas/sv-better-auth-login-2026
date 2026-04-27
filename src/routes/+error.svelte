<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { APP_NAME } from '$lib/config';
</script>

<svelte:head>
	<title>{page.status} | {APP_NAME}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
	<div class="text-center">
		<h1 class="text-9xl font-bold bg-linear-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent mb-4">
			{page.status}
		</h1>
		<h2 class="text-3xl font-semibold text-slate-900 dark:text-white mb-6 transition-colors">
			{#if page.status === 404}
				Page not found
			{:else}
				Something went wrong
			{/if}
		</h2>
		<p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto transition-colors">
			{#if page.status === 404}
				Sorry, we couldn't find the page you're looking for. It might have been removed or the link may be broken.
			{:else}
				{page.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>
		<div class="flex justify-center gap-4">
			<a
				href={resolve('/')}
				class="rounded-xl bg-slate-200 dark:bg-white/10 px-6 py-3 font-medium text-slate-900 dark:text-white transition hover:bg-slate-300 dark:hover:bg-white/20"
			>
				Go Home
			</a>
			<a
				href={resolve('/login')}
				class="rounded-xl bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400"
			>
				Go to Login
			</a>
		</div>
	</div>
</div>

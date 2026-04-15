<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	// Derive current run from form action result, or null
	let currentRun = $derived(form?.currentRun ?? null);

	// Merge recent runs: prefer form result (post-action) or fallback to load data
	let recentRuns = $derived(form?.recentRuns ?? data.recentRuns);

	let testing = $state(false);

	function statusColor(status: string) {
		return status === 'ok' ? 'text-emerald-400' : 'text-red-400';
	}

	function statusIcon(status: string) {
		return status === 'ok' ? '✓' : '✗';
	}

	function latencyColor(ms: number) {
		if (ms < 5) return 'text-emerald-400';
		if (ms < 20) return 'text-yellow-400';
		return 'text-red-400';
	}

	function formatTime(iso: string) {
		const d = new Date(iso);
		return d.toLocaleTimeString('en-IN', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		});
	}
</script>

<svelte:head>
	<title>DB Diagnostics</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-[#0a0a0f] text-gray-200 font-mono p-6 md:p-12 flex justify-center">
	<div class="w-full max-w-2xl space-y-6">
		<!-- Header -->
		<div class="border border-gray-800 rounded-lg bg-[#111118] p-6">
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-semibold tracking-tight text-gray-100">
					⚡ Database Diagnostics
				</h1>
				<form
					method="POST"
					use:enhance={() => {
						testing = true;
						return async ({ update }) => {
							await update();
							testing = false;
						};
					}}
				>
					<button
						type="submit"
						disabled={testing}
						class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
							{testing
							? 'bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 active:scale-95'}"
					>
						{#if testing}
							<span class="flex items-center gap-2">
								<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									></path>
								</svg>
								Running…
							</span>
						{:else}
							▶ Start Test
						{/if}
					</button>
				</form>
			</div>
			<p class="text-xs text-gray-500 mt-3">
				Click the button to run database connectivity tests.
			</p>
		</div>

		<!-- Recent Runs (last 5) -->
		{#if recentRuns.length > 0}
			<div class="border border-gray-800 rounded-lg bg-[#111118] p-5">
				<h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
					Recent Test Results
				</h2>
				<div class="space-y-2">
					{#each recentRuns as run, i (run.id)}
						<div
							class="flex items-center justify-between px-3 py-2.5 rounded-md transition-colors
								{i === 0 && currentRun ? 'bg-[#1a1a25] border border-gray-700' : 'bg-[#0d0d14]'}"
						>
							<div class="flex items-center gap-3">
								<span
									class="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
										{run.allPassed
										? 'bg-emerald-500/15 text-emerald-400'
										: 'bg-red-500/15 text-red-400'}"
								>
									{run.allPassed ? '✓' : '✗'}
								</span>
								<div>
									<span class="text-xs text-gray-300">
										{run.allPassed ? 'All Passed' : 'Has Failures'}
									</span>
									<span class="text-[11px] text-gray-600 ml-2">
										{formatTime(run.timestamp)}
									</span>
								</div>
							</div>
							<div class="flex items-center gap-3 text-xs">
								<span class="text-gray-500">{run.tests.length} tests</span>
								<span class="font-medium tabular-nums {latencyColor(run.avgLatency)}">
									{run.avgLatency}ms avg
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Current Run Details -->
		{#if currentRun}
			<div class="space-y-3">
				<div class="flex items-center justify-between px-1">
					<h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
						Latest Run Details
					</h2>
					<span
						class="text-xs px-2.5 py-1 rounded-full font-medium {currentRun.allPassed
							? 'bg-emerald-500/15 text-emerald-400'
							: 'bg-red-500/15 text-red-400'}"
					>
						{currentRun.allPassed ? 'ALL PASS' : 'HAS FAILURES'}
					</span>
				</div>

				<div class="text-[11px] text-gray-500 px-1">
					{currentRun.timestamp} &middot; Avg latency: <span
						class={latencyColor(currentRun.avgLatency)}>{currentRun.avgLatency}ms</span
					>
				</div>

				{#each currentRun.tests as test (test.name)}
					<div class="border border-gray-800 rounded-lg bg-[#111118] p-5">
						<div class="flex items-start justify-between gap-4">
							<div class="flex items-center gap-3 min-w-0">
								<span class="text-base {statusColor(test.status)}"
									>{statusIcon(test.status)}</span
								>
								<div class="min-w-0">
									<p class="text-sm font-medium text-gray-200 truncate">{test.name}</p>
									{#if test.result}
										<p class="text-xs text-gray-500 mt-0.5">{test.result}</p>
									{/if}
									{#if test.error}
										<p class="text-xs text-red-400/80 mt-0.5 break-all">{test.error}</p>
									{/if}
								</div>
							</div>
							<span
								class="text-xs font-medium tabular-nums shrink-0 {latencyColor(test.latencyMs)}"
							>
								{test.latencyMs}ms
							</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Empty state -->
			<div class="border border-dashed border-gray-800 rounded-lg bg-[#0d0d14] p-10 text-center">
				<p class="text-sm text-gray-500">No test has been run yet.</p>
				<p class="text-xs text-gray-600 mt-1">Click "Start Test" above to begin diagnostics.</p>
			</div>
		{/if}

		<!-- Footer -->
		<p class="text-center text-[11px] text-gray-600">
			Internal diagnostic page &middot; Do not share this URL
		</p>
	</div>
</div>

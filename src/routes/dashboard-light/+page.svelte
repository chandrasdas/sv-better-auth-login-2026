<script lang="ts">
	// Minimal dashboard cards logic
	const stats = [
		{
			title: 'Total Students',
			value: '1,248',
			trend: '+12%',
			trendUp: true,
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
		},
		{
			title: 'Total Faculties',
			value: '86',
			trend: '+4%',
			trendUp: true,
			icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
		},
		{
			title: 'Exam Highlights',
			value: 'Mid-Terms',
			trend: 'Completed',
			trendUp: true,
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		}
	];
</script>

<div class="max-w-6xl mx-auto">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
		<p class="text-sm text-slate-500 mt-1">Here's a quick summary of the school's statistics.</p>
	</div>

	<!-- Cards Grid -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		{#each stats as stat (stat.title)}
			<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-600">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stat.icon} />
						</svg>
					</div>
					{#if stat.trend !== 'Completed'}
						<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold {stat.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">
							{#if stat.trendUp}
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
								</svg>
							{:else}
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
								</svg>
							{/if}
							{stat.trend}
						</span>
					{:else}
						<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700">
							<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							{stat.trend}
						</span>
					{/if}
				</div>
				<div>
					<p class="text-sm font-medium text-slate-500">{stat.title}</p>
					<p class="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
				</div>
			</div>
		{/each}
	</div>
	
	<!-- Rest of the space blank for now -->
	<div class="mt-8 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center opacity-50">
		<svg class="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
		</svg>
		<h3 class="text-lg font-medium text-slate-900">More widgets coming soon</h3>
		<p class="text-sm text-slate-500 mt-1">This space is reserved for future charts and tables.</p>
	</div>
</div>

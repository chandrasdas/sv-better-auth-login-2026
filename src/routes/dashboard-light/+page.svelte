<script lang="ts">
	// Minimal dashboard cards logic
	const stats = [
		{
			title: 'Total Students',
			value: '2347',
			trend: '18% Higher Than Last Month',
			icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14v5',
			gradient: 'from-blue-500/80 to-blue-600/80'
		},
		{
			title: 'Total Teachers',
			value: '258',
			trend: '21% Higher Than Last Month',
			icon: 'M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z',
			gradient: 'from-emerald-500/80 to-emerald-600/80'
		},
		{
			title: 'Awards',
			value: '27',
			trend: '37% Higher Than Last Month',
			icon: 'M19 5h-2V3a1 1 0 00-1-1H8a1 1 0 00-1 1v2H5a1 1 0 00-1 1v3a5.006 5.006 0 004.546 4.975A5.993 5.993 0 0011 18.906V21H9a1 1 0 000 2h6a1 1 0 000-2h-2v-2.094a5.993 5.993 0 002.454-3.93A5.006 5.006 0 0020 9V6a1 1 0 00-1-1zM6 9V7h1v2.812A3.003 3.003 0 016 9zM17 9.812V7h1v2A3.003 3.003 0 0117 9.812z',
			gradient: 'from-amber-400 to-orange-400'
		},
		{
			title: 'Total Earning',
			value: '$25,698',
			trend: '10% Higher Than Last Month',
			icon: 'M11.999 3.004c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9-4.038-9-9-9zm0 16v-1m0-12V4m-2.599 1.401A2.992 2.992 0 0112 5c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2c1.11 0 2.08-.402 2.599-1',
			gradient: 'from-rose-400 to-pink-500'
		}
	];
</script>

<div class="max-w-7xl mx-auto">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight transition-colors">Dashboard Overview</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Here's a quick summary of the school's statistics.</p>
	</div>

	<!-- Cards Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat (stat.title)}
			<div class="rounded-xl shadow-sm p-6 text-white bg-linear-to-br {stat.gradient} transition-transform hover:-translate-y-1">
				<div class="font-medium mb-4 text-white/90 text-sm tracking-wide">{stat.title}</div>
				<div class="flex items-center justify-between mb-6">
					<svg class="h-9 w-9 text-white/95" fill="currentColor" viewBox="0 0 24 24">
						<path d={stat.icon} />
					</svg>
					<div class="text-3xl font-bold">{stat.value}</div>
				</div>
				<div class="text-xs text-white/80">{stat.trend}</div>
			</div>
		{/each}
	</div>
	
	<!-- Rest of the space blank for now -->
	<div class="mt-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center opacity-50 transition-colors">
		<svg class="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
		</svg>
		<h3 class="text-lg font-medium text-slate-900 dark:text-slate-300 transition-colors">More widgets coming soon</h3>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">This space is reserved for future charts and tables.</p>
	</div>
</div>

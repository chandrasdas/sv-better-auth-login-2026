<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { APP_NAME } from '$lib/config';
	import { resolve } from '$app/paths';

	let { data, form } = $props();
	
	let loading = $state(false);
	
	// Helper state for editing rows
	let editingId = $state<number | null>(null);

	function startEdit(id: number) {
		editingId = id;
	}

	function cancelEdit() {
		editingId = null;
	}
</script>

<svelte:head>
	<title>Allowed Staff Management | {APP_NAME}</title>
</svelte:head>

<div class="min-h-screen text-slate-100 font-sans">
	<main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" in:fade={{ duration: 400 }}>
		<div class="mb-8 flex items-center gap-4">
			<a href={resolve('/dashboard')} aria-label="Back to Dashboard" class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
			</a>
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors mb-2">Allowed Staff Management</h1>
				<p class="text-slate-500 dark:text-slate-400 transition-colors">Manage the list of staff members permanently allowed to register for an account.</p>
			</div>
		</div>

		{#if form?.message}
			<div class="mb-6 rounded-xl border p-4 {form.success ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}">
				{form.message}
			</div>
		{/if}

		<div class="grid gap-8 lg:grid-cols-3">
			
			<!-- Add New Member Form Area -->
			<div class="lg:col-span-1">
				<div class="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-6 shadow-xl relative overflow-hidden transition-colors">
					<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-50 dark:bg-purple-500/10 blur-[80px] pointer-events-none"></div>
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white transition-colors mb-6 relative z-10">Add New Allowed Member</h2>
					
					<form method="POST" action="?/add" use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							update();
						};
					}} class="space-y-4 relative z-10">
						<div>
							<label for="name" class="block text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors mb-1">Name (Optional)</label>
							<input type="text" id="name" name="name" 
								class="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" 
								placeholder="John Doe" />
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors mb-1">Email <span class="text-red-400">*</span></label>
							<input type="email" id="email" name="email" required
								class="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" 
								placeholder="john@example.com" />
						</div>

						<div>
							<label for="role" class="block text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors mb-1">Role</label>
							<select id="role" name="role"
								class="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-white transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
								<option value="teacher">Teacher</option>
								<option value="staff">Staff</option>
								<option value="admin">Admin</option>
							</select>
						</div>

						<div class="flex items-center gap-3 pt-2">
							<input type="checkbox" id="isAllowed" name="isAllowed" checked
								class="h-5 w-5 rounded border-slate-200 dark:border-white/10 text-purple-500 transition-colors focus:ring-purple-500 focus:ring-offset-slate-950" />
							<label for="isAllowed" class="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Is Allowed to Register</label>
						</div>

						<button type="submit" disabled={loading}
							class="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-md transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 mt-4 flex justify-center">
							{#if loading}
								<svg class="h-5 w-5 animate-spin text-slate-900 dark:text-white transition-colors" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							{:else}
								Add Staff Member
							{/if}
						</button>
					</form>
				</div>
			</div>

			<!-- List / Management Area -->
			<div class="lg:col-span-2">
				<div class="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 overflow-hidden shadow-xl transition-colors">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm text-slate-600 dark:text-slate-300 transition-colors">
							<thead class="bg-slate-100 dark:bg-white/5 text-xs uppercase text-slate-500 dark:text-slate-400 transition-colors">
								<tr>
									<th scope="col" class="px-6 py-4">Name / Email</th>
									<th scope="col" class="px-6 py-4">Role</th>
									<th scope="col" class="px-6 py-4">Status</th>
									<th scope="col" class="px-6 py-4 text-right">Actions</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-200 dark:divide-white/5">
								{#if data.staffList.length === 0}
									<tr>
										<td colspan="4" class="px-6 py-8 text-center text-slate-500">No staff members found.</td>
									</tr>
								{:else}
									{#each data.staffList as staff (staff.id)}
										{#if editingId === staff.id}
											<!-- EDIT ROW -->
											<tr class="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition">
												<td colspan="4" class="px-6 py-4">
													<form method="POST" action="?/edit" use:enhance={() => {
														return async ({ update }) => {
															cancelEdit();
															update();
														};
													}} class="flex flex-col sm:flex-row gap-4 items-center w-full">
														<input type="hidden" name="id" value={staff.id} />
														
														<div class="flex-1 w-full space-y-2">
															<input type="text" name="name" value={staff.name || ''} placeholder="Name" class="w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
															<input type="email" name="email" value={staff.email} required placeholder="Email" class="w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
														</div>

														<div class="w-full sm:w-auto space-y-2 shrink-0">
															<select name="role" class="w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-white transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" value={staff.role}>
																<option value="teacher">Teacher</option>
																<option value="staff">Staff</option>
																<option value="admin">Admin</option>
															</select>
															<div class="flex items-center gap-2 px-1">
																<input type="checkbox" name="isAllowed" id="edit-allow-{staff.id}" checked={staff.isAllowed} class="h-4 w-4 rounded border-slate-200 dark:border-white/10 text-purple-500 transition-colors focus:ring-purple-500 focus:ring-offset-slate-900" />
																<label for="edit-allow-{staff.id}" class="text-xs">Allowed</label>
															</div>
														</div>

														<div class="flex gap-2 w-full sm:w-auto justify-end shrink-0">
															<button type="submit" class="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 transition">Save</button>
															<button type="button" onclick={cancelEdit} class="rounded-lg bg-slate-500/20 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-500/30 transition">Cancel</button>
														</div>
													</form>
												</td>
											</tr>
										{:else}
											<!-- VIEW ROW -->
											<tr class="hover:bg-slate-100 dark:bg-white/5 transition">
												<td class="px-6 py-4">
													<div class="font-medium text-slate-900 dark:text-white transition-colors">{staff.name || 'N/A'}</div>
													<div class="text-xs text-slate-500">{staff.email}</div>
												</td>
												<td class="px-6 py-4">
													<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset
														{staff.role === 'admin' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20' : 
														staff.role === 'teacher' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20' : 
														'bg-slate-500/10 text-slate-500 dark:text-slate-400 transition-colors ring-slate-500/20'}">
														{staff.role}
													</span>
												</td>
												<td class="px-6 py-4">
													{#if staff.isAllowed}
														<span class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
															<div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
															Allowed
														</span>
													{:else}
														<span class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
															<div class="h-1.5 w-1.5 rounded-full bg-red-500"></div>
															Blocked
														</span>
													{/if}
												</td>
												<td class="px-6 py-4 text-right">
													<div class="flex justify-end gap-2">
														<button type="button" onclick={() => startEdit(staff.id)} class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition" title="Edit">
															<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
														</button>
														<form method="POST" action="?/delete" use:enhance={() => {
															return async ({ update }) => {
																update();
															};
														}} class="inline-block">
															<input type="hidden" name="id" value={staff.id} />
															<button type="submit" class="text-red-400 hover:text-red-300 transition" title="Delete" onclick={(e) => { if(!confirm('Are you sure you want to delete this allowed staff member?')) e.preventDefault(); }}>
																<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
															</button>
														</form>
													</div>
												</td>
											</tr>
										{/if}
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

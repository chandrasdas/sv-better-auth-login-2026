<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';
	import { APP_NAME } from '$lib/config';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Staff Data Entry | {APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 py-12 px-4 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl" in:fade={{ duration: 400 }}>
		
		<div class="mb-8 flex items-center gap-4">
			
			<a href={resolve('/dashboard')} aria-label="Return to Dashboard" class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
			</a>
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-white">Staff Data Entry</h1>
				<p class="mt-1 text-sm text-slate-400">Please provide or update your employment details below.</p>
			</div>
		</div>

		{#if form?.success}
			<div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center backdrop-blur-sm">
				{#if form?.noChanges}
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
						<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-white">No data changed</h2>
					<p class="mt-2 text-slate-400">Your staff details are already up to date.</p>
				{:else}
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
						<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-white">Successfully Submitted!</h2>
					<p class="mt-2 text-slate-400">Your staff details have been saved to the database.</p>
				{/if}
				<div class="mt-6">
					<a href={resolve('/dashboard')} class="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
						Return to Dashboard
					</a>
				</div>
			</div>
		{:else}
			<div class="relative overflow-hidden rounded-3xl border border-white/5 bg-white/2 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
				<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
				
				<form method="POST" class="relative z-10 space-y-6" use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}>
					
					{#if form?.error}
						<div class="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
							<div class="flex">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
								<div class="ml-3">
									<p class="text-sm font-medium text-red-400">{form.error}</p>
								</div>
							</div>
						</div>
					{/if}

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<!-- Employee ID -->
						<div>
							<label for="empId" class="block text-sm font-medium text-slate-300">Employee ID <span class="text-red-400">*</span></label>
							<input type="text" name="empId" id="empId" required maxlength="8"
								value={form?.data?.empId || data.existingStaff?.empId || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="e.g. EMP12345" />
						</div>

						<!-- Name (Pre-filled from auth, but editable contextually) -->
						<div>
							<label for="name" class="block text-sm font-medium text-slate-300">Full Name <span class="text-red-400">*</span></label>
							<input type="text" name="name" id="name" required maxlength="255"
								value={form?.data?.name || data.existingStaff?.name || data.user?.name || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="John Doe" />
						</div>

						<!-- Status Dropdown -->
						<div>
							<label for="status" class="block text-sm font-medium text-slate-300">Status <span class="text-red-400">*</span></label>
							<select name="status" id="status" required
								class="mt-2 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
								<option value="" disabled selected={!(form?.data?.status || data.existingStaff?.status)}>Select Status</option>
								<option value="Permanent" selected={(form?.data?.status || data.existingStaff?.status) === 'Permanent'}>Permanent</option>
								<option value="Contractual" selected={(form?.data?.status || data.existingStaff?.status) === 'Contractual'}>Contractual</option>
							</select>
						</div>

						<!-- Designation Dropdown -->
						<div>
							<label for="designation" class="block text-sm font-medium text-slate-300">Designation <span class="text-red-400">*</span></label>
							<select name="designation" id="designation" required
								class="mt-2 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
								<option value="" disabled selected={!(form?.data?.designation || data.existingStaff?.designation)}>Select Designation</option>
								<option value="Headmaster" selected={(form?.data?.designation || data.existingStaff?.designation) === 'Headmaster'}>Headmaster</option>
								<option value="Assistant Teacher" selected={(form?.data?.designation || data.existingStaff?.designation) === 'Assistant Teacher'}>Assistant Teacher</option>
								<option value="Librarian" selected={(form?.data?.designation || data.existingStaff?.designation) === 'Librarian'}>Librarian</option>
								<option value="Clerk" selected={(form?.data?.designation || data.existingStaff?.designation) === 'Clerk'}>Clerk</option>
								<option value="Group-D" selected={(form?.data?.designation || data.existingStaff?.designation) === 'Group-D'}>Group-D</option>
							</select>
						</div>

						<!-- Email (Pre-filled from auth) -->
						<div class="sm:col-span-2">
							<label for="email" class="block text-sm font-medium text-slate-300">Email Address (Editable)</label>
							<input type="email" name="email" id="email" maxlength="255"
								value={form?.data?.email || data.existingStaff?.email || data.user?.email || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="john@example.com" />
							<p class="mt-1 text-xs text-slate-500">This will be used for official communications.</p>
						</div>

						<!-- Phone Number -->
						<div>
							<label for="phoneNo" class="block text-sm font-medium text-slate-300">Phone Number</label>
							<input type="tel" name="phoneNo" id="phoneNo" maxlength="15"
								value={form?.data?.phoneNo || data.existingStaff?.phoneNo || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="+1234567890" />
						</div>

						<!-- Qualification -->
						<div>
							<label for="qualification" class="block text-sm font-medium text-slate-300">Qualification</label>
							<input type="text" name="qualification" id="qualification" maxlength="255"
								value={form?.data?.qualification || data.existingStaff?.qualification || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="e.g. M.Sc, B.Ed" />
						</div>
						
						<!-- Date of Birth -->
						<div>
							<label for="dateOfBirth" class="block text-sm font-medium text-slate-300">Date of Birth</label>
							<input type="date" name="dateOfBirth" id="dateOfBirth"
								value={form?.data?.dateOfBirth || data.existingStaff?.dateOfBirthFormatted || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
						</div>

						<!-- Date of Joining -->
						<div>
							<label for="dateOfJoining" class="block text-sm font-medium text-slate-300">Date of Joining</label>
							<input type="date" name="dateOfJoining" id="dateOfJoining"
								value={form?.data?.dateOfJoining || data.existingStaff?.dateOfJoiningFormatted || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
						</div>

						<!-- Primary Subject -->
						<div class="sm:col-span-2">
							<label for="primarySubject" class="block text-sm font-medium text-slate-300">Primary Subject (if applicable)</label>
							<input type="text" name="primarySubject" id="primarySubject" maxlength="100"
								value={form?.data?.primarySubject || data.existingStaff?.primarySubject || ''}
								class="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="e.g. Mathematics" />
						</div>
					</div>

					<div class="mt-8">
						<button
							type="submit"
							disabled={submitting}
							class="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-4 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
						>
							{#if submitting}
								<svg class="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Saving Details...
							{:else}
								{data.existingStaff ? 'Update Staff Details' : 'Save Staff Details'}
							{/if}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>

import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	// You can pass the API base URL if needed, but in SvelteKit it's 
	// typically the same origin if hosted together. By default it uses window.location.origin
});

import { inject } from '$lib/core/di';
import { AuthService } from '$lib/core/services/auth/auth.svelte';
import type { User } from '$lib/core/state/user/user.types.ts';

/**
 * Stores the authenticated user.
 *
 * This state cannot be provided without an authenticated session.
 */
export class UserState {
    user: User;

    constructor() {
        const authService = inject(AuthService);

        this.user = $derived(authService.user!);
    }
}
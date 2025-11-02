import { type Auth, GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { inject } from '$lib/core/di';
import { TOKEN_PROVIDER, type TokenProvider } from '$lib/core/services/auth/providers/provider';
import { FirebaseState } from '$lib/core/state/firebase/firebase';
import type { Tokens } from '$lib/core/services/auth/auth.types';
import type { User } from '$lib/core/state/user/user.types.ts';

export class AuthService {
    user = $derived<User | null>(null);

    authenticated = $derived(this.user !== null);

    private readonly auth: Auth;
    private readonly tokenProvider: TokenProvider;

    constructor() {
        this.auth = inject(FirebaseState).auth;
        this.tokenProvider = inject(TOKEN_PROVIDER);
    }

    /**
     * Get the OAuth tokens from the Tauri store and sign in with them if they're available.
     */
    async init(): Promise<User | null> {
        const tokens = await this.tokenProvider.getTokens();

        return tokens !== null ? this.signInWithTokens(tokens).catch(() => null) : null;
    }

    async signIn(): Promise<User> {
        const tokens = await this.tokenProvider.signIn();

        return this.signInWithTokens(tokens);
    }

    async signOut(): Promise<void> {
        await signOut(this.auth);

        this.user = null;
    }

    private async signInWithTokens(tokens: Tokens): Promise<User> {
        const credential = GoogleAuthProvider.credential(tokens.id_token, tokens.access_token);

        return signInWithCredential(this.auth, credential).then((result) => {
            const user = result.user as User;

            this.user = user;

            return user;
        });
    }
}

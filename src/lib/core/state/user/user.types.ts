import type { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser & { accessToken: string };

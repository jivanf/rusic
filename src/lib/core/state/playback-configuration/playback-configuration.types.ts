export type PlaybackConfiguration = Partial<{
    /**
     * The manifest URI loaded by the player.
     */
    manifestUri: string;

    /**
     * The deciphered SABR streaming URL.
     */
    streamingUrl: string;
}>;

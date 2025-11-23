import { inject } from '$lib/core/di';
import { SabrAdapter } from '$lib/core/sabr';
import { ManifestService } from '$lib/core/services/manifest';
import type { PlaybackConfiguration } from '$lib/core/state/playback-configuration/playback-configuration.types';
import { YT } from 'youtubei.js/web';

export class PlaybackConfigurationState {
    private configuration = new Map<string, PlaybackConfiguration>();

    getConfiguration(videoId: string): PlaybackConfiguration | null;
    getConfiguration(videoId: string, fallback: () => Promise<PlaybackConfiguration>): Promise<PlaybackConfiguration>;
    getConfiguration(
        videoId: string,
        fallback?: () => Promise<PlaybackConfiguration>,
    ): PlaybackConfiguration | Promise<PlaybackConfiguration> | null {
        const configuration = this.configuration.get(videoId) ?? (fallback !== undefined ? fallback() : null);

        if (fallback !== undefined) {
            (configuration as Promise<PlaybackConfiguration>).then((configuration) =>
                this.setConfiguration(videoId, configuration),
            );
        }

        return configuration;
    }

    setConfiguration(videoId: string, configuration: PlaybackConfiguration) {
        this.configuration.set(videoId, {
            ...(this.getConfiguration(videoId) ?? {}),
            ...configuration,
        });
    }

    static async loadConfiguration(videoInfo: YT.VideoInfo): Promise<void> {
        const playbackConfigurationState = inject(PlaybackConfigurationState);
        const manifestService = inject(ManifestService);
        const sabrAdapter = inject(SabrAdapter);

        playbackConfigurationState.setConfiguration(videoInfo.basic_info.id!, {
            manifestUri: await manifestService.getUri(videoInfo),
            streamingUrl: await sabrAdapter.getStreamingUrl(videoInfo),
        });
    }
}

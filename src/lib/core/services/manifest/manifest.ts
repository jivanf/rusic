import { inject } from '$lib/core/di';
import { VideoInfoService } from '$lib/core/services/video';
import { PlaybackConfigurationState } from '$lib/core/state/playback-configuration';
import { YT } from 'youtubei.js/web';

export class ManifestService {
    private readonly playbackConfigurationState = inject(PlaybackConfigurationState);
    private readonly videoInfoService = inject(VideoInfoService);

    async getUriFromId(id: string): Promise<string> {
        const videoInfo = await this.videoInfoService.getInfo(id);

        return this.getUri(videoInfo);
    }

    async getUri(videoInfo: YT.VideoInfo): Promise<string> {
        const configuration = await this.playbackConfigurationState.getConfiguration(videoInfo.basic_info.id!, async () => {
            const manifestUri = `data:application/dash+xml;base64,${btoa(
                await videoInfo.toDash({
                    manifest_options: {
                        is_sabr: true,
                        include_thumbnails: false,
                    },
                }),
            )}`;

            return {
                manifestUri,
            };
        });

        return configuration.manifestUri!;
    }
}

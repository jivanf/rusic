import { inject } from '$lib/core/di';
import { PlayerState } from '$lib/core/player';
import { SabrAdapter } from '$lib/core/sabr';
import { VideoInfoService } from '$lib/core/services/video';

export class VideoService {
    private readonly videoInfoService = inject(VideoInfoService);

    private readonly player = inject(PlayerState).player;

    private readonly sabrAdapter = inject(SabrAdapter);

    async play(id: string): Promise<void> {
        // Unload previous video
        await this.player.unload();

        this.sabrAdapter.refresh();

        const videoInfo = await this.videoInfoService.getInfo(id);

        this.sabrAdapter.configureListeners(id);

        await this.sabrAdapter.configureStreaming(videoInfo);

        const manifestUri = `data:application/dash+xml;base64,${btoa(
            await videoInfo.toDash({
                manifest_options: {
                    is_sabr: true,
                    include_thumbnails: false,
                },
            }),
        )}`;

        await this.player.load(manifestUri);
    }
}

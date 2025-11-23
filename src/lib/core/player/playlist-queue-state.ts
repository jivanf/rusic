import { inject } from '$lib/core/di';
import { PlayerState } from '$lib/core/player/player-state';
import { SabrAdapter } from '$lib/core/sabr';
import { ManifestService } from '$lib/core/services/manifest';
import { type PlaylistItem } from '$lib/core/services/playlist-item';
import { VideoInfoService } from '$lib/core/services/video';
import { PlaybackConfigurationState } from '$lib/core/state/playback-configuration';
import shaka from 'shaka-player/dist/shaka-player.ui.debug';

export class PlaylistQueueState {
    private items: PlaylistItem[] = [];

    private readonly manager: shaka.queue.QueueManager;

    private readonly player = inject(PlayerState).player;
    private readonly videoInfoService = inject(VideoInfoService);
    private readonly manifestService = inject(ManifestService);
    private readonly sabrAdapter = inject(SabrAdapter);

    constructor() {
        this.manager = this.player.getQueueManager() as shaka.queue.QueueManager;

        this.manager.addEventListener('currentitemchanged', () => {
            const index = this.manager.getCurrentItemIndex();

            if (index === 0) {
                return;
            }

            const item = this.items[index];

            if (item === undefined) {
                throw new Error(`The playlist item with queue index [${index}] was not found in the queue state`);
            }

            // This will always be synchronous because the streaming URL is already loaded in the playback
            // configuration
            this.sabrAdapter.configurePlayback(item.contentDetails.videoId);
        });
    }

    async addPlaylistItems(items: PlaylistItem[]): Promise<void> {
        const videoInfoItems = await Promise.all(
            items.map((item) => this.videoInfoService.getInfo(item.contentDetails.videoId)),
        );

        await Promise.all(videoInfoItems.map((videoInfo) => PlaybackConfigurationState.loadConfiguration(videoInfo)));

        const queueItems = await Promise.all(
            videoInfoItems.map(
                async (videoInfo) =>
                    ({ manifestUri: await this.manifestService.getUri(videoInfo) }) as shaka.extern.QueueItem,
            ),
        );

        this.manager.insertItems(queueItems);

        this.items.push(...items);
    }

    async start(): Promise<void> {
        await this.sabrAdapter.configurePlayback(this.items[0].contentDetails.videoId);

        return this.play(0);
    }

    private async play(index: number): Promise<void> {
        this.manager.playItem(index);
    }
}

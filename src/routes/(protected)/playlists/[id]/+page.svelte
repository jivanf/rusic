<script lang="ts">
    import { DataTable } from '$lib/components/data-table';
    import { Button } from '$lib/components/ui/button';
    import { inject } from '$lib/core/di';
    import { PlaylistQueueState } from '$lib/core/player/playlist-queue-state';
    import { PlaylistItemService } from '$lib/core/services/playlist-item';
    import { VideoService } from '$lib/core/services/video';
    import { columns } from './_components/table/columns';

    const playlistItemService = inject(PlaylistItemService);
    const queueState = inject(PlaylistQueueState);
    const videoService = inject(VideoService);

    const playlistItems = playlistItemService.items;

    function playPlaylist(): void {
        queueState.addPlaylistItems(playlistItems.slice(0, 1)).then(() => queueState.start());
    }

    function playItem(item: PlaylistItem): void {
        videoService.play(item.contentDetails.videoId);
    }
</script>

<Button onclick={playPlaylist}>Play</Button>

<DataTable data={playlistItems} {columns} onrowclick={playItem}></DataTable>

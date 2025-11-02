import { inject } from '$lib/core/di';
import { type Playlist, PlaylistService } from '$lib/core/services/playlist';

export class PlaylistState {
    playlist: Playlist;

    private readonly playlistService = inject(PlaylistService);

    constructor(id: string) {
        this.playlist = this.playlistService.items.find((playlist) => playlist.id === id)!;
    }
}

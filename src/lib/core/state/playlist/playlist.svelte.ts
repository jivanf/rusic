import { inject } from '$lib/core/di';
import { type Playlist, PlaylistService } from '$lib/core/services/playlist';
import { PlaylistItemService } from '$lib/core/services/playlist-item';

export class PlaylistState {
    private _playlist?: Playlist = $state();

    get playlist(): Playlist {
        if (this._playlist === undefined) {
            throw new Error('Playlist is not available');
        }

        return this._playlist;
    }

    private get playlistItemService(): PlaylistItemService | null {
        return inject(PlaylistItemService, { optional: true });
    }

    private readonly playlistService = inject(PlaylistService);

    constructor() {}

    setPlaylist(id: string): void {
        this._playlist = this.playlistService.items.find((playlist) => playlist.id === id)!;

        if (this.playlistItemService !== null) {
            this.playlistItemService.read();
        }
    }

    private getPlaylist(id: string): Playlist {
        return this.playlistService.items.find((playlist) => playlist.id === id)!;
    }
}

import { PUBLIC_AUTH_ACCESS_TOKEN } from '$env/static/public';
import { inject } from '$lib/core/di';
import type { AsyncInitializable } from '$lib/core/di/init.ts';
import type { PlaylistItem } from '$lib/core/services/playlist-item/playlist-item.types.ts';
import { StatefulService } from '$lib/core/services/stateful-service.svelte';
import { PlaylistState } from '$lib/core/state/playlist';

export class PlaylistItemService extends StatefulService<PlaylistItem> implements AsyncInitializable {
    private accessToken = PUBLIC_AUTH_ACCESS_TOKEN;

    private playlistState = inject(PlaylistState);

    constructor() {
        super();
    }

    async init(): Promise<unknown> {
        return this.read();
    }

    async handleRead(): Promise<PlaylistItem[]> {
        const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        url.searchParams.set('part', 'snippet,contentDetails');
        url.searchParams.set('playlistId', this.playlistState.playlist.id);
        url.searchParams.set('maxResults', '50');

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });

        const data = await response.json();

        return data.items;
    }
}

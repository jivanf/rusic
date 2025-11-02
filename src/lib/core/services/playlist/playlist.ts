import { PUBLIC_AUTH_ACCESS_TOKEN } from '$env/static/public';
import type { Playlist } from '$lib/core/services/playlist/playlist.types';
import { StatefulService } from '$lib/core/services/stateful-service.svelte';
import type { AsyncInitializable } from '$lib/core/di/init.ts';

export class PlaylistService extends StatefulService<Playlist> implements AsyncInitializable {
    private accessToken = PUBLIC_AUTH_ACCESS_TOKEN;

    init(): Promise<unknown> {
        return this.read();
    }

    async handleRead() {
        let playlists: Playlist[] = [];
        let pageToken = null;

        do {
            const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
            url.searchParams.set('part', 'snippet');
            url.searchParams.set('mine', 'true');
            url.searchParams.set('maxResults', '50'); // Maximum allowed

            if (pageToken) {
                url.searchParams.set('pageToken', pageToken);
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            const data = await response.json();

            playlists = playlists.concat(data.items);
            pageToken = data.nextPageToken;
        } while (pageToken);

        return playlists;
    }
}

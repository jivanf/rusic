import { BotGuardService } from '$lib/core/botguard';
import { inject, provide } from '$lib/core/di';
import { PlayerState } from '$lib/core/player';
import { PlaylistQueueState } from '$lib/core/player/playlist-queue-state';
import { SabrAdapter } from '$lib/core/sabr';
import { ManifestService } from '$lib/core/services/manifest';
import { PlaylistItemService } from '$lib/core/services/playlist-item';
import { VideoInfoService, VideoService } from '$lib/core/services/video';
import { PlaybackConfigurationState } from '$lib/core/state/playback-configuration';
import { PlaylistState } from '$lib/core/state/playlist';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
    await parent();

    const playlistState = inject(PlaylistState);

    playlistState.setPlaylist(params.id);

    return provide([
        PlaybackConfigurationState,
        PlaylistItemService,
        BotGuardService,
        PlayerState,
        VideoInfoService,
        SabrAdapter,
        ManifestService,
        PlaylistQueueState,
        VideoService,
    ]);
};

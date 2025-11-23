import { inject } from '$lib/core/di';
import { PlayerState } from '$lib/core/player';
import { SabrAdapter } from '$lib/core/sabr';
import { ManifestService } from '$lib/core/services/manifest';

export class VideoService {
    private readonly manifestService = inject(ManifestService);

    private readonly player = inject(PlayerState).player;

    private readonly sabrAdapter = inject(SabrAdapter);

    async play(id: string): Promise<void> {
        const manifestUri = await this.manifestService.getUriFromId(id);

        await this.player.unload();
        await this.sabrAdapter.configurePlayback(id);
        await this.player.load(manifestUri);
    }
}

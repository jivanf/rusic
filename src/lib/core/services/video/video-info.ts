import { inject } from '$lib/core/di';
import { InnertubeState } from '$lib/core/state/innertube';
import type { ReloadPlaybackContext } from 'googlevideo/protos';
import { Utils, YT } from 'youtubei.js/web';

export class VideoInfoService {
    private readonly innertube = inject(InnertubeState).innertube;

    async getInfo(id: string, reloadPlaybackContext?: ReloadPlaybackContext): Promise<YT.VideoInfo> {
        const response = await this.innertube.actions.execute('/player', {
            videoId: id,
            contentCheckOk: true,
            racyCheckOk: true,
            playbackContext: {
                adPlaybackContext: {
                    pyv: true,
                },
                contentPlaybackContext: {
                    signatureTimestamp: this.innertube.session.player?.signature_timestamp,
                },
                reloadPlaybackContext,
            },
        });

        const cpn = Utils.generateRandomString(16);
        const info = new YT.VideoInfo([response], this.innertube.actions, cpn);

        if (info.playability_status?.status !== 'OK') {
            throw new Error(`Cannot play video: ${info.playability_status?.reason}`);
        }

        return info;
    }

}

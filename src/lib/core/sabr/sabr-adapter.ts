import { BotGuardService } from '$lib/core/botguard';
import { inject } from '$lib/core/di';
import { PlayerState } from '$lib/core/player';
import { ShakaPlayerAdapter } from '$lib/core/player/shaka';
import { VideoInfoService } from '$lib/core/services/video';
import { InnertubeState } from '$lib/core/state/innertube';
import { PlaybackConfigurationState } from '$lib/core/state/playback-configuration';
import { SabrStreamingAdapter } from 'googlevideo/sabr-streaming-adapter';
import { buildSabrFormat } from 'googlevideo/utils';
import { Constants, YT } from 'youtubei.js/web';

export class SabrAdapter {
    public streamingAdapter!: SabrStreamingAdapter;

    private tokenCreationLock = false;

    private coldStartToken?: string;

    private playbackWebPoToken?: string;

    private readonly playbackConfiguration = inject(PlaybackConfigurationState);
    private readonly videoInfoService = inject(VideoInfoService);
    private readonly player = inject(PlayerState).player;
    private readonly innertube = inject(InnertubeState).innertube;
    private readonly botGuardService = inject(BotGuardService);

    constructor() {}

    private init(): void {
        this.streamingAdapter = new SabrStreamingAdapter({
            playerAdapter: new ShakaPlayerAdapter(),
            clientInfo: {
                osName: this.innertube.session.context.client.osName,
                osVersion: this.innertube.session.context.client.osVersion,
                clientName: parseInt(
                    Constants.CLIENT_NAME_IDS[
                        this.innertube.session.context.client.clientName as keyof typeof Constants.CLIENT_NAME_IDS
                    ],
                ),
                clientVersion: this.innertube.session.context.client.clientVersion,
            },
        });

        this.attach();
    }

    refresh(): void {
        this.streamingAdapter.dispose();

        this.init();
    }

    async configurePlayback(videoId: string, videoInfo?: YT.VideoInfo): Promise<void> {
        videoInfo ??= await this.videoInfoService.getInfo(videoId);

        this.refresh();

        this.configureListeners(videoId);

        return this.configureStreaming(videoInfo);
    }

    configureListeners(videoId: string): void {
        this.streamingAdapter.onMintPoToken(async () => {
            if (!this.playbackWebPoToken) {
                this.mintContentWebPo(videoId).then();
            }

            return this.playbackWebPoToken ?? this.coldStartToken ?? '';
        });

        this.streamingAdapter.onReloadPlayerResponse(async (reloadPlaybackContext) => {
            const videoInfo = await this.videoInfoService.getInfo(videoId, reloadPlaybackContext);

            await this.configureStreaming(videoInfo);
        });
    }

    async configureStreaming(videoInfo: YT.VideoInfo): Promise<void> {
        if (videoInfo.streaming_data === undefined) {
            throw new Error("Couldn't find streaming data");
        }

        this.streamingAdapter.setStreamingURL(await this.getStreamingUrl(videoInfo));

        this.streamingAdapter.setUstreamerConfig(
            videoInfo.player_config?.media_common_config.media_ustreamer_request_config
                ?.video_playback_ustreamer_config,
        );

        this.streamingAdapter.setServerAbrFormats(videoInfo.streaming_data.adaptive_formats.map(buildSabrFormat));
    }

    attach(): void {
        this.streamingAdapter.attach(this.player);
    }

    async getStreamingUrl(videoInfo: YT.VideoInfo): Promise<string> {
        return (
            await this.playbackConfiguration.getConfiguration(videoInfo.basic_info.id!, () =>
                this.decipherSabrUrl(videoInfo),
            )
        ).streamingUrl!;
    }

    private async mintContentWebPo(binding: string): Promise<void> {
        if (this.tokenCreationLock) {
            return;
        }

        this.tokenCreationLock = true;

        try {
            this.coldStartToken = this.botGuardService.mintColdStartToken(binding);

            if (!this.botGuardService.isInitialized()) {
                await this.botGuardService.reinit();
            }

            if (this.botGuardService.integrityTokenBasedMinter) {
                this.playbackWebPoToken = await this.botGuardService.integrityTokenBasedMinter.mintAsWebsafeString(
                    decodeURIComponent(binding),
                );
            }
        } finally {
            this.tokenCreationLock = false;
        }
    }

    private async decipherSabrUrl(videoInfo: YT.VideoInfo): Promise<string> {
        const url = await this.innertube.session.player!.decipher(videoInfo.streaming_data?.server_abr_streaming_url);

        this.playbackConfiguration.setConfiguration(videoInfo.basic_info.id!, { streamingUrl: url });

        return url;
    }
}

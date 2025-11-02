import type { AsyncInitializable } from '$lib/core/di/init';
import shaka from 'shaka-player/dist/shaka-player.ui.debug';

export class PlayerState implements AsyncInitializable {
    public readonly player: shaka.Player;

    private readonly audio: HTMLAudioElement;

    constructor() {
        this.audio = document.getElementById('audio') as HTMLAudioElement;

        shaka.polyfill.installAll();

        this.player = new shaka.Player();

        this.player.configure({
            abr: { enabled: true },
            streaming: {
                bufferingGoal: 120,
                rebufferingGoal: 2,
            },
        });
    }

    async init(): Promise<unknown> {
        return this.player.attach(this.audio);
    }
}
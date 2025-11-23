import shaka from 'shaka-player/dist/shaka-player.ui.debug';

export class PlayerState {
    public readonly player: shaka.Player;

    private audio!: HTMLAudioElement;

    constructor() {
        shaka.polyfill.installAll();

        this.player = new shaka.Player();

        this.player.configure({
            abr: { enabled: true },
            streaming: {
                bufferingGoal: 120,
                rebufferingGoal: 2,
            },
        });

        const observer = new MutationObserver(() => {
            const audio = document.getElementById('audio') as HTMLAudioElement | null;

            if (audio !== null) {
                this.audio = audio;

                this.player.attach(audio).then(() => observer.disconnect());
            }
        });

        observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
    }
}

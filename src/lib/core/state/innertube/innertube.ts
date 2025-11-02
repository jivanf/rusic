import type { AsyncInitializable } from '$lib/core/di/init';
import { InnertubeProxy } from '$lib/core/state/innertube';
import Innertube, { Platform, type Types } from 'youtubei.js/web';

export class InnertubeState implements AsyncInitializable {
    innertube!: Innertube;

    constructor() {
        Platform.shim.eval = async (data: Types.BuildScriptResult, env: Record<string, Types.VMPrimative>) => {
            const properties = [];

            if (env.n) {
                properties.push(`n: exportedVars.nFunction("${env.n}")`);
            }

            if (env.sig) {
                properties.push(`sig: exportedVars.sigFunction("${env.sig}")`);
            }

            const code = `${data.output}\nreturn { ${properties.join(', ')} }`;

            return new Function(code)();
        };
    }

    async init(): Promise<unknown> {
        return Innertube.create({ fetch: InnertubeProxy.fetch }).then((innertube) => (this.innertube = innertube));
    }
}

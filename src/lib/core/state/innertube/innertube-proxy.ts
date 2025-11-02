export class InnertubeProxy {
    private readonly _url: URL;
    private readonly headers: Headers;
    private readonly request: Request;

    get url(): URL {
        return this._url;
    }

    constructor(
        input: RequestInfo | URL,
        private readonly init?: RequestInit,
    ) {
        let request: Request | undefined;

        if (input instanceof URL) {
            this._url = input;
        } else if (typeof input === 'string') {
            this._url = new URL(input);
        } else {
            this._url = new URL(input.url);
            this.headers = input.headers;
            request = input;
        }

        this.headers ??= new Headers(init?.headers);
        this.headers.delete('user-agent');

        this.buildUrl();

        this.request ??= new Request(this._url, request);
    }

    public static fetch(input: RequestInfo | URL, init?: RequestInit) {
        return new InnertubeProxy(input, init).fetch();
    }

    public fetch() {
        return fetch(
            this.request,
            this.init !== undefined
                ? {
                      ...this.init,
                      headers: this.headers,
                  }
                : {
                      headers: this.headers,
                  },
        );
    }

    private buildUrl(): void {
        // The proxy creates a new request using the `__host` and `__headers` query parameters.
        this._url.searchParams.set('__host', this._url.host);
        this._url.searchParams.set('__headers', JSON.stringify([...this.headers]));

        this._url.host = 'localhost:8000';
        this._url.protocol = 'http';
    }
}

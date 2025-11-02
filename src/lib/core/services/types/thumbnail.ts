export type ThumbnailResource = {
    /**
     * The default thumbnail image. The default thumbnail for a video – or a resource that refers to a video, such as a playlist item or search result – is 120px wide and 90px tall. The default thumbnail for a channel is 88px wide and 88px tall.
     */
    default: ThumbnailItem;

    /**
     * A higher resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 320px wide and 180px tall. For a channel, this image is 240px wide and 240px tall.
     */
    medium: ThumbnailItem;

    /**
     * A high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.
     */
    high: ThumbnailItem;

    /**
     * A standard resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.
     */
    standard?: ThumbnailItem;

    /**
     * A very high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.
     */
    maxres?: ThumbnailItem;
};

export type ThumbnailItem = {
    /**
     * The images URL.
     */
    url: string;

    /**
     * The images width.
     */
    width: number;

    /**
     * The images height.
     */
    height: number;
};

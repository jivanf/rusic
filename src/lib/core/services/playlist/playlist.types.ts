export type Playlist = {
    /**
     * The ID that YouTube uses to uniquely identify the playlist.
     */
    id: string;

    /**
     * The type of the API resource. For video resources, the value will be youtube#playlist.
     */
    kind: string;

    /**
     * The ETag for the playlist resource.
     */
    etag: string;

    /**
     * The snippet object contains basic details about the playlist, such as its title and description.
     */
    snippet: {
        /**
         * The date and time that the playlist was created. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
         */
        publishedAt: string;

        /**
         * The ID that YouTube uses to uniquely identify the channel that published the playlist.
         */
        channelId: string;

        /**
         * The playlists title.
         */
        title: string;

        /**
         * The playlists description.
         */
        description: string;

        /**
         * A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
         */
        thumbnails: GoogleApiYouTubeThumbnailResource;

        /**
         * The channel title of the channel that the video belongs to.
         */
        channelTitle: string;

        /**
         * Keyword tags associated with the playlist.
         */
        tags: string[];
    };

    /**
     * The status object contains status information for the playlist.
     */
    status: {
        /**
         * The playlists privacy status.
         */
        privacyStatus: string;
    };

    /**
     * The contentDetails object contains information about the playlist content, including the number of videos in the playlist.
     */
    contentDetails: {
        /**
         * The number of videos in the playlist.
         */
        itemCount: number;
    };

    /**
     * The player object contains information that you would use to play the playlist in an embedded player.
     */
    player: {
        /**
         * An <iframe> tag that embeds a player that will play the playlist.
         */
        embedHtml: string;
    };
};


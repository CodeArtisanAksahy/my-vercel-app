const axios = require("axios");

export default async function handler(req, res) {
    const { query } = req.query;

    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    try {
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults: 1,
                    key: process.env.YOUTUBE_API_KEY,
                    videoEmbeddable: "true",
                    relevanceLanguage: "en",
                    safeSearch: "strict",
                },
            },
        );

        if (response.data.items.length > 0) {
            const video = response.data.items[0];
            res.status(200).json({
                videoId: video.id.videoId,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails.medium.url,
            });
        } else {
            res.status(404).json({ error: "No videos found" });
        }
    } catch (error) {
        console.error("YouTube API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to search YouTube" });
    }
}

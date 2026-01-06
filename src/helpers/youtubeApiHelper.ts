import config from "../config";

export async function getYouTubeDataFromCode(code: string, redirectUri: string) {
    
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: config.youtube_client_id!,
            client_secret: config.youtube_client_secret!,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        }),
    });
    const tokens = await res.json();

    
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token=${tokens.access_token}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        channels: channelData.items.map((item: any) => ({
            channelId: item.id,
            channelName: item.snippet.title,
            subscriberCount: item.statistics.subscriberCount,
            viewCount: item.statistics.viewCount,
            videoCount: item.statistics.videoCount
        }))
    };
}

export async function getYouTubeVideoStats(videoUrl: string, apiKey: string) {
    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) throw new Error("Invalid YouTube URL");

    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${apiKey}`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("Video not found");
    }

    const stats = data.items[0].statistics;
    return {
        videoId,
        title: data.items[0].snippet.title,
        views: stats.viewCount || 0,
        likes: stats.likeCount || 0,
        comments: stats.commentCount || 0,
        shares: 0, // shares not available in YouTube API
    };
}




import axios from 'axios';
import config from '../../config';

export interface IContentStats {
     views: number;
     likes: number;
     comments: number;
     shares: number;
     followers: number; // Added this field
}

// 3. THE MAIN CLASS
export const SocialMediaAPI = {
     getStats: async (platform: 'TikTok' | 'Instagram' | 'YouTube' | 'X', videoId: string): Promise<IContentStats> => {
          switch (platform) {
               case 'YouTube':
                    return await SocialMediaAPI.getYouTubeStats(videoId);
               case 'Instagram':
                    return await SocialMediaAPI.getInstagramStats(videoId);
               case 'TikTok':
                    return await SocialMediaAPI.getTikTokStats(videoId);
               case 'X':
                    return await SocialMediaAPI.getXStats(videoId);
               default:
                    throw new Error('Unsupported Platform');
          }
     },

     //  YOUTUBE (Requires 2 API calls: Video -> Channel)
     getYouTubeStats: async (videoId: string): Promise<IContentStats> => {
          try {
               // Step 1: Get Video Stats & Channel ID
               const vidResponse = await axios.get(config.social.youtube.base_url_videos, {
                    params: {
                         part: 'statistics,snippet', // snippet contains channelId
                         id: videoId,
                         key: config.social.youtube.api_key,
                    },
               });

               const vidItem = vidResponse.data.items?.[0];
               if (!vidItem) throw new Error('Video not found');

               const videoStats = vidItem.statistics;
               const channelId = vidItem.snippet.channelId;

               // Step 2: Get Channel Stats (Subscribers) using Channel ID
               const channelResponse = await axios.get(config.social.youtube.base_url_channels, {
                    params: {
                         part: 'statistics',
                         id: channelId,
                         key: config.social.youtube.api_key,
                    },
               });

               const channelStats = channelResponse.data.items?.[0]?.statistics;

               return {
                    views: parseInt(videoStats.viewCount || '0'),
                    likes: parseInt(videoStats.likeCount || '0'),
                    comments: parseInt(videoStats.commentCount || '0'),
                    shares: 0,
                    followers: parseInt(channelStats?.subscriberCount || '0'), // YouTube Subscribers
               };
          } catch (error) {
               console.error('YouTube API Error:', error);
               throw new Error('Failed to fetch YouTube stats');
          }
     },

     // INSTAGRAM (Requires extra permission: instagram_basic)
     getInstagramStats: async (mediaId: string): Promise<IContentStats> => {
          try {
               // Step 1: Request Media Fields AND Owner Fields
               // 'owner{followers_count}' might require specific permissions or Business Account linking
               const response = await axios.get(`${config.social.instagram.base_url}/${mediaId}`, {
                    params: {
                         fields: 'like_count,comments_count,media_type,media_product_type,owner{followers_count}',
                         access_token: config.social.instagram.access_token,
                    },
               });

               const data = response.data;
               const views = data.media_type === 'VIDEO' ? data.view_count : 0;

               return {
                    views: views || 0,
                    likes: data.like_count || 0,
                    comments: data.comments_count || 0,
                    shares: 0,
                    followers: data.owner?.followers_count || 0, // Available if owner field is accessible
               };
          } catch (error) {
               console.error('Instagram API Error:', error);
               return { views: 0, likes: 0, comments: 0, shares: 0, followers: 0 };
          }
     },

     // TIKTOK (Usually returns Author stats in the same call)
     getTikTokStats: async (videoId: string): Promise<IContentStats> => {
          try {
               const response = await axios.get(config.social.tiktok.base_url, {
                    params: { video_id: videoId },
                    headers: {
                         'X-RapidAPI-Key': config.social.tiktok.api_key,
                         'X-RapidAPI-Host': 'tiktok-scraper-api.p.rapidapi.com',
                    },
               });

               const data = response.data;

               return {
                    views: data.stats.playCount || 0,
                    likes: data.stats.diggCount || 0,
                    comments: data.stats.commentCount || 0,
                    shares: data.stats.shareCount || 0,
                    followers: data.authorStats?.followerCount || 0, // Most scrapers include authorStats
               };
          } catch (error) {
               console.error('TikTok API Error:', error);
               return { views: 0, likes: 0, comments: 0, shares: 0, followers: 0 };
          }
     },

     // X (Twitter)
     getXStats: async (tweetId: string): Promise<IContentStats> => {
          try {
               const response = await axios.get(config.social.x.base_url, {
                    params: {
                         'ids': tweetId,
                         // Get view_count (impression_count), likes, replies, retweets
                         'tweet.fields': 'public_metrics',
                         // Expand the author_id to get user details
                         'expansions': 'author_id',
                         // Get the followers count from the user object
                         'user.fields': 'public_metrics',
                    },
                    headers: {
                         Authorization: `Bearer ${config.social.x.bearer_token}`,
                    },
               });

               const data = response.data;

               // 1. Extract Tweet Metrics
               const tweetData = data.data?.[0];
               if (!tweetData) throw new Error('Tweet not found');

               const metrics = tweetData.public_metrics;

               // 2. Extract Author Metrics (Followers)
               // The API returns users in the "includes" object
               const authorId = tweetData.author_id;
               const authorData = data.includes?.users?.find((u: any) => u.id === authorId);
               const followerCount = authorData?.public_metrics?.followers_count || 0;

               return {
                    views: metrics.impression_count || 0, // X calls views "impressions"
                    likes: metrics.like_count || 0,
                    comments: metrics.reply_count || 0,
                    shares: metrics.retweet_count || 0,
                    followers: followerCount,
               };
          } catch (error) {
               console.error('X (Twitter) API Error:', error);
               return { views: 0, likes: 0, comments: 0, shares: 0, followers: 0 };
          }
     },
};

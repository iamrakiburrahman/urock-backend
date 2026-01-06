import fetch from 'node-fetch';
import config from '../config';
import { SocialIntegration } from '../app/modules/socialIntegration/socialIntegration.model';



export async function getAccessTokenFromCode(code: string, redirectUri: string) {
  const params = new URLSearchParams({
    client_id: config.app_id!,
    redirect_uri: redirectUri!,
    client_secret: config.app_secret!,
    code: code
  });

  const url = `https://graph.facebook.com/v21.0/oauth/access_token?${params.toString()}`;

  const res = await fetch(url);
  const data: any = await res.json();

  if (data.error) {
    throw new Error(`Meta Code Exchange Error: ${data.error.message}`);
  }

  return data.access_token; // Short-lived token
}


export async function exchangeForLongLivedToken(shortLivedToken: string) {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.app_id}&client_secret=${config.app_secret}&fb_exchange_token=${shortLivedToken}`;
  const res = await fetch(url);
  const data: any = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.access_token;
}


export async function getFacebookPagesWithTokens(userAccessToken: string) {
  const url = `https://graph.facebook.com/v21.0/me?fields=accounts{id,name,access_token,instagram_business_account}&access_token=${userAccessToken}`;

  const res = await fetch(url);
  const data: any = await res.json();

  console.log(data, "DATA")

  if (data.error) throw new Error(data.error.message);


  const pagesArray = data.accounts?.data || [];

  return pagesArray.map((p: any) => ({
    pageId: p.id,
    pageName: p.name,
    pageAccessToken: p.access_token,
    instagramBusinessId: p.instagram_business_account?.id || null,
  }));
}



// ===============THIS IS RIGHT CODE======================
// export async function getMediaIdFromUrl(postUrl: string, accessToken: string) {
//     const isInstagram = postUrl.includes('instagram.com');
//     const endpoint = isInstagram ? 'instagram_oembed' : 'oembed'; 

//     const url = `https://graph.facebook.com/v21.0/${endpoint}?url=${encodeURIComponent(postUrl)}&access_token=${accessToken}`;

//     const res = await fetch(url);
//     const data: any = await res.json();

//     if (data.error) throw new Error(`Link Verification Failed: ${data.error.message}`);

//     const rawId = data.media_id || data.id;

//     // --- ফেসবুকের জন্য বিশেষ সংশোধন ---
//     if (!isInstagram && rawId && typeof rawId === 'string' && rawId.includes('_')) {
//         // যদি আইডি 123_456 হয়, তবে শুধু 456 টুকু রিটার্ন করবে
//         return rawId.split('_')[1];
//     }

//     return rawId;
// }

export async function getMediaIdFromUrl(postUrl: string, userId: string) {

  const isInstagram = postUrl.includes('instagram.com');
  const isFacebook = postUrl.includes('facebook.com');

  if (isInstagram) {
    // Extract shortcode from URL
    const shortcodeMatch = postUrl.match(/\/(p|reel|tv|reels)\/([A-Za-z0-9_-]+)/);
    console.log(shortcodeMatch,"match")
    if (!shortcodeMatch) {
      throw new Error('Could not extract shortcode from URL');
    }

    const shortcode = shortcodeMatch[2];

    // Your Instagram User ID and Access Token
    const data = await SocialIntegration.findOne({ user: userId, platform: 'instagram' });
  
    // console.log(data?.accounts[0].igUserId, "IG USER ID")
    const pageAccessToken = data?.accessToken
    const igUserId = data?.accounts[0]?.igUserId;

    console.log('Fetching media for User:', userId);
console.log('Access Token exists:', !!pageAccessToken);
console.log('Access Token Type:', typeof pageAccessToken);
  
    // console.log('IG User ID:', igUserId);
    // const IG_USER_ID = '17841479729030131';
    // const PAGE_ACCESS_TOKEN = 'EAAbiZCsGNSE8BQQ9bovgqDqAhT8b2LYvVWBkJjmAhoPotfl67Dc0ma3qar2BA0vri7GZBcejng2BI1fSyAxFnipE2cUrZC3ZAO7bRuf9ko6SxoNS10p3CwQEIZA7ytAZCXVZAKoaKiBDA6i3rm99L1fdz9ZCPumM5E0nbR4kAFjtBJGZAkXy5BkEfXxK5nAzdOCCDdAvm7Wy7';

    // Get ALL media from your Instagram account
    const mediaUrl = `https://graph.facebook.com/v21.0/${igUserId}/media?fields=id,permalink&limit=100&access_token=${pageAccessToken}`;

    console.log(mediaUrl,"media url")

    try {
      const response = await fetch(mediaUrl);
      console.log(response,"response")
      const data: any = await response.json();


      if (!data.data || data.data.length === 0) {
        throw new Error('No media found in your Instagram account');
      }

      // find the media item whose permalink contains the shortcode
      const matchingMedia = data.data.find((item: any) =>
        item.permalink && item.permalink.includes(shortcode)
      );

      if (!matchingMedia) {
        throw new Error(`No media found with shortcode: ${shortcode}`);
      }

      console.log(`Found numeric ID for shortcode ${shortcode}: ${matchingMedia.id}`);
      return matchingMedia.id; // Returns '18048902030465240'

    } catch (error: any) {
      console.error('Error fetching media:', error);
      throw new Error(`Failed to convert shortcode to numeric ID: ${error.message}`);
    }
  } else if (isFacebook) {
    console.log('Processing Facebook URL:', postUrl);

  } else {
    throw new Error('Only Instagram and Facebook URLs are supported');
  }
}


export async function getInstagramStats(mediaId: string, accessToken: string) {

  console.log(accessToken,"Access token")

  const fields = 'id,media_type,like_count,comments_count';
  const url = `https://graph.facebook.com/v21.0/${mediaId}?fields=${fields}&access_token=${accessToken}`;

  const res = await fetch(url);
  const data: any = await res.json();
  if (data.error) throw new Error(data.error.message);


  let metric = 'impressions';
  if (data.media_type === 'VIDEO' || data.media_type === 'REELS') {
    metric = 'impressions,reach,video_views';
  }

  const insightsUrl = `https://graph.facebook.com/v21.0/${mediaId}/insights?metric=${metric}&access_token=${accessToken}`;

  const insRes = await fetch(insightsUrl);
  const insData: any = await insRes.json();


  const getMetricValue = (name: string) =>
    insData.data?.find((m: any) => m.name === name)?.values?.[0]?.value || 0;

  const views = data.media_type === 'VIDEO'
    ? getMetricValue('video_views')
    : getMetricValue('impressions');

  return {
    likes: data.like_count || 0,
    comments: data.comments_count || 0,
    views: views,
  };
}


export async function getFacebookStats(mediaId: string, accessToken: string) {

  const fields = 'id,reactions.summary(true),comments.summary(true),shares,insights.metric(post_impressions_unique)';
  const url = `https://graph.facebook.com/v21.0/${mediaId}?fields=${fields}&access_token=${accessToken}`;

  const res = await fetch(url);
  const data: any = await res.json();

  if (data.error) {
    console.error("Facebook API Core Error:", data.error);
    throw new Error(data.error.message);
  }


  let views = data.insights?.data?.find((i: any) => i.name === 'post_impressions_unique')?.values?.[0]?.value || 0;


  try {
    const videoUrl = `https://graph.facebook.com/v21.0/${mediaId}?fields=video_insights.metric(total_video_views)&access_token=${accessToken}`;
    const videoRes = await fetch(videoUrl);
    const videoData: any = await videoRes.json();

    if (videoData.video_insights) {
      const vViews = videoData.video_insights.data?.find((i: any) => i.name === 'total_video_views')?.values?.[0]?.value;
      if (vViews) views = vViews;
    }
  } catch (err) {

  }

  return {

    likes: data.reactions?.summary?.total_count || 0,
    comments: data.comments?.summary?.total_count || 0,
    shares: data.shares?.count || 0,
    views: views,
  };
}

// ======================== Facebook post ===================
export async function getFacebookPostFromUrl(postUrl: string, accessToken: string) {
  const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(
    postUrl
  )}&access_token=${accessToken}`;

  const res = await fetch(oembedUrl);
  const data: any = await res.json();

  if (data.error) {
    throw new Error(`Meta API Error: ${data.error.message}`);
  }

  //if instagram than media_id, and if facebook than id
  return data.media_id || data.id;
}


// ======================== TikTok ===================

export async function getTikTokDataFromCode(code: string, redirectUri: string) {
  const params = new URLSearchParams({
    client_key: config.tiktok_client_key!,
    client_secret: config.tiktok_client_secret!,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data: any = await res.json();
  if (data.error) throw new Error(`TikTok Auth Error: ${data.error_description}`);

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    openId: data.open_id,
    expiresIn: data.expires_in
  };
}
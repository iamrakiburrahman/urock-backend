export const extractVideoId = (link: string, platform: 'TikTok' | 'Instagram' | 'YouTube' | 'X'): string => {
     try {
          const url = new URL(link);

          // 1. YOUTUBE LOGIC
          if (platform === 'YouTube') {
               // Case A: Short URL (e.g., https://youtu.be/dQw4w9WgXcQ)
               if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
                    return url.pathname.slice(1); // Removes the leading '/'
               }

               // Case B: Standard URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
               if (url.hostname.includes('youtube.com') || url.hostname.includes('m.youtube.com')) {
                    // Shorts URL (e.g., https://www.youtube.com/shorts/dQw4w9WgXcQ)
                    if (url.pathname.startsWith('/shorts/')) {
                         return url.pathname.split('/')[2] || '';
                    }
                    // Standard Watch URL
                    return url.searchParams.get('v') || '';
               }
               return '';
          }

          // 2. TIKTOK LOGIC
          if (platform === 'TikTok') {
               // Standard format: https://www.tiktok.com/@username/video/729402...
               // Mobile format: https://vm.tiktok.com/ZM... (These usually need expanding first, but we handle the basic ID here)
               const segments = url.pathname.split('/').filter((segment) => segment.length > 0);

               // usually the last segment is the ID
               const possibleId = segments[segments.length - 1];

               // Basic check: is it numeric? TikTok IDs are long numbers.
               if (/^\d+$/.test(possibleId)) {
                    return possibleId;
               }
               return '';
          }

          // 3. INSTAGRAM LOGIC
          if (platform === 'Instagram') {
               // Formats:
               // https://www.instagram.com/reel/Cj34_x/
               // https://www.instagram.com/p/Cj34_x/
               const segments = url.pathname.split('/').filter((segment) => segment.length > 0);

               // usually the segment after 'reel' or 'p' is the ID
               if (segments.includes('reel') || segments.includes('p')) {
                    const index = segments.findIndex((s) => s === 'reel' || s === 'p');
                    return segments[index + 1] || '';
               }
               return '';
          }

          // 4. X (TWITTER) LOGIC
          if (platform === 'X') {
               // Formats:
               // https://twitter.com/username/status/1234567890
               // https://x.com/username/status/1234567890
               const segments = url.pathname.split('/').filter((segment) => segment.length > 0);

               // The structure is usually [username, 'status', id]
               if (segments.includes('status')) {
                    const index = segments.indexOf('status');
                    return segments[index + 1] || '';
               }
               return '';
          }

          return '';
     } catch (e) {
          // If the URL is invalid (e.g. just a string "hello"), URL() constructor throws error
          console.error('Error extracting video ID:', e);
          return '';
     }
};

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
     ip_address: process.env.IP_ADDRESS,
     frontend_url: process.env.FRONTEND_URL,
     backend_url: process.env.BACKEND_URL,
     reset_pass_expire_time: process.env.RESET_TOKEN_EXPIRE_TIME,
     database_url: process.env.DATABASE_URL,
     node_env: process.env.NODE_ENV,
     port: process.env.PORT,
     bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
     allowed_origins: process.env.ALLOWED_ORIGINS,
     upload_path: process.env.UPLOAD_PATH,
     otp: {
          length: Number(process.env.OTP_LENGTH) || 4,
          expire_time: Number(process.env.OTP_EXPIRE_TIME) * 60000 || 3 * 60000,
     },
     jwt: {
          jwt_secret: process.env.JWT_SECRET,
          jwt_expire_in: process.env.JWT_EXPIRE_IN,
          jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
          jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
     },
     server: {
          name: process.env.SERVER_NAME,
     },


     email: {
          email_header: process.env.EMAIL_HEADER_NAME,
          from: process.env.EMAIL_FROM,
          user: process.env.EMAIL_USER,
          port: process.env.EMAIL_PORT,
          host: process.env.EMAIL_HOST,
          pass: process.env.EMAIL_PASS,
     },
     express_session: process.env.EXPRESS_SESSION_SECRET_KEY,
     social: {
          google_client_id: process.env.GOOGLE_CLIENT_ID,
          facebook_client_id: process.env.FACEBOOK_CLIENT_ID,
          google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
          facebook_client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          callback_url: process.env.GOOGLE_CALLBACK_URL,
          youtube: {
               api_key: process.env.YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
               base_url_videos: 'https://www.googleapis.com/youtube/v3/videos',
               base_url_channels: 'https://www.googleapis.com/youtube/v3/channels',
          },
          instagram: {
               access_token: process.env.INSTAGRAM_ACCESS_TOKEN || 'YOUR_IG_ACCESS_TOKEN',
               base_url: 'https://graph.facebook.com/v18.0',
          },
          tiktok: {
               api_key: process.env.TIKTOK_API_KEY || 'YOUR_RAPIDAPI_KEY',
               base_url: 'https://tiktok-scraper-api.p.rapidapi.com/video/stats',
          },
          x: {
               bearer_token: process.env.X_BEARER_TOKEN || 'YOUR_X_BEARER_TOKEN',
               base_url: 'https://api.twitter.com/2/tweets',
          },
     },
     base_url: process.env.BASE_URL,
     app_id: process.env.APP_ID,
     app_secret: process.env.APP_SECRET,
     youtube_client_id: process.env.YOUTUBE_CLIENT_ID,
     youtube_client_secret: process.env.YOUTUBE_CLIENT_SECRET,
     youtube_api_key: process.env.YOUTUBE_API_KEY,
     tiktok_client_key: process.env.TIKTOK_CLIENT_KEY,
     tiktok_client_secret: process.env.TIKTOK_CLIENT_SECRET,
     contact_receiver_email: process.env.CONTACT_RECEIVER_EMAIL,
     redis: {
          password: process.env.REDIS_PASSWORD,
          url: process.env.REDIS_URL,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          db: process.env.REDIS_DB,
     },
     twilio: {
          accountSid: process.env.TWILIO_ACCOUNT_SID || '',
          authToken: process.env.TWILIO_AUTH_TOKEN || '',
          phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
     },
     stripe: {
          stripe_secret_key: process.env.STRIPE_SECRET_KYE,
          stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
          paymentSuccess_url: process.env.STRIPE_PAYMENT_SUCCESS_URL,
          paymentCancel_url: process.env.STRIPE_PAYMENT_CANCEL_URL,
          stripe_webhook_url: process.env.STRIPE_WEBHOOK_URL,
          stripe_product_id: process.env.STRIPE_PRODUCT_ID,
     },
     firebase: {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
     },
     super_admin: {
          email: process.env.SUPER_ADMIN_EMAIL,
          password: process.env.SUPER_ADMIN_PASSWORD,
     },
};

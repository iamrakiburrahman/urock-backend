    module.exports = {
    apps: [
        {
        name: 'emmaestrada-backend',
        script: 'dist/server.js',

        // Cluster Configuration
        instances: 'max',
        exec_mode: 'cluster',

        // Restart Policy
        autorestart: true,
        max_restarts: 10,
        min_uptime: '10s',
        restart_delay: 4000,

        // Resource Limits
        max_memory_restart: '1G', 

        // Graceful Shutdown
        kill_timeout: 5000,
        wait_ready: false, 
        listen_timeout: 10000,

        // File Watching
        watch: false, // Production এ never true করবে না
        ignore_watch: ['node_modules', 'logs', '.git'],

        // Logging
        error_file: 'logs/pm2-err.log',
        out_file: 'logs/pm2-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true, 
        log_type: 'json', 

        // Environment Variables
 env_production: {
  SERVER_NAME: 'emmaestrada-backend',
  NODE_ENV: 'production',
  IP_ADDRESS: '72.62.176.14',
  PORT: 5000,
  DATABASE_URL: 'mongodb://localhost:27017/emmaestrada',
  JWT_SECRET: 'c052adc122aa8884a0489455f73e6817ba6e474b6c675736638ea8defb5b4dda65c90e4222ac7b2d92fc503bdb372ee14d6b2148e029cbb9f2234559685356e5',
  BCRYPT_SALT_ROUNDS: 12,
  JWT_EXPIRE_IN: '30d',
  JWT_REFRESH_SECRET: 'd059b86ec88d5a740c6ebd6fc1978083cc00f2e924aa68e7337d033426b095e1cb5dd97012e353a2744f8942a0933ce9a96d768ce860c995de009d800e52e873',
  JWT_REFRESH_EXPIRE_IN: '365d',
  // Upload Path 
  UPLOAD_PATH: '/var/uploads',
 // otp length in digits
  OTP_LENGTH: 6,
  OTP_EXPIRE_TIME: 3,

  SUPER_ADMIN_EMAIL: 'superadmin@emma.com',
  SUPER_ADMIN_PASSWORD: 'hello123',
  // password reset ui link 
  FRONTEND_URL: 'https://emmaestrada.vercel.app',
  // Backend url
  BACKEND_URL: 'https://emmaestrada.vercel.app',
  EMAIL_HEADER_NAME: 'Influencer Music Platform',
  EMAIL_FROM: 'rakibhassan305@gmail.com',
  EMAIL_USER: 'rakibhassan305@gmail.com',
  EMAIL_PASS: 'lcbr tlhn ilcm czbf',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: 587,

//   stripe secret 
  STRIPE_SECRET_KEY: 'sk_test_51OHIrVB5u2A30G2Q9lxqhjtmnbhi8Zvw76mm0ck9xWvEzd8SiVK7oT0XtKM8m0G7Uwvwh51piI9FjW4lNTfDVnNO00spGYZeLP',
  STRIPE_WEBHOOK_SECRET: 'whsec_fbb22c9e5bebcdbcc78e3f849caf4589400b06cbda3c6c3ae7b4027158aafad3',
  EXPRESS_SESSION_SECRET_KEY: '1b97a62d173c126d6533566caad3aa56c48b445215343da33ac0e0f0d3793060',
STRIPE_PAYMENT_SUCCESS_URL: 'http://72.62.176.14:5000/api/v1',
STRIPE_PAYMENT_CANCEL_URL: 'http://72.62.176.14:5000/api/v1',

// meta app id and app secret
APP_ID: '1938433657096271',
APP_SECRET: '177856a07f6f95b3ed67ef08b96d5947',
YOUTUBE_CLIENT_ID: '772134927802-cgjnnmkkiqhtbu10da5pjoav5rvgc0b7.apps.googleusercontent.com',
YOUTUBE_CLIENT_SECRET: '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',
YOUTUBE_API_KEY: 'AIzaSyCwUgUTR1LJYIIMuMRBYHr3BHrWaWE974U',
TIKTOK_CLIENT_KEY: 'sbawu8f1870lwzsfs5',
TIKTOK_CLIENT_SECRET: 'fhvfWlvopa2715TTreoIVf8BVDB1cUuE',

CONTACT_RECEIVER_EMAIL: 'admin@emma.com',


GOOGLE_CLIENT_ID: 'your_google_client_id_here',
GOOGLE_CLIENT_SECRET: 'your_google_client_secret_here',
GOOGLE_CALLBACK_URL: 'http://localhost:5000/api/v1/auth/google/callback',
FACEBOOK_CLIENT_ID: 'your_facebook_client_id_here',
FACEBOOK_CLIENT_SECRET: 'your_facebook_client_secret_here',

REDIS_PASSWORD: 'redis',
REDIS_URL: 'redis://localhost:6379',
REDIS_HOST: 'localhost',
REDIS_PORT: 6379,
REDIS_DB: 0,
},


        // Advanced Options
        source_map_support: true, 
        instance_var: 'INSTANCE_ID',

        // Monitoring
        vizion: false,
        post_update: ['npm install'],

        // Graceful reload
        shutdown_with_message: false,

        // Cron restart (optional - রাতে 2am এ restart)
        // cron_restart: '0 2 * * *',

        // Performance
        node_args: '--max-old-space-size=2048', // 2GB heap size
        },
    ]
    }
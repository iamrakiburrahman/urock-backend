import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import colors from 'colors';
import { validateConfig } from './DB/configValidation';
import { connectToDatabase } from './DB/db';
import app from './app';
import config from './config';
import { logger } from './shared/logger';
import { socketHelper } from './helpers/socketHelper';
import { setupProcessHandlers } from './DB/processHandlers';
import { setupSecurity } from './DB/security';
import { connectToRedis } from './DB/redis';
import { setupQueueEvents, setupWorkerEvents } from './DB/bullMQ';
import { startRealtimeMonitoring } from './scripts/startRealtimeMonitoring';
import { seedSuperAdmin } from './seed/seedAdmin';

export let httpServer: HttpServer;
export let socketServer: SocketServer;

// Global error handlers to prevent crashes
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
     logger.error(colors.red('🚨 Unhandled Rejection at:'), promise, 'reason:', reason);
     // Don't exit - log and continue
});

process.on('uncaughtException', (error: Error) => {
     logger.error(colors.red('🚨 Uncaught Exception:'), error);
     logger.error(colors.red('Stack:'), error.stack);
     // Exit gracefully on uncaught exceptions
     setTimeout(() => process.exit(1), 1000);
});

async function startServer(): Promise<void> {
     try {
          logger.info(colors.cyan('🚀 Starting HTTP server...'));

          // Validate config first
          validateConfig();

          // Connect to database 
          await connectToDatabase();


          // await seedSuperAdmin();

          // Create HTTP server
          httpServer = createServer(app);
          const httpPort = Number(config.port);
          const ipAddress = config.ip_address as string;

          // Set timeouts
          httpServer.timeout = 120000;
          httpServer.keepAliveTimeout = 5000;
          httpServer.headersTimeout = 60000;

          // Start HTTP server
          await new Promise<void>((resolve, reject) => {
               httpServer.listen(httpPort, ipAddress, () => {
                    logger.info(colors.bgCyan.bold.white(`♻️  Server (PID: ${process.pid}) listening on http://${ipAddress}:${httpPort}`));
                    resolve();
               });

               httpServer.on('error', (err: any) => {
                    if (err.code === 'EADDRINUSE') {
                         logger.error(colors.red(`❌ Port ${httpPort} is already in use`));
                    } else if (err.code === 'EACCES') {
                         logger.error(colors.red(`❌ Permission denied to bind to port ${httpPort}`));
                    } else {
                         logger.error(colors.red('❌ HTTP server error:'), err);
                    }
                    reject(err);
               });
          });

          // Set up Socket.io server
          logger.info(colors.cyan('🔌 Setting up Socket.IO...'));
          socketServer = new SocketServer(httpServer, {
               cors: {
                    origin: config.allowed_origins || '*',
                    credentials: true,
               },
               pingTimeout: 60000,
               pingInterval: 25000,
          });

          socketHelper.socket(socketServer);
          (global as any).io = socketServer;

          logger.info(colors.bgYellow(`♻️  Socket.IO ready on PID ${process.pid}`));

     } catch (error: any) {
          logger.error(colors.red(`❌ Server (PID: ${process.pid}) failed to start:`), error?.message || error);
          if (error?.stack) {
               logger.error(colors.red('Stack trace:'), error.stack);
          }
          throw error;
     }
}

// ==========================================
// ENTRY POINT - Runs once at startup
// ==========================================
async function main() {
     try {
          logger.info(colors.green.bold('='.repeat(50)));
          logger.info(colors.green.bold('🌟 Starting Emma Estrada Backend'));
          logger.info(colors.green.bold(`📍 Environment: ${config.node_env}`));
          logger.info(colors.green.bold(`🆔 Process ID: ${process.pid}`));
          logger.info(colors.green.bold('='.repeat(50)));

          // Setup security headers
          logger.info(colors.cyan('🔒 Setting up security...'));
          setupSecurity();

          // Setup graceful shutdown handlers
          logger.info(colors.cyan('🛡️  Setting up process handlers...'));
          setupProcessHandlers();

          // Start the server
          await startServer();

          // Connect to Redis (with retry logic)
          logger.info(colors.cyan('🔴 Connecting to Redis...'));
          try {
               await connectToRedis();
               logger.info(colors.green('✅ Redis connected'));
          } catch (redisError: any) {
               logger.error(colors.yellow('⚠️  Redis connection failed (non-fatal):'), redisError?.message);
               logger.warn(colors.yellow('Server will continue without Redis. Some features may be limited.'));
          }

          // Setup BullMQ events (only if Redis is available)
          try {
               logger.info(colors.cyan('📋 Setting up BullMQ events...'));
               setupQueueEvents();
               setupWorkerEvents();
               logger.info(colors.green('✅ BullMQ events configured'));
          } catch (bullmqError: any) {
               logger.error(colors.yellow('⚠️  BullMQ setup failed (non-fatal):'), bullmqError?.message);
               logger.warn(colors.yellow('Background jobs may not work. Check Redis connection.'));
          }

          // Start monitoring (only in production)
          if (config.node_env === 'production') {
               try {
                    logger.info(colors.cyan('📊 Starting realtime monitoring...'));
                    startRealtimeMonitoring();
                    logger.info(colors.green('✅ Monitoring started'));
               } catch (monitorError: any) {
                    logger.error(colors.yellow('⚠️  Monitoring setup failed (non-fatal):'), monitorError?.message);
               }
          }

          logger.info(colors.green.bold('='.repeat(50)));
          logger.info(colors.green.bold(`✅ Server bootstrap completed successfully (PID: ${process.pid})`));
          logger.info(colors.green.bold(`🌐 Server ready to accept connections`));
          logger.info(colors.green.bold('='.repeat(50)));

          // Notify PM2 that app is ready (if using PM2)
          if (process.send) {
               process.send('ready');
          }

     } catch (error: any) {
          logger.error(colors.red.bold('='.repeat(50)));
          logger.error(colors.red.bold('❌ BOOTSTRAP FAILED'));
          logger.error(colors.red.bold('='.repeat(50)));
          logger.error(colors.red('Error:'), error?.message || error);
          if (error?.stack) {
               logger.error(colors.red('Stack trace:'), error.stack);
          }
          logger.error(colors.red.bold('='.repeat(50)));

          // Give time for logs to flush
          await new Promise(resolve => setTimeout(resolve, 1000));

          process.exit(1);
     }
}

// Start the application
main();
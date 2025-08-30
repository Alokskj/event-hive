import express, { Request, Response } from 'express';
import _config from './config/_config';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './routes';
import {
    BadRequestException,
    globalErrorHandlerMiddleware,
    notFoundMiddleware,
} from './lib/error-handling';
import prisma from '@config/prisma';
import { startNotificationSchedulers } from './lib/notifications/scheduler';

const app = express();

// middlewares

app.use(express.static('public'));
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(_config.cookieSecret));

// routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Server is running' });
});

app.use('*', notFoundMiddleware);
app.use(globalErrorHandlerMiddleware);

async function startServer(): Promise<void> {
    try {
        const port = _config.port;

        // Connect to the database
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        const server = app.listen(port, () => {
            console.log(
                `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`,
            );
            console.log(`📡 Listening on port ${port}`);
            console.log(`🌐 Server URL: http://localhost:${port}`);
            startNotificationSchedulers();
            console.log('🕒 Notification schedulers started');
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string) => {
            console.log(
                `\n📡 Received ${signal}. Starting graceful shutdown...`,
            );

            server.close(async () => {
                console.log('🔌 HTTP server closed');

                try {
                    await prisma.$disconnect();
                    console.log('🔗 Database connection closed');
                    console.log('✅ Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                console.error('⚠️  Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        // Listen for shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error(
                'Unhandled Rejection at:',
                promise,
                'reason:',
                reason,
            );
            gracefulShutdown('unhandledRejection');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer().catch((err) => {
    console.error('Unhandled error during server startup:', err);
    process.exit(1);
});

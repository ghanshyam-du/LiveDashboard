import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS configuration — supports single, multiple, or dynamic origin reflection
  const clientUrl = process.env.CLIENT_URL;
  let corsOrigin: any = true;

  if (clientUrl && clientUrl !== '*') {
    const origins = clientUrl.split(',').map((url) => url.trim().replace(/\/$/, ''));
    corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || origins.includes(origin) || origins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    };
  }

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  // Global validation pipe — rejects invalid DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      forbidNonWhitelisted: false,
      transform: true,       // auto-transform query params to typed DTOs
    }),
  );

  // Swagger API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Live Vehicle Service Dashboard API')
    .setDescription('REST API for the Live Vehicle Service Operations Dashboard')
    .setVersion('1.0')
    .addTag('Dashboard', 'KPI summary and analytics data')
    .addTag('Bookings', 'Booking management')
    .addTag('Mechanics', 'Mechanic management')
    .addTag('Customers', 'Customer management')
    .addTag('Services', 'Vehicle service catalogue')
    .addTag('Notifications', 'Operational notifications')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  // Health endpoint — useful for load balancers and uptime monitors
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/api/health', (_req: unknown, res: { json: (body: object) => void }) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();

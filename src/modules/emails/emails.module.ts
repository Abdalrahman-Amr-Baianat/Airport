import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.worker';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
        defaultJobOptions: { attempts: 3 },
      }),
    }),
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [EmailsService, EmailProcessor],
  exports: [EmailsService],
})
export class EmailsModule {}

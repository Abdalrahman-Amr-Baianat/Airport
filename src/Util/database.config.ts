import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
export const databaseConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    synchronize: true,
    ssl: {
      ca: fs
        .readFileSync(
          path.join(__dirname, '..', '..', 'eu-north-1-bundle.pem'),
        )
        .toString(),
    },
    // logging: true,
  }),
});

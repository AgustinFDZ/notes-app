import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/app/envs';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort ? parseInt(envs.dbPort) : 5432,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
      synchronize: true,
      autoLoadEntities: true,
    }),
    NotesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }

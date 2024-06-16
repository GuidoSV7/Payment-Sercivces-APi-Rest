import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [

    MongooseModule.forRoot('mongodb://mongo:sfYOJDqFbGZlmmcifQxGGbXXeWLQeulo@monorail.proxy.rlwy.net:28058/springbootgraphql?authSource=admin'),
    
    ConfigModule.forRoot({isGlobal:true}),

    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
              ? { rejectUnauthorized: false }
              : null,
      },

      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    PaymentsModule,
    
    UsersModule,

    
  
  
  
  
  ],

})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';



@Module({
  imports: [
    PaymentsModule,

    ConfigModule.forRoot({isGlobal:true}),

    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
              ? { rejectUnauthorized: false }
              : null,
      },

  
  
  
  
  ],

})
export class AppModule {}

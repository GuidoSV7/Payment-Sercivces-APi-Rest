import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NATS_SERVICE, envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
// import { ClientProxy } from '@nestjs/microservices';
import { DataSource, Repository } from 'typeorm'; 
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UsersService } from 'src/users/users.service';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger('PaymentsService');

  constructor(   
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>,
  private readonly usersService: UsersService,
  
  
  private readonly dataSource: DataSource
) {}

async create(createPaymentDto: CreatePaymentDto) {
  try {
    const {...PaymentDetails} = createPaymentDto;
    const Payment = this.paymentRepository.create({
      ...PaymentDetails
    });

    const userdatos = await this.usersService.findOne( PaymentDetails.idUser);
    //console.log("Datos", userdatos);

   
    const savedPayment = await this.paymentRepository.save(Payment);

    return {
      ...savedPayment,
      user: userdatos
    };
    
  } catch (error) {
    
    this.logger.error(error.message);
    return error.message;
  }
}

async findAll(paginationDto: PaginationDto) {
  const { limit = 10, offset = 0 } = paginationDto;

  const payments = await this.paymentRepository.find({
    take: limit,
    skip: offset,
  });

  const paymentsWithUser = await Promise.all(
    payments.map(async (payment) => {
      const userdatos = await this.usersService.findOne(payment.idUser);
      return {
        ...payment,
        user: userdatos
      };
    })
  );

  return paymentsWithUser;
}

  async findOne(id : number) {
    let payment: Payment;
  
    const queryBuilder = this.paymentRepository.createQueryBuilder();
    payment = await queryBuilder
      .where('id =:id ',{
        id:id,
      })
      .getOne();
  
    if(!payment){
      throw new NotFoundException(`Payment con id ${id} no encontrada`);
    }
  
    const userdatos = await this.usersService.findOne(payment.idUser);
  
    return {
      ...payment,
      user: userdatos
    };
  }




  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 1000
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      // Colocar aquí el ID de mi orden
      payment_intent_data: {
        metadata: {
         
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    // return session;
    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    }
  }

  // async stripeWebhook(req: Request, res: Response) {
  //   const sig = req.headers['stripe-signature'];

  //   let event: Stripe.Event;

  //   // Real
  //   const endpointSecret = envs.stripeEndpointSecret;

  //   try {
  //     event = this.stripe.webhooks.constructEvent(
  //       req['rawBody'],
  //       sig,
  //       endpointSecret,
  //     );
  //   } catch (err) {
  //     res.status(400).send(`Webhook Error: ${err.message}`);
  //     return;
  //   }
    
  //   switch( event.type ) {
  //     case 'charge.succeeded': 
  //       const chargeSucceeded = event.data.object;
  //       const payload = {
  //         stripePaymentId: chargeSucceeded.id,
  //         orderId: chargeSucceeded.metadata.orderId,
  //         receiptUrl: chargeSucceeded.receipt_url,
  //       }

  //       // this.logger.log({ payload });
  //       this.client.emit('payment.succeeded', payload );
  //     break;
      
  //     default:
  //       console.log(`Event ${ event.type } not handled`);
  //   }

  //   return res.status(200).json({ sig });
  // }
}

import { Controller, Get,Body, Post, Req, Res, Query, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto:CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto)  {
    return this.paymentsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paymentsService.findOne(id);
  }

  @Get('accomodation/:id')
  findAllPaymentsByAccomodationId(@Param('id') id: string) {
    return this.paymentsService.findAllPaymentsByAccomodationId(id);
  }


  @Post('create-payment-session')
  //@MessagePattern('create.payment.session')
  createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto ) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful'
    }
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancelled'
    }
  }


  // @Post('webhook')
  // async stripeWebhook(@Req() req: Request, @Res() res: Response) {
  //   return this.paymentsService.stripeWebhook(req, res);
  // }




}

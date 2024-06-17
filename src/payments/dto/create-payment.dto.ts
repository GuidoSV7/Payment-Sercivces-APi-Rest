
import { IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {

    @IsString()
    titleOffert: string;

    @IsString()
    paymentDate: string;

    @IsString()
    paymentMethod: string;
    
 
    @IsNumber()
    amount: number;

    @IsString()
    accomodation: string;

    @IsString()
    idUser: string;




}



import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('payments')
export class Payment {
    

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titleOffert: string;

    @Column()
    paymentDate: string;

    @Column()
    paymentMethod: string;
    
    @Column()
    amount: number;
    
    @Column()
    accomodation: string;

    @Column()
    idUser: string;

    
    



}

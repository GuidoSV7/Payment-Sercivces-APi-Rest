

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
  
    // This is the field that will store the user ID from MongoDB
    @Column()
    idUser: string;
    



}

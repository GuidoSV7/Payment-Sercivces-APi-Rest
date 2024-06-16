import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './entities/user.entity';



@Injectable()
export class UsersService {

  
  constructor(
    
    @InjectModel( User.name )
    private readonly userModel: Model<User>,

  ) {}

  async findOne(term: string) {
    
    let user: User;

    if ( !isNaN(+term) ) {
      user = await this.userModel.findOne({ no: term });
    }

    // MongoID
    if ( !user && isValidObjectId( term ) ) {
      user = await this.userModel.findById( term );
    }

    // Name
    if ( !user ) {
      user = await this.userModel.findOne({ name: term.toLowerCase().trim() })
    }


    if ( !user ) 
      throw new NotFoundException(`User with id, name or no "${ term }" not found`);
    

    return user;
  }

}

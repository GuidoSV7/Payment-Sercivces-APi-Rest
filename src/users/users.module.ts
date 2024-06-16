import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name , schema: {UserSchema} }]), // Define User model here
  ],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService if you want to use it in other modules
})
export class UsersModule {}

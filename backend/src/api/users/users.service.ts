import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
      ) {}

    async create(user: User): Promise<User> {
        const userEntity = new UserEntity();

        userEntity.address = user.address;
        userEntity.nonce = user.nonce;
        userEntity.joined = user.joined;
        userEntity.updated_at = user.updated_at;
        userEntity.role = user.role;

        let userCreated = await this.userRepository.save(userEntity);
        return userCreated;
    }


    async findOne(user: User): Promise<User> {
        return await this.userRepository.findOne({where: user});
    }

    async update(id: number, nonce: string): Promise<any>{
        return await this.userRepository.update({id: id},{nonce: nonce});
    }
}

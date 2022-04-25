import { Body, ConflictException, Controller, ForbiddenException, Get, HttpStatus, NotFoundException, Param, Post, Res, HttpException} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { User } from '../users/interfaces/user.interface';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService,
        private usersService: UsersService) { }

    @Post('signin')
    async signIn(@Body() signinUserDto: SigninUserDto): Promise<{token: string}> {
        var checksum = require('eth-checksum')

        const checksumAddress = checksum.encode(signinUserDto.address);
        let user = await this.usersService.findOne({ address: checksumAddress });

        if (!user)
            throw new NotFoundException("No user found");

        if (user) {
            const msg = `Nonce: ${user.nonce}`;
            let signIn = await this.authService.signIn(msg, checksumAddress, signinUserDto.signature);

            if (signIn) {
                var token = await this.authService.createToken(user);
                // Change user nonce
                const newNonce = Math.floor(Math.random() * 1000000).toString();
                await this.usersService.update(user.id, newNonce);
                return {
                    token
                };
            }
        }
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    /**
     * Signup function will create a new user in the db with the primary key being
     * the Ethereum address passed in (if a user with that address doesn't already exist).
     * Will also create a new nonce (random number) to be saved with the user, which will be used
     * as the wallet signature message on the UI.
     * It's important to create the User in the db with a random nonce *before* they sign a message
     * in their wallet, so we can verify the signature is valid in the login function below.
     *
     * Note: will convert the address to its checksum version before creating a new user.
     * https://coincodex.com/article/2078/ethereum-address-checksum-explained/
     * @param req
     * @param address Ethereum address from frontend
     * @returns The newly created User
     */
    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
        var checksum = require('eth-checksum')

        const checksumAddress = checksum.encode(createUserDto.address);
        let user = await this.usersService.findOne({ address: checksumAddress });

        if (!user) {
            user = await this.authService.signUp(createUserDto);
        }
        return user;

    }
}

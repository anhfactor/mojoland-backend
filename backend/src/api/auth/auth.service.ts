import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { ConfigService } from '../../shared/config/config.service';
import { User } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, publicToAddress, toBuffer } from 'ethereumjs-util';

@Injectable()
export class AuthService {
    private saltRounds = 10;

    constructor(private userService: UsersService,
        private config: ConfigService) { }

    async signUp(user: User): Promise<User> {
        user.nonce = await Math.floor(Math.random() * 1000000).toString();

        user.joined = new Date().toISOString();
        user.updated_at = new Date().toISOString();
        user.role = 'user';
        return await this.userService.create(user);
    }

    async signIn(msg: string, address: string, signature: string): Promise<boolean> {
        // Convert msg to hex string
        const msgHex = bufferToHex(Buffer.from(msg));

        // Check if signature is valid
        const msgBuffer = toBuffer(msgHex);
        const msgHash = hashPersonalMessage(msgBuffer);
        const signatureParams = fromRpcSig(signature);
        const publicKey = ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
        const addressBuffer = publicToAddress(publicKey);
        const ethAddress = bufferToHex(addressBuffer);
        if (ethAddress.toLowerCase() === address.toLowerCase()) {
          return true;
        }
        return false;
    }

    async createToken(user: User): Promise<string> {
        const jwtPayload: JwtPayload = { id: user.id, address: user.address, nonce: user.nonce };
        return await jwt.sign(jwtPayload, this.config.environment.secretKey, { expiresIn: "1d" });
    }
}

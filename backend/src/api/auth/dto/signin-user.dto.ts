import { IsNotEmpty } from 'class-validator';

export class SigninUserDto {
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    signature: string;
}
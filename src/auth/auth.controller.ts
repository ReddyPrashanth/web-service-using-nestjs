import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup(@Body(new ValidationPipe({exceptionFactory: (errors) => new BadRequestException(errors)})) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signup(authCredentialsDto);
    }
}

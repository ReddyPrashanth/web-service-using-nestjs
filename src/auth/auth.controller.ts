import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { BadRequestException, Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup(@Body(new ValidationPipe({exceptionFactory: (errors) => new BadRequestException(errors)})) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        this.logger.log(`Signing up user "${authCredentialsDto.username}".`)
        return this.authService.signup(authCredentialsDto);
    }

    @Post('/signin')
    signin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        this.logger.log(`Signing in user "${authCredentialsDto.username}".`);
        return this.authService.signin(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log(user);
    }
}

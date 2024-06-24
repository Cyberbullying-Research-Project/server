import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel : Model<User>,
        private jwtService: JwtService,
    ) {}

    async signUp(singUp: SignUpDto): Promise<{ token: string }> {        
        const { name, email, password} = singUp;

        const hasedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await this.userModel.create({
                name,
                email,
                password: hasedPassword,
            })
            
            const token = await this.jwtService.sign({ id: user._id });                        
            return { token };

        } catch (error) {        
            if(error?.code === 11000) {
                throw new ConflictException('Duplicate Email Entered');
            }
            throw error;
        }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password} = loginDto;
        
        const user = await  this.userModel.findOne({ email });

        if(!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,            
        };
        const token = await this.jwtService.sign(userData);        

        return { token };

    }

}

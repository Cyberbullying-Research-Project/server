import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateResourceDTO{
    @IsNotEmpty()
    @IsString()    
    readonly name: string;

    @IsNotEmpty()
    @IsString()    
    readonly description: string;

    @IsNotEmpty()
    @IsString()    
    readonly path: string;

    @IsNotEmpty()
    @IsString()    
    readonly type: string;

    @IsNotEmpty()
    @IsNumber()
    readonly size: number;

    @IsNotEmpty()
    @IsDate()
    readonly updated_at: Date;    
}


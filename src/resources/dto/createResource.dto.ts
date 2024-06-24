import { IsNotEmpty, IsString, IsEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateResourceDTO{
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

    @IsEmpty({message: 'You cannot specify the creator of the resource'})    
    readonly created_by : string;

    @IsEmpty({message: 'You cannot specify the creation date of the resource'})
    @IsDate()
    readonly created_at: Date;
}


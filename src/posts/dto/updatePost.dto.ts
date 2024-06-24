import {IsNotEmpty, IsString, IsEmpty, IsNumber, IsDate} from 'class-validator';

export class UpdatePostDTO{
    @IsNotEmpty()
    @IsString()    
    readonly title: string;

    @IsNotEmpty()
    @IsString()    
    readonly body: string;

    @IsNotEmpty()
    @IsString()    
    readonly posted_by: string;

    @IsNotEmpty()
    @IsString()    
    readonly status: string;

    @IsNotEmpty()
    @IsDate()
    readonly updated_at: Date;
}
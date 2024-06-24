import { IsNotEmpty, IsString, IsEmpty, IsNumber, IsDate } from 'class-validator';

export class GetPostDTO{
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

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
    @IsDate()
    readonly created_at: Date;

    @IsNotEmpty()
    @IsDate()
    readonly updated_at: Date;
}
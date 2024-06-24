import { IsNotEmpty, IsString, IsEmpty, IsNumber, IsDate } from 'class-validator';

export class CreatePostDTO{
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

    @IsEmpty({message: 'You cannot specify the creation date of the post'})
    @IsDate()
    readonly created_at: Date;

    @IsEmpty({message: 'You cannot specify the resources of the post'})
    readonly resources: string;
}
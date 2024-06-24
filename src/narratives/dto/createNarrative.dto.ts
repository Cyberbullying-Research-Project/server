import { IsNotEmpty, IsString, IsEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateNarrativeDTO{
    @IsNotEmpty()
    @IsString()    
    readonly title: string;

    @IsNotEmpty()
    @IsString()    
    readonly body: string;

    @IsNotEmpty()
    @IsString()    
    readonly created_by: string;

    @IsEmpty({message: 'You cannot specify the creation date of the post'})
    @IsDate()
    readonly created_at: Date;

    @IsEmpty({message: 'You cannot specify the resources of the post'})
    readonly resources: string[];
}
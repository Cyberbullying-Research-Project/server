import { IsNotEmpty, IsString, IsEmpty, IsNumber, IsDate, IsMongoId } from 'class-validator';

export class GetNarrativeDTO{ 
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
    readonly created_by: string;

    @IsNotEmpty()
    @IsDate()
    readonly created_at: Date;

    @IsNotEmpty()
    @IsDate()
    readonly updated_at: Date;
    
    @IsString({ each: true }) // Validates each string in the array
    @IsMongoId({ each: true }) // Validates each string as a MongoDB ID
    readonly resources: string[];

}
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class GetResourceDTO{
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
    readonly created_by : string;
    
    @IsNotEmpty()
    @IsDate()
    readonly updated_at: Date;
}


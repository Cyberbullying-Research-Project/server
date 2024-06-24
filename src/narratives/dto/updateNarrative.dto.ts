import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNarrativeDTO{    
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
    @IsString()
    readonly status: string;
    
    @IsNotEmpty()
    @IsString()
    readonly updated_at: Date;
}
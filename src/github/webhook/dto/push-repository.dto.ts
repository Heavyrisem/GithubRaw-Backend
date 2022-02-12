import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PushRepositoryDto {
    @IsNumber()
    id: number;

    @IsString()
    node_id: string;

    @IsString()
    name: string;

    @IsString()
    full_name: string;

    @IsBoolean()
    private: boolean;
}

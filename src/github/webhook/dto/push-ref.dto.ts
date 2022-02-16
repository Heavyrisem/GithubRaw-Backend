import { IsString } from 'class-validator';

export class PushRefDto {
    @IsString()
    id: string;
}

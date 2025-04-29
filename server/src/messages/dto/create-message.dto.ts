import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    senderId: number;

    @IsNotEmpty()
    @IsInt()
    projectId: number;
}

import { IsDate, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { StatusType } from "../../core/enums.js";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsEnum(StatusType)
    status: StatusType;
    @IsNotEmpty()
    @IsISO8601()
    deadline: string;
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}

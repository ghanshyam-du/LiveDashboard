import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MechanicStatus } from '../../common/enums';

export class GetMechanicsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MechanicStatus)
  status?: MechanicStatus;
}

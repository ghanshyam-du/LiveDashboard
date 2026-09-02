import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../../common/enums';

export class GetBookingsQueryDto {
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
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsMongoId()
  mechanicId?: string;

  @IsOptional()
  @IsMongoId()
  serviceId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'scheduledAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

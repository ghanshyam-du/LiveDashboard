import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../../common/enums';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}

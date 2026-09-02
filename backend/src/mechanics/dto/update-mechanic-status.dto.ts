import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MechanicStatus } from '../../common/enums';

export class UpdateMechanicStatusDto {
  @IsEnum(MechanicStatus)
  status: MechanicStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

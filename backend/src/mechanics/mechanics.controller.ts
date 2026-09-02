import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MechanicsService } from './mechanics.service';
import { GetMechanicsQueryDto } from './dto/get-mechanics-query.dto';
import { UpdateMechanicStatusDto } from './dto/update-mechanic-status.dto';

@ApiTags('Mechanics')
@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Get()
  @ApiOperation({ summary: 'List mechanics with optional filters' })
  findAll(@Query() query: GetMechanicsQueryDto) {
    return this.mechanicsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mechanic detail with recent bookings' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findById(@Param('id') id: string) {
    return this.mechanicsService.getMechanicWithRecentBookings(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update mechanic status' })
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateMechanicStatusDto) {
    return this.mechanicsService.updateStatus(id, updateDto);
  }
}

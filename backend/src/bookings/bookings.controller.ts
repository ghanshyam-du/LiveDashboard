import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bookings with filtering, search, sort and pagination' })
  findAll(@Query() query: GetBookingsQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single booking by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the booking' })
  findById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status — enforces valid state transitions' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the booking' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(id, updateDto);
  }
}

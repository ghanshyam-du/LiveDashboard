import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { GetCustomersQueryDto } from './dto/get-customers-query.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List customers with booking stats' })
  findAll(@Query() query: GetCustomersQueryDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer detail with recent bookings' })
  findById(@Param('id') id: string) {
    return this.customersService.findById(id);
  }
}

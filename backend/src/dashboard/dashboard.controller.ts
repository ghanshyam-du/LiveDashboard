import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get KPI summary cards data' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get chart data for a time period' })
  @ApiQuery({ name: 'period', enum: ['7d', '30d', '90d'], required: false })
  getAnalytics(@Query('period') period?: '7d' | '30d' | '90d') {
    return this.dashboardService.getAnalytics(period ?? '30d');
  }
}

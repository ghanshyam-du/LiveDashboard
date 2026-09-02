import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent notifications' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'isRead', required: false })
  findAll(@Query('limit') limit?: string, @Query('isRead') isRead?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedIsRead = isRead !== undefined ? isRead === 'true' : undefined;
    return this.notificationsService.findAll(parsedLimit, parsedIsRead);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }
}

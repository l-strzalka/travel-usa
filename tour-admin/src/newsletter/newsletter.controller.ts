import {
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  Body,
  Query,
  HttpStatus,
  UseGuards,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { ConfirmedNewsletterDto } from './dto/confirm.newsletter.dto';
import { AdminGuard } from 'src/auth/guards/admin.guards';
import { GetNewsletterQueryDto } from './dto/get-newsletter.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() dto: SubscribeNewsletterDto, @Req() req: Request) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    return this.newsletterService.subscribe(dto, clientIp);
  }

  @Get('confirm')
  async confirm(@Query() dto: ConfirmedNewsletterDto) {
    return this.newsletterService.confirm(dto);
  }

  @UseGuards(AdminGuard)
  @Get()
  async getNewsletter(
    @Query() query: GetNewsletterQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.newsletterService.getAll(query);

    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @UseGuards(AdminGuard)
  @Get('/:id')
  async getNewsletterById(@Param('id', ParseIntPipe) id: number) {
    const newsletter = await this.newsletterService.getById(id);
    if (!newsletter) {
      throw new NotFoundException('Nie znaleziono adresów email');
    }
    return newsletter;
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  @HttpCode(204)
  async removeSubscription(@Param('id', ParseIntPipe) id: number) {
    return this.newsletterService.remove(id);
  }
}

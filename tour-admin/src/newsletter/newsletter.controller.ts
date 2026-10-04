import { Controller, HttpCode, Post, Get, Req, Body, Query, HttpStatus } from "@nestjs/common";
import type { Request } from "express"
import { NewsletterService } from "./newsletter.service";
import { SubscribeNewsletterDto } from "./dto/subscribe-newsletter.dto";
import { ConfirmedNewsletterDto } from "./dto/confirm.newsletter.dto";


@Controller('newsletter')
    export class NewsletterController {
        constructor(private readonly newsletterService: NewsletterService) {}

        @Post('subscribe')
        @HttpCode(HttpStatus.OK)
        async subscribe(
            @Body() dto: SubscribeNewsletterDto,
            @Req() req: Request,
        ){
            const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress
            return this.newsletterService.subscribe(dto, clientIp);
        }

       @Get('confirm')
        async confirm(@Query() dto: ConfirmedNewsletterDto){
            return this.newsletterService.confirm(dto)
        }
    }
)
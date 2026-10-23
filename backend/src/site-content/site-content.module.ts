import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { ContentPage } from './entities/content-page.entity';
import { SiteContentController } from './site-content.controller';
import { SiteContentService } from './site-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContentPage, ContactMessage])],
  controllers: [SiteContentController],
  providers: [SiteContentService],
})
export class SiteContentModule {}

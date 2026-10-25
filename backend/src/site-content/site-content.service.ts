import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sanitizeHtml = require('sanitize-html');
import { Repository } from 'typeorm';
import {
  CreateContentPageDto,
  UpdateContentPageDto,
} from './dto/create-content-page.dto';
import {
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from './dto/create-contact-message.dto';
import { ContactMessage } from './entities/contact-message.entity';
import { ContentPage } from './entities/content-page.entity';

const PAGE_SEEDS = [
  {
    slug: 'about-us',
    title: 'About Us',
    contentHtml: '<h2>Our Purpose</h2><p>We connect devotees with qualified Vedic Pandits for meaningful ceremonies and dependable appointment coordination.</p><p>Our team helps families choose a ceremony, prepare for the ritual, and coordinate with an experienced Pandit.</p>',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    contentHtml: '<h2>Information We Collect</h2><p>We collect details you provide when booking an appointment or contacting our team. Booking details may include your name, gotra, rashi, date and place of birth, appointment location, mobile number, and optional email address.</p><h2>How We Use Information</h2><p>We use these details to manage bookings, prepare ceremony arrangements, coordinate with Pandits, respond to enquiries, and meet legal obligations. We do not publish personal booking details.</p><h2>Your Choices</h2><p>Contact us to ask about or correct information you have submitted.</p>',
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    contentHtml: '<h2>Bookings</h2><p>Appointment requests are subject to availability and confirmation by our team. Ceremony details and package inclusions are shown during booking.</p><h2>Changes and Cancellations</h2><p>Please contact our coordination team to request a change or cancellation. Applicable cancellation windows are provided with your booking.</p><h2>Contact</h2><p>Use the contact form or the support details on this website for assistance.</p>',
  },
];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'a',
    'blockquote',
    'br',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'em',
    's',
    'u',
    'span',
    'div',
    'ul',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

@Injectable()
export class SiteContentService {
  private readonly contactSubmissions = new Map<string, { count: number; resetAt: number }>();

  constructor(
    @InjectRepository(ContentPage)
    private readonly pageRepository: Repository<ContentPage>,
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  private sanitizeContent(contentHtml: string) {
    return sanitizeHtml(contentHtml, SANITIZE_OPTIONS);
  }

  private async ensureSeedPages() {
    for (const seed of PAGE_SEEDS) {
      const existing = await this.pageRepository.findOne({ where: { slug: seed.slug } });
      if (!existing) {
        await this.pageRepository.save(
          this.pageRepository.create({
            ...seed,
            contentHtml: this.sanitizeContent(seed.contentHtml),
            status: 'PUBLISHED',
          }),
        );
      }
    }
  }

  async getPublicPage(slug: string) {
    await this.ensureSeedPages();
    const page = await this.pageRepository.findOne({ where: { slug, status: 'PUBLISHED' } });
    if (!page) throw new NotFoundException('Page not found.');
    return page;
  }

  async getAdminPages() {
    await this.ensureSeedPages();
    return this.pageRepository.find({ order: { title: 'ASC' } });
  }

  async createPage(dto: CreateContentPageDto) {
    const existing = await this.pageRepository.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('A page with this URL slug already exists.');
    return this.pageRepository.save(
      this.pageRepository.create({
        ...dto,
        contentHtml: this.sanitizeContent(dto.contentHtml || ''),
        status: dto.status || 'DRAFT',
      }),
    );
  }

  async updatePage(slug: string, dto: UpdateContentPageDto) {
    const page = await this.pageRepository.findOne({ where: { slug } });
    if (!page) throw new NotFoundException('Page not found.');
    if (dto.title !== undefined) page.title = dto.title;
    if (dto.contentHtml !== undefined) page.contentHtml = this.sanitizeContent(dto.contentHtml);
    if (dto.status !== undefined) page.status = dto.status;
    if (dto.seoTitle !== undefined) page.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) page.seoDescription = dto.seoDescription;
    return this.pageRepository.save(page);
  }

  async deletePage(slug: string) {
    if (PAGE_SEEDS.some((page) => page.slug === slug)) {
      throw new BadRequestException('Default site pages cannot be deleted.');
    }
    const result = await this.pageRepository.delete({ slug });
    if (!result.affected) throw new NotFoundException('Page not found.');
    return { success: true };
  }

  async createContactMessage(dto: CreateContactMessageDto, remoteAddress?: string) {
    if (dto.website?.trim()) {
      throw new BadRequestException('Unable to submit this message.');
    }
    const now = Date.now();
    for (const [address, attempt] of this.contactSubmissions) {
      if (attempt.resetAt <= now) this.contactSubmissions.delete(address);
    }
    const address = remoteAddress || 'unknown';
    const attempt = this.contactSubmissions.get(address);
    if (attempt && attempt.count >= 5 && attempt.resetAt > now) {
      throw new HttpException(
        'Too many messages submitted. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!attempt && this.contactSubmissions.size >= 10000) {
      const oldestAddress = this.contactSubmissions.keys().next().value;
      if (oldestAddress) this.contactSubmissions.delete(oldestAddress);
    }
    this.contactSubmissions.set(
      address,
      attempt && attempt.resetAt > now
        ? { ...attempt, count: attempt.count + 1 }
        : { count: 1, resetAt: now + 10 * 60 * 1000 },
    );
    const { website: _website, ...message } = dto;
    return this.contactRepository.save(this.contactRepository.create(message));
  }

  async getContactMessages() {
    return this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async updateContactMessage(id: string, dto: UpdateContactMessageDto) {
    const record = await this.contactRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Contact message not found.');
    if (dto.status !== undefined) record.status = dto.status;
    if (dto.adminNotes !== undefined) record.adminNotes = dto.adminNotes;
    return this.contactRepository.save(record);
  }
}

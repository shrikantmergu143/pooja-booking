import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LegacyApplication from '../LegacyApplication.tsx';
import { publicEnvironment } from '../../src/config/public-env.ts';

type RouteParams = Promise<{ slug?: string[] }>;

const publicPageMetadata: Record<string, Pick<Metadata, 'title' | 'description'>> = {
  about: {
    title: 'About Our Vedic Service Team',
    description:
      'Learn how Vishnusudarshana Dharmik Sanskar Kendra supports families with Vedic ceremonies and personal guidance.',
  },
  contact: {
    title: 'Contact Our Solapur Team',
    description:
      'Contact Vishnusudarshana Dharmik Sanskar Kendra for help with a pooja, consultation, or appointment request.',
  },
  poojas: {
    title: 'Vedic Poojas and Ceremonies',
    description:
      'Explore Vedic poojas, havans, and family ceremonies with clear service details and planning support.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const firstSegment = slug[0] ?? '';
  const canonical = `/${slug.map(encodeURIComponent).join('/')}`;
  if (
    publicEnvironment.hidePublicCeremonies &&
    ['poojas', 'book', 'track'].includes(firstSegment)
  ) {
    return { title: 'Service unavailable', robots: { index: false, follow: false } };
  }
  if (firstSegment === 'admin') {
    return { title: 'Admin', robots: { index: false, follow: false } };
  }
  if (firstSegment === 'appointment') {
    return {
      title: 'Book an Appointment',
      description:
        'Request a personal consultation or spiritual service with guidance from our team.',
      alternates: { canonical },
    };
  }
  if (firstSegment === 'about-us') {
    return { ...publicPageMetadata.about, alternates: { canonical } };
  }
  if (firstSegment === 'contact') {
    return { ...publicPageMetadata.contact, alternates: { canonical } };
  }
  if (firstSegment === 'poojas') {
    return { ...publicPageMetadata.poojas, alternates: { canonical } };
  }
  if (firstSegment === 'book' || firstSegment === 'track') {
    return { title: 'Booking', robots: { index: false, follow: false } };
  }
  return {
    title: 'Vedic Services and Spiritual Guidance',
    description:
      'Discover Vedic services and thoughtful support for important family occasions.',
    alternates: { canonical },
  };
}

export default async function LegacyRoutePage({ params }: { params: RouteParams }) {
  const { slug = [] } = await params;
  if (
    publicEnvironment.hidePublicCeremonies &&
    ['poojas', 'book', 'track'].includes(slug[0] ?? '')
  ) {
    redirect('/');
  }
  return <LegacyApplication />;
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';

const panditResponsibilities = [
  {
    icon: BookOpen,
    title: 'Prepare according to tradition',
    description:
      'Pandits guide families on the ceremony, the sankalp details to prepare, and the materials needed for the chosen ritual.',
  },
  {
    icon: Sparkles,
    title: 'Conduct the ceremony',
    description:
      'They lead the puja, havan, mantra recitation, and key rites in a clear and respectful manner, following the appropriate Vedic paddhati.',
  },
  {
    icon: HeartHandshake,
    title: 'Guide and include the family',
    description:
      'The pandit explains each step, helps participants take part in the rituals, and offers guidance throughout the ceremony.',
  },
  {
    icon: Award,
    title: 'Bring experience and care',
    description:
      'Our platform shares each pandit’s experience, languages, biography, and specializations so families can understand their background.',
  },
];

export const AboutUsPage: React.FC = () => (
  <div className="bg-[#FAF7F2]">
    <section className="border-b border-[#E7E2DA] bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">About BookMyPooja</span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#7A1C24] mt-3">
          Bringing families and Vedic pandits together
        </h1>
        <p className="text-stone-600 text-base sm:text-lg leading-relaxed mt-5 max-w-3xl">
          We help families arrange meaningful Hindu ceremonies with experienced pandits.
          From choosing a ritual to understanding how it is performed, our aim is to make
          the process welcoming, clear, and rooted in tradition.
        </p>
        <Link
          to="/poojas"
          className="inline-flex mt-7 px-5 py-3 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-sm font-semibold rounded-lg"
        >
          Explore ceremonies
        </Link>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">The role of a pandit</span>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
          More than leading a ritual
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed mt-3">
          A pandit helps a family prepare for and participate in a ceremony, while guiding
          its prayers and traditions. The exact procedure depends on the ritual and family
          customs.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {panditResponsibilities.map(({ icon: Icon, title, description }) => (
          <article key={title} className="bg-white border border-[#E7E2DA] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#7A1C24] flex items-center justify-center mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title text-lg font-bold text-stone-900">{title}</h3>
            <p className="text-sm text-stone-600 leading-relaxed mt-2">{description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-[#210D10] text-stone-200 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <h2 className="font-serif-title text-2xl font-bold text-amber-100">A thoughtful experience for every family</h2>
        <p className="text-sm leading-relaxed text-stone-300 mt-3 max-w-3xl">
          Families can browse ceremony information, review available pandit profiles and
          specializations, and share their preferred arrangements. Our team helps coordinate
          the details so devotees can focus on the occasion and its meaning.
        </p>
        <Link to="/contact" className="inline-block mt-5 text-sm font-semibold text-amber-300 hover:text-amber-100 underline">
          Contact our team
        </Link>
      </div>
    </section>
  </div>
);

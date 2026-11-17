import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Compass,
  MapPin,
} from 'lucide-react';
import { NIGERIAN_ASSETS } from '../assets/imageManifest';
import {
  CompanySettings,
  FAQItem,
  LeadershipMember,
  PublicRoute,
  Testimonial,
} from '../types';
import { LeadershipSection } from './LeadershipSection';

interface AboutPageProps {
  settings: CompanySettings;
  leadership: LeadershipMember[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  onNavigateRoute: (route: PublicRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  leadership,
  faqs,
  testimonials,
  onNavigateRoute,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  return (
    <main className="w-full bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#102F2B] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
            About Us
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {settings.companyName}
          </h1>
          <p className="font-serif-display italic text-lg text-[#D6B779]">
            "{settings.motto}"
          </p>
        </div>
      </section>

      {/* Who We Are & Our Approach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#102F2B]/10 shadow-sm bg-[#F5F3ED]">
              <img
                src={NIGERIAN_ASSETS.estateEntrance}
                alt="King Zion's Estate entrance architectural view"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D5147] bg-[#E9F0EB] px-3 py-1 rounded-md">
                <Building2 className="w-4 h-4" />
                <span>Who We Are</span>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B]">
                Helping Clients Navigate Real Estate With Clarity
              </h2>
              <p className="text-sm sm:text-base text-[#69736D] leading-relaxed">
                {settings.companyName} is a Nigerian real-estate company with its office at {settings.headOffice} We assist buyers, renters, and property seekers exploring houses for sale, residential land plots, short-stay and long-term rentals, and estate development projects in Asaba, Ibusa, and surrounding areas.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F5F3ED] border border-[#102F2B]/10 space-y-3">
              <h3 className="font-serif-display text-xl font-bold text-[#102F2B] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#B58C48]" />
                <span>Our Approach</span>
              </h3>
              <p className="text-sm text-[#69736D] leading-relaxed">
                Guided by our motto — <span className="italic text-[#102F2B] font-medium">"{settings.motto}"</span> — we focus on presenting clear property options, receiving client purchase, rental, and custom property enquiries, and coordinating physical site inspections so every client can review details directly before making decisions.
              </p>
              <ul className="space-y-2 pt-1 text-sm text-[#202824]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
                  <span>Houses, residential plots, rentals, and estate projects presented clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
                  <span>Direct communication from initial enquiry through site inspection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
                  <span>Property-specific documentation disclosure for independent review</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#69736D]">
              <MapPin className="w-4 h-4 text-[#B58C48] shrink-0" />
              <span>Office Location: {settings.headOffice}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CEO & Property Coordinator Parallel Section */}
      <section className="bg-[#F5F3ED] py-14 sm:py-20 border-y border-[#102F2B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B58C48] block mb-1">
              Leadership & Coordination
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-[#102F2B]">
              Leadership & Property Coordination
            </h2>
          </div>

          <LeadershipSection leadership={leadership} />
        </div>
      </section>

      {/* Complete Expandable Frequently Asked Questions */}
      <section id="complete-faqs" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B58C48] block">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#102F2B]">
            Helpful Information for Buyers & Tenants
          </h2>
          <p className="text-sm text-[#69736D]">
            Guidance on houses, land purchases, short-stay and multi-year rentals, inspections, and documentation review.
          </p>
        </div>

        <div className="bg-[#F5F3ED] rounded-2xl border border-[#102F2B]/10 divide-y divide-[#102F2B]/10 px-6 sm:px-8">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="py-5">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D5147] block mb-0.5">
                      {faq.category}
                    </span>
                    <span className="text-base font-semibold text-[#102F2B]">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#102F2B] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#69736D] leading-relaxed pr-6">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigateRoute('contact')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold transition-colors"
          >
            <span>Have Another Question? Contact Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Testimonials Section — Shown ONLY if genuine approved testimonials exist */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-[#E9F0EB] py-14 sm:py-20 border-t border-[#102F2B]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="font-serif-display text-3xl font-bold text-[#102F2B]">
              Client Experiences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl p-6 border border-[#102F2B]/10 shadow-xs space-y-3"
                >
                  <p className="text-sm text-[#202824] leading-relaxed">"{t.content}"</p>
                  <div className="pt-2 border-t border-[#102F2B]/10">
                    <p className="text-sm font-bold text-[#102F2B]">{t.name}</p>
                    <p className="text-xs text-[#69736D]">
                      {t.role} • {t.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

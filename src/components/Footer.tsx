import React from 'react';
import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { CompanySettings, PublicRoute } from '../types';
import { createWhatsAppLink } from '../utils/formatters';

interface FooterProps {
  settings: CompanySettings;
  onNavigateRoute: (route: PublicRoute) => void;
  onOpenLegalModal: (title: string, content: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateRoute,
  onOpenLegalModal,
}) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasPhone = Boolean(settings.officialPhone && settings.officialPhone.trim());
  const hasWhatsapp = Boolean(settings.officialWhatsapp && settings.officialWhatsapp.trim());
  const hasEmail = Boolean(settings.officialEmail && settings.officialEmail.trim());

  const socials = settings.socialLinks || {};
  const verifiedSocials = [
    { name: 'Facebook', url: socials.facebook },
    { name: 'Instagram', url: socials.instagram },
    { name: 'YouTube', url: socials.youtube },
    { name: 'LinkedIn', url: socials.linkedin },
  ].filter((s) => Boolean(s.url && s.url.trim()));

  const whatsappHref = hasWhatsapp
    ? createWhatsAppLink(
        settings.officialWhatsapp,
        "Hello King Zion's Estate, I would like to enquire about your properties."
      )
    : '#';

  return (
    <footer className="bg-[#102F2B] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo variant="dark" showMotto />
            <p className="text-xs sm:text-sm text-[#F5F3ED]/75 leading-relaxed">
              Helping clients explore quality houses for sale, residential land plots, rental properties, and estate development opportunities in Asaba, Ibusa, and across Nigeria.
            </p>
          </div>

          {/* Strict 5 Public Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D6B779]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F3ED]/85">
              <li>
                <button
                  onClick={() => onNavigateRoute('home')}
                  className="hover:text-[#D6B779] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRoute('properties')}
                  className="hover:text-[#D6B779] transition-colors"
                >
                  Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRoute('estate-projects')}
                  className="hover:text-[#D6B779] transition-colors"
                >
                  Estate Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRoute('about')}
                  className="hover:text-[#D6B779] transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRoute('contact')}
                  className="hover:text-[#D6B779] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Contact Column */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D6B779]">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-[#F5F3ED]/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6B779] shrink-0 mt-0.5" />
                <span>{settings.headOffice}</span>
              </li>

              {hasPhone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D6B779] shrink-0" />
                  <a
                    href={`tel:${settings.officialPhone.replace(/\s+/g, '')}`}
                    className="hover:text-[#D6B779] transition-colors"
                  >
                    {settings.officialPhone}
                  </a>
                </li>
              )}

              {hasWhatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#D6B779] shrink-0" />
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#D6B779] transition-colors"
                  >
                    WhatsApp: {settings.officialWhatsapp}
                  </a>
                </li>
              )}

              {hasEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D6B779] shrink-0" />
                  <a
                    href={`mailto:${settings.officialEmail}`}
                    className="hover:text-[#D6B779] transition-colors"
                  >
                    {settings.officialEmail}
                  </a>
                </li>
              )}

              {!hasPhone && !hasWhatsapp && !hasEmail && (
                <li className="pt-1">
                  <button
                    onClick={() => onNavigateRoute('contact')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#D6B779] hover:underline"
                  >
                    Submit an online enquiry via our Contact page →
                  </button>
                </li>
              )}
            </ul>

            {verifiedSocials.length > 0 && (
              <div className="pt-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#D6B779] mb-2">
                  Official Channels
                </span>
                <div className="flex flex-wrap gap-3">
                  {verifiedSocials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#B58C48] text-white transition-colors"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#F5F3ED]/65">
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() =>
                onOpenLegalModal(
                  'Privacy Policy',
                  "KING ZION'S ESTATE respects your privacy. Personal details submitted through our enquiry and inspection forms are used solely to respond to your property requests and coordinate inspections. We do not sell or disclose customer information to unauthorised third parties."
                )
              }
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() =>
                onOpenLegalModal(
                  'Terms of Use',
                  "Property listings, indicative ranges, and estate descriptions on this website are provided for general information. Pricing, availability, and property documentation are confirmed directly for each specific property prior to any transaction."
                )
              }
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </button>
            <button
              onClick={() =>
                onOpenLegalModal(
                  'Property Disclaimer',
                  "Some visual images presented across property galleries are illustrative architectural visuals and do not constitute an offer of specific availability. Title documents, survey plans, dimensions, and pricing must be confirmed for each specific property prior to purchase or tenancy."
                )
              }
              className="hover:text-white transition-colors"
            >
              Property Disclaimer
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span>© {currentYear} King Zion's Estate. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B58C48] text-white flex items-center justify-center transition-colors"
              aria-label="Scroll to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

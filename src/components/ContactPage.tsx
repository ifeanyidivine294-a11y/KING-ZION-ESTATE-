import React from 'react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  CompanySettings,
  EnquiryFormType,
  InspectionRequest,
  Property,
  PropertyEnquiry,
  PurchaseEnquiry,
} from '../types';
import { createWhatsAppLink } from '../utils/formatters';
import { CentralEnquiryForm } from './CentralEnquiryForm';

interface ContactPageProps {
  settings: CompanySettings;
  properties: Property[];
  initialEnquiryType: EnquiryFormType;
  initialProperty?: Property | null;
  initialProject?: string;
  onSaveInspection: (req: InspectionRequest) => Promise<void> | void;
  onSavePurchase: (req: PurchaseEnquiry) => Promise<void> | void;
  onSaveGeneralEnquiry: (req: PropertyEnquiry) => Promise<void> | void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  settings,
  properties,
  initialEnquiryType,
  initialProperty,
  initialProject,
  onSaveInspection,
  onSavePurchase,
  onSaveGeneralEnquiry,
}) => {
  const hasPhone = Boolean(settings.officialPhone && settings.officialPhone.trim());
  const hasWhatsapp = Boolean(settings.officialWhatsapp && settings.officialWhatsapp.trim());
  const hasEmail = Boolean(settings.officialEmail && settings.officialEmail.trim());

  const whatsappHref = hasWhatsapp
    ? createWhatsAppLink(
        settings.officialWhatsapp,
        "Hello King Zion's Estate, I would like to make an enquiry."
      )
    : '#';

  return (
    <main className="w-full bg-[#F5F3ED]/60 min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#102F2B] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
            Contact & Enquiries
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Speak With Our Team
          </h1>
          <p className="text-sm sm:text-base text-[#F5F3ED]/85 leading-relaxed">
            Choose the enquiry option that matches your needs — Inspection Request, Purchase Enquiry, Rental Enquiry, or Custom Property Request.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Verified Contact Details Column */}
          <aside className="lg:col-span-4 bg-[#102F2B] text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block mb-1">
                Office & Channels
              </span>
              <h2 className="font-serif-display text-2xl font-bold text-white">
                {settings.companyName}
              </h2>
              <p className="text-xs italic text-[#D6B779] mt-1 font-serif-display">
                "{settings.motto}"
              </p>
            </div>

            <div className="space-y-4 text-sm text-[#F5F3ED]/90 pt-2 border-t border-white/15">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D6B779] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
                    Office Address
                  </span>
                  <p className="mt-0.5 leading-relaxed">{settings.headOffice}</p>
                </div>
              </div>

              {hasPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D6B779] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
                      Phone
                    </span>
                    <a
                      href={`tel:${settings.officialPhone.replace(/\s+/g, '')}`}
                      className="mt-0.5 inline-block hover:text-[#D6B779] underline-offset-4 hover:underline"
                    >
                      {settings.officialPhone}
                    </a>
                  </div>
                </div>
              )}

              {hasWhatsapp && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-[#D6B779] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
                      WhatsApp
                    </span>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block hover:text-[#D6B779] underline-offset-4 hover:underline"
                    >
                      {settings.officialWhatsapp}
                    </a>
                  </div>
                </div>
              )}

              {hasEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#D6B779] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
                      Email
                    </span>
                    <a
                      href={`mailto:${settings.officialEmail}`}
                      className="mt-0.5 inline-block hover:text-[#D6B779] underline-offset-4 hover:underline"
                    >
                      {settings.officialEmail}
                    </a>
                  </div>
                </div>
              )}

              {!hasPhone && !hasWhatsapp && !hasEmail && (
                <p className="text-xs text-[#F5F3ED]/75 leading-relaxed pt-2">
                  Use the central enquiry form alongside to submit inspection, purchase, rental, or custom property requests directly to our team.
                </p>
              )}
            </div>
          </aside>

          {/* One Central Dynamic Enquiry Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#102F2B]/10 p-6 sm:p-8 shadow-xs">
            <CentralEnquiryForm
              initialType={initialEnquiryType}
              initialProperty={initialProperty}
              initialProject={initialProject}
              properties={properties}
              locations={settings.locations}
              onSaveInspection={onSaveInspection}
              onSavePurchase={onSavePurchase}
              onSaveGeneralEnquiry={onSaveGeneralEnquiry}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

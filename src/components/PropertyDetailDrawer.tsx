import React, { useEffect, useState } from 'react';
import {
  Bed,
  Bath,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck2,
  Heart,
  MapPin,
  Maximize,
  MessageCircle,
  Send,
  ShieldCheck,
  X,
  Check,
} from 'lucide-react';
import { Property } from '../types';
import { createWhatsAppLink, formatNaira } from '../utils/formatters';

interface PropertyDetailDrawerProps {
  property: Property | null;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onRequestInspection: (property: Property) => void;
  onEnquireProperty: (property: Property) => void;
  officialWhatsapp?: string;
}

export const PropertyDetailDrawer: React.FC<PropertyDetailDrawerProps> = ({
  property,
  onClose,
  isFavourite,
  onToggleFavourite,
  onRequestInspection,
  onEnquireProperty,
  officialWhatsapp,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  useEffect(() => {
    if (!property) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [property, onClose]);

  if (!property) return null;

  const images =
    property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];
  const activeImage = images[activeImageIndex] || property.image;

  const formattedPrice = (() => {
    const base = property.priceText || formatNaira(property.priceNumeric);
    if (
      property.intent === 'Rent' &&
      property.billingPeriod &&
      !base.toLowerCase().includes('per ') &&
      !base.toLowerCase().includes('/') &&
      base.toLowerCase() !== 'price on enquiry'
    ) {
      return `${base} ${property.billingPeriod}`;
    }
    return base;
  })();

  const hasWhatsapp = Boolean(officialWhatsapp && officialWhatsapp.trim());
  const whatsappUrl = hasWhatsapp
    ? createWhatsAppLink(
        officialWhatsapp!,
        `Hello King Zion's Estate, I would like to enquire about "${property.title}" (${property.referenceId}) in ${property.location}.`
      )
    : '';

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-drawer-title"
    >
      {/* Backdrop click closes */}
      <div className="flex-1 hidden sm:block" onClick={onClose} />

      {/* Desktop Right-Side Panel / Mobile Full-Height Sheet */}
      <div className="relative w-full sm:max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Top Sticky Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#102F2B] text-white flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#D6B779] font-medium">
              <span className="font-mono font-bold">{property.referenceId}</span>
              <span>•</span>
              <span>{property.status}</span>
            </div>
            <h2
              id="property-drawer-title"
              className="font-serif-display text-lg sm:text-xl font-bold text-white truncate mt-0.5"
            >
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavourite(property.id)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={isFavourite ? 'Remove from saved properties' : 'Save property'}
              title={isFavourite ? 'Saved' : 'Save property'}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavourite ? 'fill-[#D6B779] text-[#D6B779]' : 'stroke-current'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close property details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#FFFFFF]">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative w-full aspect-[4/3] bg-[#F5F3ED] rounded-xl overflow-hidden border border-[#102F2B]/10">
              <img
                src={activeImage}
                alt={property.title}
                className="w-full h-full object-cover object-center block"
              />
              <div className="absolute top-3 left-3 bg-[#102F2B]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs">
                {property.status}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#102F2B] flex items-center justify-center shadow-md transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#102F2B] flex items-center justify-center shadow-md transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/65 text-white text-xs px-2.5 py-1 rounded-md tabular-nums-naira">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-15 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#B58C48] shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${property.title} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price & Location Summary */}
          <div className="p-5 rounded-xl bg-[#F5F3ED] border border-[#102F2B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69736D] block">
                {property.intent === 'Rent' ? 'Rental Rate' : 'Asking Price / Valuation'}
              </span>
              <p className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B] mt-0.5 tabular-nums-naira">
                {formattedPrice}
              </p>
              {property.rentalCategory && (
                <span className="text-xs text-[#1D5147] font-medium block mt-1">
                  {property.rentalCategory}
                  {property.minimumDuration ? ` • Minimum: ${property.minimumDuration}` : ''}
                </span>
              )}
            </div>

            <div className="space-y-1 sm:text-right text-sm text-[#202824]">
              <div className="flex items-center sm:justify-end gap-1.5 font-semibold">
                <MapPin className="w-4 h-4 text-[#B58C48] shrink-0" />
                <span>{property.location}</span>
              </div>
              <p className="text-xs text-[#69736D]">Type: {property.propertyType}</p>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="p-3.5 rounded-lg border border-[#102F2B]/10 bg-[#FFFFFF]">
                <div className="flex items-center gap-2 text-xs text-[#69736D] mb-1">
                  <Bed className="w-4 h-4 text-[#1D5147]" />
                  <span>Bedrooms</span>
                </div>
                <p className="text-sm font-bold text-[#202824]">{property.bedrooms} Bedrooms</p>
              </div>
            )}

            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="p-3.5 rounded-lg border border-[#102F2B]/10 bg-[#FFFFFF]">
                <div className="flex items-center gap-2 text-xs text-[#69736D] mb-1">
                  <Bath className="w-4 h-4 text-[#1D5147]" />
                  <span>Bathrooms</span>
                </div>
                <p className="text-sm font-bold text-[#202824]">{property.bathrooms} Bathrooms</p>
              </div>
            )}

            {property.plotSize && (
              <div className="p-3.5 rounded-lg border border-[#102F2B]/10 bg-[#FFFFFF]">
                <div className="flex items-center gap-2 text-xs text-[#69736D] mb-1">
                  <Maximize className="w-4 h-4 text-[#1D5147]" />
                  <span>Plot Size</span>
                </div>
                <p className="text-sm font-bold text-[#202824]">{property.plotSize}</p>
              </div>
            )}

            {property.buildingSize && (
              <div className="p-3.5 rounded-lg border border-[#102F2B]/10 bg-[#FFFFFF]">
                <div className="flex items-center gap-2 text-xs text-[#69736D] mb-1">
                  <Maximize className="w-4 h-4 text-[#1D5147]" />
                  <span>Floor Area</span>
                </div>
                <p className="text-sm font-bold text-[#202824]">{property.buildingSize}</p>
              </div>
            )}

            {property.minimumDuration && (
              <div className="p-3.5 rounded-lg border border-[#102F2B]/10 bg-[#FFFFFF]">
                <div className="flex items-center gap-2 text-xs text-[#69736D] mb-1">
                  <Clock className="w-4 h-4 text-[#1D5147]" />
                  <span>Minimum Period</span>
                </div>
                <p className="text-sm font-bold text-[#202824]">{property.minimumDuration}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
              Property Overview
            </h3>
            <p className="text-sm text-[#69736D] leading-relaxed">{property.description}</p>
          </div>

          {/* Supported Rental Durations if applicable */}
          {property.supportedDurations && property.supportedDurations.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif-display text-base font-bold text-[#102F2B]">
                Rental Duration Options (Subject to Availability)
              </h3>
              <p className="text-sm text-[#69736D]">
                {property.supportedDurations.join(' • ')}
              </p>
            </div>
          )}

          {/* Available Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                Recorded Property Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#202824]">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentation Info */}
          <div className="p-4 rounded-xl bg-[#E9F0EB] border border-[#102F2B]/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#102F2B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F2B] flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                <span>Documentation Information</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#202824]">
                {property.documentStatus || 'Documentation details confirmed upon formal enquiry.'}
              </p>
              <p className="text-xs text-[#69736D]">
                Property documents vary by property and should be reviewed and verified for this specific listing before any commitment.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#F5F3ED] border-t border-[#102F2B]/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {hasWhatsapp ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#102F2B] text-[#102F2B] hover:bg-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <span className="text-xs text-[#69736D]">Ref: {property.referenceId}</span>
          )}

          <div className="flex flex-wrap items-center gap-2.5 ml-auto">
            {property.inspectionAvailable && (
              <button
                onClick={() => onRequestInspection(property)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#102F2B] text-[#102F2B] bg-white hover:bg-[#E9F0EB] text-xs sm:text-sm font-semibold transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Inspection</span>
              </button>
            )}

            <button
              onClick={() => onEnquireProperty(property)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{property.intent === 'Rent' ? 'Rental Enquiry' : 'Enquire'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

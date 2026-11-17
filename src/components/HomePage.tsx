import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bed,
  Bath,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Home as HomeIcon,
  KeyRound,
  MapPin,
  Maximize,
  Pause,
  Play,
} from 'lucide-react';
import { NIGERIAN_ASSETS } from '../assets/imageManifest';
import {
  CompanySettings,
  FAQItem,
  LeadershipMember,
  PropertiesTab,
  Property,
  PublicRoute,
} from '../types';
import { formatNaira } from '../utils/formatters';
import { LeadershipSection } from './LeadershipSection';

interface HomePageProps {
  properties: Property[];
  settings: CompanySettings;
  leadership: LeadershipMember[];
  faqs: FAQItem[];
  favourites: string[];
  onToggleFavourite: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenPropertiesTab: (tab: PropertiesTab) => void;
  onNavigateRoute: (route: PublicRoute) => void;
  onRequestInspection: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  settings,
  leadership,
  faqs,
  favourites,
  onToggleFavourite,
  onSelectProperty,
  onOpenPropertiesTab,
  onNavigateRoute,
  onRequestInspection,
}) => {
  // Featured Slideshow State (8s autoplay, 1s crossfade, reduced-motion aware)
  const featuredListings = properties.filter(
    (p) => p.published && p.featured && p.status !== 'Sold'
  );
  const totalSlides = featuredListings.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (totalSlides > 0 ? (prev + 1) % totalSlides : 0));
  }, [totalSlides]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      totalSlides > 0 ? (prev === 0 ? totalSlides - 1 : prev - 1) : 0
    );
  }, [totalSlides]);

  useEffect(() => {
    if (currentSlide >= totalSlides && totalSlides > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, totalSlides]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || isPausedByUser || isHovering || totalSlides <= 1) {
      clearTimer();
      return;
    }

    clearTimer();
    timerRef.current = setInterval(() => {
      handleNextSlide();
    }, 8000);

    return () => clearTimer();
  }, [isPausedByUser, isHovering, totalSlides, handleNextSlide, currentSlide]);

  // Dynamic Real Counts for Category Showcase Cards (§5B)
  const publishedAvailable = properties.filter((p) => p.published && p.status !== 'Sold');

  const housesCount = publishedAvailable.filter(
    (p) =>
      p.intent === 'Buy' &&
      (p.priceNumeric === undefined || p.priceNumeric >= 30_000_000)
  ).length;

  const landCount = publishedAvailable.filter(
    (p) =>
      p.intent === 'Land' &&
      (p.priceNumeric === undefined || p.priceNumeric >= 5_000_000)
  ).length;

  const rentalsCount = publishedAvailable.filter(
    (p) => p.intent === 'Rent'
  ).length;

  const categoryCards = [
    {
      tab: 'houses' as PropertiesTab,
      title: 'Houses for Sale',
      description: 'Explore modern homes, spacious duplexes, and residential properties.',
      image: NIGERIAN_ASSETS.housesDuplex,
      alt: 'Modern Nigerian detached duplex exterior',
      indicativeRange: '₦30 million – ₦500 million and above',
      count: housesCount,
      ctaLabel: 'Explore Houses',
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      tab: 'land' as PropertiesTab,
      title: 'Land for Sale',
      description: 'Discover dry residential plots and surveyed land opportunities.',
      image: NIGERIAN_ASSETS.landCategory,
      alt: 'Dry Nigerian residential land parcel with boundary lines',
      indicativeRange: '₦5 million – ₦100 million and above',
      count: landCount,
      ctaLabel: 'Explore Land',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      tab: 'rentals' as PropertiesTab,
      title: 'Find a Home to Rent',
      description: 'Browse short-stay serviced stays and long-term rental homes.',
      image: NIGERIAN_ASSETS.rentalInterior,
      alt: 'Modern Nigerian serviced apartment interior',
      indicativeRange: '₦500,000 – ₦15 million and above',
      count: rentalsCount,
      ctaLabel: 'Explore Rentals',
      icon: <KeyRound className="w-5 h-5" />,
    },
  ];

  const previewGalleryCategories = [
    {
      tab: 'houses' as PropertiesTab,
      title: 'Houses',
      subtitle: 'Detached, Semi-Detached & Bungalows',
      image: NIGERIAN_ASSETS.semiDetached,
      alt: 'Modern Nigerian semi-detached duplex visual',
    },
    {
      tab: 'land' as PropertiesTab,
      title: 'Land',
      subtitle: 'Surveyed Plots & Estate Parcels',
      image: NIGERIAN_ASSETS.surveyPegsLand,
      alt: 'Nigerian residential land plot with concrete survey boundary pillars',
    },
    {
      tab: 'rentals' as PropertiesTab,
      title: 'Rental Apartments',
      subtitle: 'Short-Stay & Multi-Year Options',
      image: NIGERIAN_ASSETS.apartmentBedroom,
      alt: 'Contemporary Nigerian residential apartment bedroom interior',
    },
  ];

  const whyChoosePoints = [
    'Property options across houses, land, and rentals for varied needs',
    'Direct, transparent property enquiry and guidance from our team',
    'Coordinated physical site inspection request support',
    'Clear presentation of estate development project inventory',
  ];

  const formatPropertyPrice = (prop: Property) => {
    const base = prop.priceText || formatNaira(prop.priceNumeric);
    if (
      prop.intent === 'Rent' &&
      prop.billingPeriod &&
      !base.toLowerCase().includes('per ') &&
      !base.toLowerCase().includes('/') &&
      base.toLowerCase() !== 'price on enquiry'
    ) {
      return `${base} ${prop.billingPeriod}`;
    }
    return base;
  };

  const previewFaqs = faqs.slice(0, 4);

  return (
    <main className="w-full flex flex-col">
      {/* SECTION A: HERO (No Search Box on Homepage) */}
      <section className="relative w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] flex items-center bg-[#102F2B] overflow-hidden">
        <img
          src={NIGERIAN_ASSETS.heroDuplex}
          alt="Modern Nigerian luxury detached residential duplex"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#102F2B]/90 via-[#102F2B]/70 to-[#102F2B]/25"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl space-y-5">
            <p className="inline-block text-xs sm:text-sm font-medium tracking-wide text-[#D6B779] bg-[#102F2B]/80 border border-[#D6B779]/35 px-3.5 py-1.5 rounded-md">
              {settings.motto}
            </p>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
              Find Your Place.{' '}
              <span className="text-[#D6B779] block sm:inline">Build Your Future.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#F5F3ED]/90 leading-relaxed max-w-xl">
              Explore houses for sale, residential land opportunities, and rental homes across Asaba, Ibusa, and Nigerian residential corridors.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onNavigateRoute('properties')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white font-semibold text-sm sm:text-base shadow-md transition-colors"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestInspection}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#102F2B]/80 hover:bg-[#1D5147] text-white border border-[#D6B779]/60 font-semibold text-sm sm:text-base transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#D6B779]" />
                <span>Request an Inspection</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: THREE PROPERTY CATEGORY SHOWCASE CARDS */}
      <section className="w-full bg-[#FFFFFF] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#102F2B]">
              Find Your Next Property
            </h2>
            <p className="text-sm sm:text-base text-[#69736D] mt-2.5 leading-relaxed">
              From modern family homes to surveyed land opportunities and rental residences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categoryCards.map((card) => (
              <div
                key={card.tab}
                className="bg-[#F5F3ED] rounded-xl border border-[#102F2B]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-[#E9F0EB] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-[#102F2B] text-[#D6B779] flex items-center justify-center shadow-md">
                    {card.icon}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3 className="font-serif-display text-2xl font-bold text-[#102F2B]">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#69736D] leading-relaxed">{card.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#102F2B]/10">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#69736D] block">
                        Indicative Price Range (Confirm Current Price)
                      </span>
                      <p className="text-sm font-bold text-[#102F2B] tabular-nums-naira mt-0.5">
                        {card.indicativeRange}
                      </p>
                      <p className="text-xs font-medium text-[#1D5147] mt-1">
                        {card.count > 0
                          ? `${card.count} Published ${card.count === 1 ? 'Listing' : 'Listings'}`
                          : 'Enquire for current availability'}
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenPropertiesTab(card.tab)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold transition-colors"
                    >
                      <span>{card.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C: FEATURED PROPERTY OPPORTUNITIES (1-CARD CROSSFADE SLIDESHOW) */}
      <section className="w-full bg-[#102F2B] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block mb-1">
                Featured Listings
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white">
                Featured Property Opportunities
              </h2>
              <p className="text-sm sm:text-base text-[#F5F3ED]/80 mt-2">
                Browse selected published listings currently recorded in our inventory.
              </p>
            </div>

            {totalSlides > 1 && (
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsPausedByUser((p) => !p)}
                  className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5F3ED] transition-colors"
                  aria-label={isPausedByUser ? 'Resume slideshow' : 'Pause slideshow'}
                  title={isPausedByUser ? 'Play autoplay (8s)' : 'Pause autoplay'}
                >
                  {isPausedByUser ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={handlePrevSlide}
                  className="p-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white transition-colors"
                  aria-label="Previous featured property"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="p-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white transition-colors"
                  aria-label="Next featured property"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {totalSlides === 0 ? (
            <div className="bg-white/10 border border-white/15 rounded-2xl p-8 text-center space-y-3">
              <p className="font-serif-display text-xl text-white font-semibold">
                Featured Listings Editorial Notice
              </p>
              <p className="text-sm text-[#F5F3ED]/80 max-w-xl mx-auto">
                No featured listings are currently marked as available. Visit the Properties page or contact our team directly to enquire about upcoming availability.
              </p>
              <button
                onClick={() => onNavigateRoute('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold transition-colors"
              >
                <span>Enquire Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="max-w-5xl mx-auto"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onTouchStart={() => setIsHovering(true)}
              onTouchEnd={() => setIsHovering(false)}
            >
              <div className="slideshow-viewport rounded-2xl bg-white text-[#202824] shadow-xl">
                {featuredListings.map((property, idx) => {
                  const isActive = currentSlide === idx;
                  const isFav = favourites.includes(property.id);

                  return (
                    <div
                      key={property.id}
                      aria-hidden={!isActive}
                      className={`property-slide ${isActive ? 'is-active' : ''}`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                        {/* Image Half — 4:3 clean crop preserving key architectural lines */}
                        <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:min-h-[360px] bg-[#F5F3ED] overflow-hidden">
                          <img
                            src={property.image}
                            alt={property.title}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute top-3.5 left-3.5 bg-[#102F2B]/90 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-xs">
                            {property.status}
                          </div>
                          <button
                            onClick={() => onToggleFavourite(property.id)}
                            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/95 text-[#102F2B] hover:scale-105 transition-transform shadow-sm"
                            aria-label={isFav ? 'Remove from saved' : 'Save property'}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav ? 'fill-[#B58C48] text-[#B58C48]' : 'stroke-current'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Details Half */}
                        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-[#1D5147] bg-[#E9F0EB] px-2.5 py-1 rounded-md">
                                {property.propertyType}
                              </span>
                              <span className="text-xs font-mono text-[#69736D]">
                                {property.referenceId}
                              </span>
                            </div>

                            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B] leading-snug">
                              {property.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-[#69736D]">
                              <MapPin className="w-4 h-4 text-[#B58C48] shrink-0" />
                              <span>{property.location}</span>
                            </div>

                            <p className="text-xl sm:text-2xl font-bold text-[#102F2B] tabular-nums-naira pt-1">
                              {formatPropertyPrice(property)}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#202824] pt-1">
                              {property.bedrooms !== undefined && property.bedrooms > 0 && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Bed className="w-4 h-4 text-[#1D5147]" />
                                  {property.bedrooms} Beds
                                </span>
                              )}
                              {property.bathrooms !== undefined && property.bathrooms > 0 && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Bath className="w-4 h-4 text-[#1D5147]" />
                                  {property.bathrooms} Baths
                                </span>
                              )}
                              {property.plotSize && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Maximize className="w-4 h-4 text-[#1D5147]" />
                                  {property.plotSize}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-[#69736D] line-clamp-2 leading-relaxed">
                              {property.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[#102F2B]/10 flex items-center justify-between gap-4">
                            <button
                              onClick={() => onSelectProperty(property)}
                              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-sm font-semibold transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>

                            <span className="text-xs text-[#69736D] tabular-nums-naira">
                              {idx + 1} / {totalSlides}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Synchronized Slide Dots */}
              {totalSlides > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {featuredListings.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx
                          ? 'w-7 bg-[#D6B779]'
                          : 'w-2.5 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`View featured listing ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION D & F: WHO WE ARE & WHY CHOOSE US (WARM IVORY BAND) */}
      <section className="w-full bg-[#F5F3ED] py-14 sm:py-20 border-b border-[#102F2B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Image Column */}
            <div className="lg:col-span-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#102F2B]/10 shadow-sm bg-[#E9F0EB]">
                <img
                  src={NIGERIAN_ASSETS.estateEntrance}
                  alt="Modern gated estate entrance in Nigeria"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Who We Are Column */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-serif-display text-3xl font-bold text-[#102F2B]">
                About King Zion's Estate
              </h2>
              <p className="text-sm font-serif-display italic text-[#1D5147]">
                "{settings.motto}"
              </p>
              <p className="text-sm sm:text-base text-[#69736D] leading-relaxed">
                We help prospective homeowners, tenants, and property buyers explore residential houses, surveyed land opportunities, and rental options across Asaba, Ibusa, and other Nigerian locations.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onNavigateRoute('about')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-sm font-semibold transition-colors"
                >
                  <span>Discover Our Company</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Why Choose Us Column */}
            <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-[#102F2B]/10 shadow-xs space-y-4">
              <h3 className="font-serif-display text-xl font-bold text-[#102F2B] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#B58C48]" />
                <span>Why Choose Us?</span>
              </h3>
              <ul className="space-y-3">
                {whyChoosePoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#202824]">
                    <CheckCircle2 className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: PROPERTY GALLERY PREVIEW (WHITE BAND) */}
      <section className="w-full bg-[#FFFFFF] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#102F2B]">
              Our Property Gallery
            </h2>
            <p className="text-sm sm:text-base text-[#69736D] mt-2">
              Illustrative architectural views across houses, land, and rental apartment styles. Select a category to browse on the Properties page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewGalleryCategories.map((item) => (
              <button
                key={item.tab}
                onClick={() => onOpenPropertiesTab(item.tab)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#102F2B]/10 shadow-xs text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B58C48]"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#102F2B]/90 via-[#102F2B]/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif-display text-xl font-bold">{item.title}</h3>
                  <p className="text-xs text-[#F5F3ED]/85 mt-0.5">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G & H: LEADERSHIP PREVIEW & FAQ PREVIEW (WARM IVORY BAND) */}
      <section className="w-full bg-[#F5F3ED] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Leadership Preview */}
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B58C48] block mb-1">
                Leadership & Coordination
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B]">
                Meet Our Team
              </h2>
            </div>
            <LeadershipSection leadership={leadership} compact />
          </div>

          {/* FAQ Preview Box */}
          <div className="bg-white rounded-2xl border border-[#102F2B]/10 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B]">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-[#69736D] mt-1">
                  Quick answers on property enquiries, inspections, rentals, and documentation review.
                </p>
              </div>
              <button
                onClick={() => onNavigateRoute('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-sm font-semibold transition-colors shrink-0 self-start sm:self-auto"
              >
                <span>View More FAQs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#102F2B]/10">
              {previewFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-3.5">
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-4 text-left py-1 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-semibold text-[#202824]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#1D5147] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-sm text-[#69736D] leading-relaxed pr-6">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

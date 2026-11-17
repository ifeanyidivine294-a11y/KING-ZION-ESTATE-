import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bath,
  Bed,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Home,
  KeyRound,
  MapPin,
  Maximize,
  Search,
  Send,
  X,
} from 'lucide-react';
import { ILLUSTRATIVE_GALLERY_VISUALS } from '../assets/imageManifest';
import {
  EnquiryFormType,
  PropertiesTab,
  Property,
  RentalCategory,
} from '../types';
import { formatNaira } from '../utils/formatters';

interface PropertiesPageProps {
  properties: Property[];
  activeTab: PropertiesTab;
  onChangeTab: (tab: PropertiesTab) => void;
  favourites: string[];
  onToggleFavourite: (id: string) => void;
  onViewDetails: (property: Property) => void;
  onOpenEnquiry: (
    type: EnquiryFormType,
    property?: Property | null,
    category?: string
  ) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  activeTab,
  onChangeTab,
  favourites,
  onToggleFavourite,
  onViewDetails,
  onOpenEnquiry,
}) => {
  // Houses Filters
  const [houseLocation, setHouseLocation] = useState('All');
  const [houseType, setHouseType] = useState('All');
  const [houseBedrooms, setHouseBedrooms] = useState('All');
  const [houseAvailability, setHouseAvailability] = useState('All');
  const [houseBudget, setHouseBudget] = useState('All');

  // Land Filters
  const [landLocation, setLandLocation] = useState('All');
  const [landPlotSize, setLandPlotSize] = useState('All');
  const [landBudget, setLandBudget] = useState('All');
  const [landDocFilter, setLandDocFilter] = useState('All');

  // Rentals Subcategory & Period Selector
  const [rentalSubcategory, setRentalSubcategory] = useState<'All' | RentalCategory>('All');
  const [selectedRentalPeriod, setSelectedRentalPeriod] = useState('All');
  const [rentalLocation, setRentalLocation] = useState('All');

  // Comprehensive Gallery State & Lightbox
  const [galleryTab, setGalleryTab] = useState<'houses' | 'land' | 'rentals'>(activeTab);
  const [lightboxItem, setLightboxItem] = useState<{
    images: string[];
    index: number;
    title: string;
    caption: string;
    isIllustrative: boolean;
    linkedProperty?: Property;
  } | null>(null);

  const publishedProperties = useMemo(
    () => properties.filter((p) => p.published),
    [properties]
  );

  // Sync gallery category tab whenever main tab changes
  const handleSelectMainTab = (tab: PropertiesTab) => {
    onChangeTab(tab);
    setGalleryTab(tab);
  };

  // Filtered Houses
  const housesListings = useMemo(() => {
    return publishedProperties
      .filter((p) => p.intent === 'Buy')
      .filter((p) => {
        if (houseLocation !== 'All' && !p.location.toLowerCase().includes(houseLocation.toLowerCase())) {
          return false;
        }
        if (houseType !== 'All' && p.propertyType !== houseType) {
          return false;
        }
        if (houseBedrooms !== 'All') {
          const minBeds = Number(houseBedrooms);
          if (!p.bedrooms || p.bedrooms < minBeds) return false;
        }
        if (houseAvailability !== 'All' && p.status !== houseAvailability) {
          return false;
        }
        if (houseBudget !== 'All' && p.priceNumeric) {
          if (houseBudget === 'under-80m' && p.priceNumeric >= 80_000_000) return false;
          if (houseBudget === '80m-150m' && (p.priceNumeric < 80_000_000 || p.priceNumeric > 150_000_000)) return false;
          if (houseBudget === 'above-150m' && p.priceNumeric <= 150_000_000) return false;
        }
        return true;
      });
  }, [publishedProperties, houseLocation, houseType, houseBedrooms, houseAvailability, houseBudget]);

  // Filtered Land
  const landListings = useMemo(() => {
    return publishedProperties
      .filter((p) => p.intent === 'Land')
      .filter((p) => {
        if (landLocation !== 'All' && !p.location.toLowerCase().includes(landLocation.toLowerCase())) {
          return false;
        }
        if (landPlotSize !== 'All' && !(p.plotSize || '').toLowerCase().includes(landPlotSize.toLowerCase())) {
          return false;
        }
        if (landBudget !== 'All' && p.priceNumeric) {
          if (landBudget === 'under-15m' && p.priceNumeric >= 15_000_000) return false;
          if (landBudget === '15m-50m' && (p.priceNumeric < 15_000_000 || p.priceNumeric > 50_000_000)) return false;
          if (landBudget === 'above-50m' && p.priceNumeric <= 50_000_000) return false;
        }
        if (landDocFilter !== 'All' && !(p.documentStatus || '').toLowerCase().includes(landDocFilter.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [publishedProperties, landLocation, landPlotSize, landBudget, landDocFilter]);

  // Filtered Rentals
  const rentalListings = useMemo(() => {
    return publishedProperties
      .filter((p) => p.intent === 'Rent')
      .filter((p) => {
        if (rentalSubcategory !== 'All' && p.rentalCategory !== rentalSubcategory) {
          return false;
        }
        if (rentalLocation !== 'All' && !p.location.toLowerCase().includes(rentalLocation.toLowerCase())) {
          return false;
        }
        if (selectedRentalPeriod !== 'All') {
          const supported = p.supportedDurations || [];
          const matchesPeriod =
            supported.some((d) => d.toLowerCase() === selectedRentalPeriod.toLowerCase()) ||
            (p.billingPeriod || '').toLowerCase().includes(selectedRentalPeriod.toLowerCase());
          if (!matchesPeriod) return false;
        }
        return true;
      });
  }, [publishedProperties, rentalSubcategory, rentalLocation, selectedRentalPeriod]);

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

  // Gallery items for selected gallery tab: combines real published listings in that category + illustrative visuals
  const activeGalleryVisuals = useMemo(() => {
    const matchingListings = publishedProperties.filter((p) => {
      if (galleryTab === 'houses') return p.intent === 'Buy';
      if (galleryTab === 'land') return p.intent === 'Land';
      return p.intent === 'Rent';
    });

    const realItems = matchingListings.map((p) => ({
      id: `real-${p.id}`,
      image: p.image,
      images: p.gallery && p.gallery.length > 0 ? p.gallery : [p.image],
      title: p.title,
      caption: `${p.location} • ${p.propertyType}`,
      isIllustrative: false,
      linkedProperty: p,
    }));

    const illustrativeItems = ILLUSTRATIVE_GALLERY_VISUALS.filter(
      (item) => item.category === galleryTab
    ).map((item) => ({
      id: item.id,
      image: item.image,
      images: [item.image],
      title: 'Illustrative Property Visual',
      caption: item.caption,
      isIllustrative: true,
      linkedProperty: undefined,
    }));

    return [...realItems, ...illustrativeItems];
  }, [publishedProperties, galleryTab]);

  return (
    <main className="w-full bg-[#F5F3ED]/60 min-h-screen">
      {/* Top Page Header */}
      <section className="bg-[#102F2B] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
              Property Discovery Centre
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Properties & Opportunities
            </h1>
            <p className="text-sm sm:text-base text-[#F5F3ED]/85 leading-relaxed">
              Browse houses for sale, surveyed residential land plots, short-stay and long-term rental properties, and our categorized architectural gallery.
            </p>
          </div>

          <button
            onClick={() => onOpenEnquiry('custom')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold shadow-sm transition-colors shrink-0 self-start md:self-auto"
          >
            <Search className="w-4 h-4" />
            <span>Can't Find What You Need?</span>
          </button>
        </div>
      </section>

      {/* Exactly Three Primary Category Tabs */}
      <section className="bg-white border-b border-[#102F2B]/10 sticky top-18 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4 overflow-x-auto py-3">
          <button
            onClick={() => handleSelectMainTab('houses')}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'houses'
                ? 'bg-[#102F2B] text-white shadow-xs'
                : 'bg-[#F5F3ED] text-[#202824] hover:bg-[#E9F0EB]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Houses for Sale</span>
          </button>

          <button
            onClick={() => handleSelectMainTab('land')}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'land'
                ? 'bg-[#102F2B] text-white shadow-xs'
                : 'bg-[#F5F3ED] text-[#202824] hover:bg-[#E9F0EB]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Land for Sale</span>
          </button>

          <button
            onClick={() => handleSelectMainTab('rentals')}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'rentals'
                ? 'bg-[#102F2B] text-white shadow-xs'
                : 'bg-[#F5F3ED] text-[#202824] hover:bg-[#E9F0EB]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Rentals</span>
          </button>
        </div>
      </section>

      {/* ACTIVE TAB CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        {/* TAB A: HOUSES FOR SALE */}
        {activeTab === 'houses' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#102F2B]/10 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif-display text-2xl font-bold text-[#102F2B]">
                    Houses for Sale
                  </h2>
                  <p className="text-xs sm:text-sm text-[#69736D]">
                    Indicative price range: ₦30 million – ₦500 million and above (confirm exact property price upon enquiry).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setHouseLocation('All');
                    setHouseType('All');
                    setHouseBedrooms('All');
                    setHouseAvailability('All');
                    setHouseBudget('All');
                  }}
                  className="text-xs font-semibold text-[#1D5147] hover:underline self-start"
                >
                  Reset Filters
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs sm:text-sm">
                <select
                  value={houseLocation}
                  onChange={(e) => setHouseLocation(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter houses by location"
                >
                  <option value="All">All Locations</option>
                  <option value="Asaba">Asaba</option>
                  <option value="Ibusa">Ibusa</option>
                  <option value="Agbor">Agbor</option>
                  <option value="Warri">Warri</option>
                </select>

                <select
                  value={houseType}
                  onChange={(e) => setHouseType(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter houses by house type"
                >
                  <option value="All">All House Types</option>
                  <option value="Detached Duplex">Detached Duplex</option>
                  <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
                  <option value="Terrace House">Terrace House</option>
                  <option value="Bungalow">Bungalow</option>
                </select>

                <select
                  value={houseBudget}
                  onChange={(e) => setHouseBudget(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter houses by budget"
                >
                  <option value="All">Any Budget</option>
                  <option value="under-80m">Under ₦80 Million</option>
                  <option value="80m-150m">₦80M – ₦150 Million</option>
                  <option value="above-150m">Above ₦150 Million</option>
                </select>

                <select
                  value={houseBedrooms}
                  onChange={(e) => setHouseBedrooms(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter houses by bedrooms"
                >
                  <option value="All">Any Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>

                <select
                  value={houseAvailability}
                  onChange={(e) => setHouseAvailability(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter houses by availability"
                >
                  <option value="All">All Statuses</option>
                  <option value="For Sale">For Sale</option>
                  <option value="Under Offer">Under Offer</option>
                </select>
              </div>
            </div>

            {/* Houses Grid */}
            {housesListings.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-[#102F2B]/10 space-y-3">
                <p className="font-serif-display text-xl font-bold text-[#102F2B]">
                  No Matching House Listings Found
                </p>
                <p className="text-sm text-[#69736D] max-w-md mx-auto">
                  Adjust your filters or submit a custom property request so our team can review your requirements.
                </p>
                <button
                  onClick={() => onOpenEnquiry('custom', null, 'House for Sale')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold"
                >
                  <span>Submit Custom Property Request</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {housesListings.map((prop) => {
                  const isFav = favourites.includes(prop.id);
                  return (
                    <article
                      key={prop.id}
                      className="bg-white rounded-xl border border-[#102F2B]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-[#E9F0EB] overflow-hidden">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-3 left-3 bg-[#102F2B]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                          {prop.status}
                        </div>
                        <button
                          onClick={() => onToggleFavourite(prop.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-[#102F2B] shadow-xs hover:scale-105 transition-transform"
                          aria-label={isFav ? 'Remove from saved' : 'Save listing'}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-[#B58C48] text-[#B58C48]' : 'stroke-current'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-[#69736D]">
                            <span className="font-semibold text-[#1D5147]">{prop.propertyType}</span>
                            <span className="font-mono">{prop.referenceId}</span>
                          </div>
                          <h3 className="font-serif-display text-lg font-bold text-[#102F2B] leading-snug">
                            {prop.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#69736D] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#B58C48] shrink-0" />
                            <span>{prop.location}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#202824] pt-1">
                            {prop.bedrooms !== undefined && prop.bedrooms > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5 text-[#1D5147]" />
                                {prop.bedrooms} Beds
                              </span>
                            )}
                            {prop.bathrooms !== undefined && prop.bathrooms > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5 text-[#1D5147]" />
                                {prop.bathrooms} Baths
                              </span>
                            )}
                            {prop.buildingSize && (
                              <span className="inline-flex items-center gap-1">
                                <Maximize className="w-3.5 h-3.5 text-[#1D5147]" />
                                {prop.buildingSize}
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-bold text-[#102F2B] tabular-nums-naira pt-1">
                            {formatPropertyPrice(prop)}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#102F2B]/10 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => onViewDetails(prop)}
                            className="py-2 px-2 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => onOpenEnquiry('purchase', prop, 'Houses for Sale')}
                            className="py-2 px-2 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enquire</span>
                          </button>
                          <button
                            onClick={() => onOpenEnquiry('inspection', prop)}
                            className="py-2 px-2 rounded-lg border border-[#102F2B]/20 hover:bg-[#E9F0EB] text-[#102F2B] text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB B: LAND FOR SALE */}
        {activeTab === 'land' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#102F2B]/10 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif-display text-2xl font-bold text-[#102F2B]">
                    Land for Sale
                  </h2>
                  <p className="text-xs sm:text-sm text-[#69736D]">
                    Indicative price range: ₦5 million – ₦100 million and above (plot prices and title documents confirmed per parcel).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLandLocation('All');
                    setLandPlotSize('All');
                    setLandBudget('All');
                    setLandDocFilter('All');
                  }}
                  className="text-xs font-semibold text-[#1D5147] hover:underline self-start"
                >
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                <select
                  value={landLocation}
                  onChange={(e) => setLandLocation(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter land by location"
                >
                  <option value="All">All Locations</option>
                  <option value="Asaba">Asaba</option>
                  <option value="Ibusa">Ibusa</option>
                  <option value="Agbor">Agbor</option>
                </select>

                <select
                  value={landPlotSize}
                  onChange={(e) => setLandPlotSize(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter land by plot size"
                >
                  <option value="All">All Plot Sizes</option>
                  <option value="465">Approx. 465 sqm (50×100 ft)</option>
                  <option value="930">Approx. 930 sqm (100×100 ft)</option>
                </select>

                <select
                  value={landBudget}
                  onChange={(e) => setLandBudget(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter land by budget"
                >
                  <option value="All">Any Budget</option>
                  <option value="under-15m">Under ₦15 Million</option>
                  <option value="15m-50m">₦15M – ₦50 Million</option>
                  <option value="above-50m">Above ₦50 Million</option>
                </select>

                <select
                  value={landDocFilter}
                  onChange={(e) => setLandDocFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter land by documentation note"
                >
                  <option value="All">All Documentation Records</option>
                  <option value="review">Available for Review</option>
                  <option value="enquiry">Shared Upon Enquiry</option>
                </select>
              </div>
            </div>

            {landListings.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-[#102F2B]/10 space-y-3">
                <p className="font-serif-display text-xl font-bold text-[#102F2B]">
                  No Matching Land Listings Found
                </p>
                <p className="text-sm text-[#69736D] max-w-md mx-auto">
                  Adjust filters or submit a custom land enquiry so our team can share suitable opportunities.
                </p>
                <button
                  onClick={() => onOpenEnquiry('custom', null, 'Land for Sale')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold"
                >
                  <span>Request Land Options</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {landListings.map((prop) => {
                  const isFav = favourites.includes(prop.id);
                  return (
                    <article
                      key={prop.id}
                      className="bg-white rounded-xl border border-[#102F2B]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-[#E9F0EB] overflow-hidden">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-3 left-3 bg-[#102F2B]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                          {prop.status}
                        </div>
                        <button
                          onClick={() => onToggleFavourite(prop.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-[#102F2B] shadow-xs hover:scale-105 transition-transform"
                          aria-label={isFav ? 'Remove from saved' : 'Save land listing'}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-[#B58C48] text-[#B58C48]' : 'stroke-current'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-[#69736D]">
                            <span className="font-semibold text-[#1D5147]">{prop.propertyType}</span>
                            <span className="font-mono">{prop.referenceId}</span>
                          </div>
                          <h3 className="font-serif-display text-lg font-bold text-[#102F2B] leading-snug">
                            {prop.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#69736D] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#B58C48] shrink-0" />
                            <span>{prop.location}</span>
                          </p>
                          {prop.plotSize && (
                            <p className="text-xs font-medium text-[#202824]">
                              Plot Size: {prop.plotSize}
                            </p>
                          )}
                          {prop.documentStatus && (
                            <p className="text-xs text-[#69736D]">
                              Docs: {prop.documentStatus}
                            </p>
                          )}
                          <p className="text-lg font-bold text-[#102F2B] tabular-nums-naira pt-1">
                            {formatPropertyPrice(prop)}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#102F2B]/10 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => onViewDetails(prop)}
                            className="py-2 px-2 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => onOpenEnquiry('purchase', prop, 'Land for Sale')}
                            className="py-2 px-2 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Purchase</span>
                          </button>
                          <button
                            onClick={() => onOpenEnquiry('inspection', prop)}
                            className="py-2 px-2 rounded-lg border border-[#102F2B]/20 hover:bg-[#E9F0EB] text-[#102F2B] text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB C: RENTALS (SHORT-STAY + LONG-TERM) */}
        {activeTab === 'rentals' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#102F2B]/10 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif-display text-2xl font-bold text-[#102F2B]">
                    Rental Properties
                  </h2>
                  <p className="text-xs sm:text-sm text-[#69736D]">
                    Indicative rental range: ₦500,000 – ₦15 million and above (subject to specific property and chosen rental duration).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRentalSubcategory('All');
                    setSelectedRentalPeriod('All');
                    setRentalLocation('All');
                  }}
                  className="text-xs font-semibold text-[#1D5147] hover:underline self-start"
                >
                  Reset Filters
                </button>
              </div>

              {/* Subcategory Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Short Stay', 'Long-Term Rental'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setRentalSubcategory(sub);
                      setSelectedRentalPeriod('All');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${
                      rentalSubcategory === sub
                        ? 'bg-[#102F2B] text-white border-[#102F2B]'
                        : 'bg-[#F5F3ED] text-[#202824] border-[#102F2B]/10 hover:bg-[#E9F0EB]'
                    }`}
                  >
                    {sub === 'All' ? 'All Rentals' : sub === 'Short Stay' ? 'Short-Stay Rentals' : 'Long-Term Rentals'}
                  </button>
                ))}
              </div>

              {/* Duration & Location Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <select
                  value={selectedRentalPeriod}
                  onChange={(e) => setSelectedRentalPeriod(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter rentals by duration"
                >
                  <option value="All">Any Rental Period</option>
                  {(rentalSubcategory === 'All' || rentalSubcategory === 'Short Stay') && (
                    <>
                      <option value="Nightly">Short Stay — Nightly</option>
                      <option value="Weekly">Short Stay — Weekly</option>
                      <option value="Monthly">Short Stay — Monthly</option>
                    </>
                  )}
                  {(rentalSubcategory === 'All' || rentalSubcategory === 'Long-Term Rental') && (
                    <>
                      <option value="One year">Long-Term — One year</option>
                      <option value="Two years">Long-Term — Two years</option>
                      <option value="Three years">Long-Term — Three years</option>
                    </>
                  )}
                  <option value="Other">Other agreed duration</option>
                </select>

                <select
                  value={rentalLocation}
                  onChange={(e) => setRentalLocation(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-[#102F2B]/15 bg-[#F5F3ED]/60 text-[#202824]"
                  aria-label="Filter rentals by location"
                >
                  <option value="All">All Locations</option>
                  <option value="Asaba">Asaba</option>
                  <option value="Ibusa">Ibusa</option>
                  <option value="Warri">Warri</option>
                </select>
              </div>
            </div>

            {rentalListings.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-[#102F2B]/10 space-y-3">
                <p className="font-serif-display text-xl font-bold text-[#102F2B]">
                  No Matching Rental Listings Found
                </p>
                <p className="text-sm text-[#69736D] max-w-md mx-auto">
                  Submit a Rental Enquiry with your preferred duration (nightly, weekly, monthly, 1-year, 2-year, or 3-year) so our team can assist you.
                </p>
                <button
                  onClick={() => onOpenEnquiry('rental')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold"
                >
                  <span>Submit Rental Enquiry</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentalListings.map((prop) => {
                  const isFav = favourites.includes(prop.id);
                  return (
                    <article
                      key={prop.id}
                      className="bg-white rounded-xl border border-[#102F2B]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-[#E9F0EB] overflow-hidden">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-3 left-3 bg-[#102F2B]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                          {prop.rentalCategory || prop.status}
                        </div>
                        <button
                          onClick={() => onToggleFavourite(prop.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-[#102F2B] shadow-xs hover:scale-105 transition-transform"
                          aria-label={isFav ? 'Remove from saved' : 'Save rental'}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-[#B58C48] text-[#B58C48]' : 'stroke-current'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-[#69736D]">
                            <span className="font-semibold text-[#1D5147]">{prop.propertyType}</span>
                            <span className="font-mono">{prop.referenceId}</span>
                          </div>
                          <h3 className="font-serif-display text-lg font-bold text-[#102F2B] leading-snug">
                            {prop.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#69736D] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#B58C48] shrink-0" />
                            <span>{prop.location}</span>
                          </p>
                          {prop.minimumDuration && (
                            <p className="text-xs text-[#202824]">
                              Minimum Duration: <strong>{prop.minimumDuration}</strong>
                            </p>
                          )}
                          {prop.supportedDurations && prop.supportedDurations.length > 0 && (
                            <p className="text-xs text-[#69736D]">
                              Supported: {prop.supportedDurations.join(', ')}
                            </p>
                          )}
                          <p className="text-lg font-bold text-[#102F2B] tabular-nums-naira pt-1">
                            {formatPropertyPrice(prop)}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#102F2B]/10 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => onViewDetails(prop)}
                            className="py-2 px-2 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => onOpenEnquiry('rental', prop)}
                            className="py-2 px-2 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enquire</span>
                          </button>
                          <button
                            onClick={() => onOpenEnquiry('inspection', prop)}
                            className="py-2 px-2 rounded-lg border border-[#102F2B]/20 hover:bg-[#E9F0EB] text-[#102F2B] text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CAN'T FIND WHAT YOU NEED BANNER */}
        <div className="bg-[#102F2B] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-serif-display text-2xl font-bold text-white">
              Can't Find What You Need?
            </h3>
            <p className="text-sm text-[#F5F3ED]/85 leading-relaxed">
              Submit your preferred property type, location, and budget through our Custom Property Request form. Our team will review your requirements and contact you if a suitable option is identified.
            </p>
          </div>
          <button
            onClick={() => onOpenEnquiry('custom')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold transition-colors shrink-0"
          >
            <span>Request Custom Property</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* SECTION D: COMPREHENSIVE PROPERTY GALLERY */}
        <section className="pt-6 border-t border-[#102F2B]/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B58C48] block mb-1">
                Categorized Visual Showcase
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B]">
                Comprehensive Property Gallery
              </h2>
              <p className="text-xs sm:text-sm text-[#69736D] mt-1">
                Select an image to view full property details (for recorded listings) or preview architectural illustrations (clearly marked as illustrative visuals).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['houses', 'land', 'rentals'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryTab(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    galleryTab === cat
                      ? 'bg-[#102F2B] text-white'
                      : 'bg-white text-[#202824] border border-[#102F2B]/15 hover:bg-[#E9F0EB]'
                  }`}
                >
                  {cat === 'houses'
                    ? 'Houses Gallery'
                    : cat === 'land'
                    ? 'Land Gallery'
                    : 'Rental Apartments'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeGalleryVisuals.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.linkedProperty) {
                    onViewDetails(item.linkedProperty);
                  } else {
                    setLightboxItem({
                      images: item.images,
                      index: 0,
                      title: item.title,
                      caption: item.caption,
                      isIllustrative: true,
                    });
                  }
                }}
                className="group bg-white rounded-xl border border-[#102F2B]/10 overflow-hidden shadow-xs hover:shadow-md transition-all text-left flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-[#E9F0EB] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-[#102F2B]/85 text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {item.isIllustrative ? 'Illustrative Visual' : item.linkedProperty?.referenceId}
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <p className="text-xs font-bold text-[#102F2B] line-clamp-1">{item.title}</p>
                  <p className="text-xs text-[#69736D] line-clamp-1">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </section>

      {/* IMAGE LIGHTBOX FOR ILLUSTRATIVE GALLERY IMAGES */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 bg-[#102F2B] text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#D6B779] font-semibold">
                  Illustrative Property Visual
                </span>
                <h3 className="font-serif-display text-lg font-bold">{lightboxItem.caption}</h3>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] bg-[#F5F3ED]">
              <img
                src={lightboxItem.images[lightboxItem.index]}
                alt={lightboxItem.caption}
                className="w-full h-full object-cover object-center"
              />
              {lightboxItem.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              index:
                                prev.index === 0
                                  ? prev.images.length - 1
                                  : prev.index - 1,
                            }
                          : null
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#102F2B] flex items-center justify-center shadow"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setLightboxItem((prev) =>
                        prev
                          ? { ...prev, index: (prev.index + 1) % prev.images.length }
                          : null
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#102F2B] flex items-center justify-center shadow"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 bg-[#F5F3ED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[#69736D] max-w-md">
                This visual is illustrative of architectural styles and does not represent a confirmed available listing, price, or specific property allocation.
              </p>
              <button
                onClick={() => {
                  setLightboxItem(null);
                  onOpenEnquiry('custom');
                }}
                className="px-5 py-2.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-xs sm:text-sm font-semibold shrink-0"
              >
                Make a General Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

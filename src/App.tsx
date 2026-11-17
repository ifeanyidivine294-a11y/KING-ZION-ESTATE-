import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PropertiesPage } from './components/PropertiesPage';
import { EstateProjectsPage } from './components/EstateProjectsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PropertyDetailDrawer } from './components/PropertyDetailDrawer';
import { EnquirySlideOver } from './components/EnquirySlideOver';
import { FavouritesDrawer } from './components/FavouritesDrawer';
import { LegalModal } from './components/LegalModal';

const AdminPortal = lazy(() =>
  import('./components/AdminPortal').then((m) => ({ default: m.AdminPortal }))
);

import { NIGERIAN_ASSETS } from './assets/imageManifest';
import {
  INITIAL_COMPANY_SETTINGS,
  INITIAL_FAQS,
  INITIAL_LEADERSHIP,
  INITIAL_PROPERTIES,
  INITIAL_TESTIMONIALS,
} from './data/initialData';
import {
  CompanySettings,
  EnquiryFormType,
  FAQItem,
  InspectionRequest,
  LeadershipMember,
  PropertiesTab,
  Property,
  PropertyEnquiry,
  PublicRoute,
  PurchaseEnquiry,
  Testimonial,
} from './types';

// Additive migration for cached localStorage properties so old foreign stock images map cleanly to verified Nigerian visuals
const upgradeCachedProperties = (savedProps: Property[]): Property[] => {
  const imageMap: Record<string, string> = {
    'feat_modern_duplex.png': NIGERIAN_ASSETS.housesDuplex,
    'prop_modern_duplex.jpg': NIGERIAN_ASSETS.housesDuplex,
    'feat_semi_detached.png': NIGERIAN_ASSETS.semiDetached,
    'prop_semi_detached.jpg': NIGERIAN_ASSETS.semiDetached,
    'feat_luxury_apt.png': NIGERIAN_ASSETS.apartmentExterior,
    'prop_luxury_apt.jpg': NIGERIAN_ASSETS.apartmentExterior,
    'cat_rental_hero.jpg': NIGERIAN_ASSETS.rentalInterior,
    'feat_land_plot.png': NIGERIAN_ASSETS.landCategory,
    'prop_land_plot.jpg': NIGERIAN_ASSETS.landCategory,
    'cat_land_hq.jpg': NIGERIAN_ASSETS.surveyPegsLand,
    'phase1_asaba.jpg': NIGERIAN_ASSETS.estateEntrance,
    'phase2_ibusa.jpg': NIGERIAN_ASSETS.estateDevLand,
    'prop_bungalow.jpg': NIGERIAN_ASSETS.bungalow,
    'feat_terrace.png': NIGERIAN_ASSETS.gatedEstate,
    'prop_terrace.jpg': NIGERIAN_ASSETS.gatedEstate,
    'feat_gated_estate.png': NIGERIAN_ASSETS.gatedEstate,
    'prop_gated_estate.jpg': NIGERIAN_ASSETS.gatedEstate,
    'cta_villa.jpg': NIGERIAN_ASSETS.heroDuplex,
    'prop_commercial.jpg': NIGERIAN_ASSETS.heroDuplex,
    'hero_1600.jpg': NIGERIAN_ASSETS.heroDuplex,
    'hero_hq.jpg': NIGERIAN_ASSETS.heroDuplex,
    'why_us_1600.jpg': NIGERIAN_ASSETS.rentalInterior,
    'why_us_hq.jpg': NIGERIAN_ASSETS.rentalInterior,
    'cat_homes_hq.jpg': NIGERIAN_ASSETS.housesDuplex,
  };

  const mapPath = (path: string, fallback: string) => {
    if (!path) return fallback;
    for (const [oldKey, newAsset] of Object.entries(imageMap)) {
      if (path.includes(oldKey)) return newAsset;
    }
    return path;
  };

  return savedProps.map((p) => {
    const fallback =
      p.intent === 'Land'
        ? NIGERIAN_ASSETS.landCategory
        : p.intent === 'Rent'
        ? NIGERIAN_ASSETS.rentalInterior
        : NIGERIAN_ASSETS.housesDuplex;
    const upgradedImg = mapPath(p.image, fallback);
    const upgradedGallery = (p.gallery || [])
      .map((g) => mapPath(g, upgradedImg))
      .filter(Boolean);

    // Ensure Land listings strictly show land imagery
    const safeImg =
      p.intent === 'Land' &&
      (upgradedImg === NIGERIAN_ASSETS.heroDuplex ||
        upgradedImg === NIGERIAN_ASSETS.housesDuplex ||
        upgradedImg === NIGERIAN_ASSETS.rentalInterior)
        ? NIGERIAN_ASSETS.landCategory
        : upgradedImg;

    return {
      ...p,
      image: safeImg,
      gallery: upgradedGallery.length > 0 ? upgradedGallery : [safeImg],
      billingPeriod:
        p.intent === 'Rent' && !p.billingPeriod
          ? p.rentPeriod === 'per month'
            ? 'per month'
            : 'per year'
          : p.billingPeriod,
      rentalCategory:
        p.intent === 'Rent' && !p.rentalCategory ? 'Long-Term Rental' : p.rentalCategory,
    };
  });
};

const sanitizeLegacySettings = (saved: CompanySettings): CompanySettings => {
  const isLegacyPhone = saved.officialPhone === '+234 803 000 0000';
  const isLegacyWhatsapp = saved.officialWhatsapp === '+234 803 000 0000';
  const isLegacyEmail = saved.officialEmail === 'enquiry@kingzionsestate.com';
  return {
    ...INITIAL_COMPANY_SETTINGS,
    ...saved,
    headOffice: 'No. 5 King Zion Estate, Phase 1, Asaba, Delta State, Nigeria.',
    officialPhone: isLegacyPhone ? '' : saved.officialPhone || '',
    officialWhatsapp: isLegacyWhatsapp ? '' : saved.officialWhatsapp || '',
    officialEmail: isLegacyEmail ? '' : saved.officialEmail || '',
    registrationNumber: saved.registrationNumber === 'RC-KZE-DELTA-2024' ? '' : saved.registrationNumber || '',
  };
};

const upgradeCachedLeadership = (savedLeaders: LeadershipMember[]): LeadershipMember[] => {
  return savedLeaders.map((m) => {
    const isLegacyPortrait =
      m.portrait &&
      (m.portrait.includes('ceo_hq.jpg') ||
        m.portrait.includes('manager_hq.jpg') ||
        m.portrait.includes('ceo_portrait.jpg') ||
        m.portrait.includes('manager_portrait.jpg'));

    if (m.id === 'ceo') {
      return {
        ...m,
        name: 'Mr. Kingslay Wilfred',
        role: "CEO, King Zion's Estate",
        portrait: isLegacyPortrait ? '' : m.portrait || '',
      };
    }

    if (m.id === 'property-manager' || m.id === 'property-coordinator') {
      return {
        ...m,
        id: 'property-coordinator',
        name: m.name === 'Property Manager' ? 'Property Coordinator' : m.name,
        role: 'Property Coordinator',
        portrait: isLegacyPortrait ? '' : m.portrait || '',
      };
    }

    return m;
  });
};

const sanitizeLegacyTestimonials = (saved: Testimonial[]): Testimonial[] => {
  const legacySampleIds = new Set(['test-1', 'test-2', 'test-3']);
  const legacySampleNames = new Set([
    'Engr. Emeka O.',
    'Dr. (Mrs.) Ngozi A.',
    'Mr. & Mrs. Kenneth I.',
  ]);
  return saved.filter(
    (t) => !(legacySampleIds.has(t.id) && legacySampleNames.has(t.name))
  );
};

export default function App() {
  // Persistent State (Preserving all existing localStorage keys)
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('kze_properties');
      if (saved) {
        return upgradeCachedProperties(JSON.parse(saved));
      }
      return INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem('kze_settings');
      return saved ? sanitizeLegacySettings(JSON.parse(saved)) : INITIAL_COMPANY_SETTINGS;
    } catch {
      return INITIAL_COMPANY_SETTINGS;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem('kze_faqs');
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('kze_testimonials');
      return saved ? sanitizeLegacyTestimonials(JSON.parse(saved)) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [leadership, setLeadership] = useState<LeadershipMember[]>(() => {
    try {
      const saved = localStorage.getItem('kze_leadership');
      if (saved) {
        return upgradeCachedLeadership(JSON.parse(saved));
      }
      return INITIAL_LEADERSHIP;
    } catch {
      return INITIAL_LEADERSHIP;
    }
  });

  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kze_enquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchaseEnquiries, setPurchaseEnquiries] = useState<PurchaseEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kze_purchase_enquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inspections, setInspections] = useState<InspectionRequest[]>(() => {
    try {
      const saved = localStorage.getItem('kze_inspections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kze_favourites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Strict 5-Public-Page Routing
  const resolveRouteFromUrl = (): {
    route: PublicRoute;
    tab?: PropertiesTab;
    openAdmin?: boolean;
  } => {
    if (typeof window === 'undefined') return { route: 'home' };
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path === '/admin' || hash === '#admin') {
      return { route: 'home', openAdmin: true };
    }
    if (path === '/properties' || hash === '#properties') return { route: 'properties' };
    if (path === '/properties-for-sale' || hash === '#properties-for-sale') {
      return { route: 'properties', tab: 'houses' };
    }
    if (path === '/land-for-sale' || hash === '#land-for-sale') {
      return { route: 'properties', tab: 'land' };
    }
    if (path === '/properties-for-rent' || hash === '#properties-for-rent') {
      return { route: 'properties', tab: 'rentals' };
    }
    if (path === '/estate-projects' || hash === '#estate-projects') {
      return { route: 'estate-projects' };
    }
    if (path === '/about' || hash === '#about') {
      return { route: 'about' };
    }
    if (
      path === '/contact' ||
      hash === '#contact' ||
      path === '/request-inspection' ||
      path === '/purchase-enquiry' ||
      path === '/property-request'
    ) {
      return { route: 'contact' };
    }
    return { route: 'home' };
  };

  const initialResolved = resolveRouteFromUrl();
  const [currentRoute, setCurrentRoute] = useState<PublicRoute>(initialResolved.route);
  const [propertiesTab, setPropertiesTab] = useState<PropertiesTab>(
    initialResolved.tab || 'houses'
  );
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(
    Boolean(initialResolved.openAdmin)
  );

  // Contact / SlideOver Enquiry Pre-selection Context
  const [contactEnquiryType, setContactEnquiryType] = useState<EnquiryFormType>('inspection');
  const [contactPreselectedProperty, setContactPreselectedProperty] = useState<Property | null>(
    null
  );
  const [contactPreselectedProject, setContactPreselectedProject] = useState<string>('');

  // Modals & Drawers
  const [detailDrawerProperty, setDetailDrawerProperty] = useState<Property | null>(null);
  const [enquiryModalState, setEnquiryModalState] = useState<{
    isOpen: boolean;
    type: EnquiryFormType;
    property?: Property | null;
    project?: string;
    category?: string;
  }>({
    isOpen: false,
    type: 'inspection',
  });
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persistence Helpers (Throws on quota error so forms handle errors truthfully)
  const handleSaveProperties = (newProps: Property[]) => {
    localStorage.setItem('kze_properties', JSON.stringify(newProps));
    setProperties(newProps);
  };

  const handleSaveSettings = (newSettings: CompanySettings) => {
    localStorage.setItem('kze_settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleSaveFaqs = (newFaqs: FAQItem[]) => {
    localStorage.setItem('kze_faqs', JSON.stringify(newFaqs));
    setFaqs(newFaqs);
  };

  const handleSaveLeadership = (newLeadership: LeadershipMember[]) => {
    localStorage.setItem('kze_leadership', JSON.stringify(newLeadership));
    setLeadership(newLeadership);
  };

  const handleSaveTestimonials = (newTestimonials: Testimonial[]) => {
    localStorage.setItem('kze_testimonials', JSON.stringify(newTestimonials));
    setTestimonials(newTestimonials);
  };

  const handleSaveEnquiries = (newEnquiries: PropertyEnquiry[]) => {
    localStorage.setItem('kze_enquiries', JSON.stringify(newEnquiries));
    setEnquiries(newEnquiries);
  };

  const handleSavePurchaseEnquiries = (newPurchases: PurchaseEnquiry[]) => {
    localStorage.setItem('kze_purchase_enquiries', JSON.stringify(newPurchases));
    setPurchaseEnquiries(newPurchases);
  };

  const handleSaveInspections = (newInspections: InspectionRequest[]) => {
    localStorage.setItem('kze_inspections', JSON.stringify(newInspections));
    setInspections(newInspections);
  };

  const handleToggleFavourite = (propertyId: string) => {
    const exists = favourites.includes(propertyId);
    const updated = exists
      ? favourites.filter((id) => id !== propertyId)
      : [...favourites, propertyId];
    localStorage.setItem('kze_favourites', JSON.stringify(updated));
    setFavourites(updated);
    showToast(exists ? 'Removed from saved properties' : 'Added to saved properties');
  };

  // Strict 5-Public-Page Router
  const navigateTo = (route: PublicRoute) => {
    setCurrentRoute(route);
    const pathMap: Record<PublicRoute, string> = {
      home: '/',
      properties: '/properties',
      'estate-projects': '/estate-projects',
      about: '/about',
      contact: '/contact',
    };
    const targetPath = pathMap[route];
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPropertiesWithTab = (tab: PropertiesTab) => {
    setPropertiesTab(tab);
    navigateTo('properties');
  };

  const openContactWithEnquiry = (
    type: EnquiryFormType,
    property?: Property | null,
    projectName = ''
  ) => {
    setContactEnquiryType(type);
    setContactPreselectedProperty(property || null);
    setContactPreselectedProject(projectName);
    navigateTo('contact');
  };

  const openEnquiryPanel = (
    type: EnquiryFormType,
    property?: Property | null,
    category?: string,
    project?: string
  ) => {
    setDetailDrawerProperty(null);
    setEnquiryModalState({
      isOpen: true,
      type,
      property: property || null,
      category,
      project,
    });
  };

  useEffect(() => {
    const onPopOrHash = () => {
      const resolved = resolveRouteFromUrl();
      setCurrentRoute(resolved.route);
      if (resolved.tab) setPropertiesTab(resolved.tab);
      if (resolved.openAdmin) setIsAdminPortalOpen(true);
    };
    window.addEventListener('popstate', onPopOrHash);
    window.addEventListener('hashchange', onPopOrHash);
    return () => {
      window.removeEventListener('popstate', onPopOrHash);
      window.removeEventListener('hashchange', onPopOrHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#202824] flex flex-col font-sans selection:bg-[#102F2B] selection:text-white">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#102F2B] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold border border-[#D6B779]/30">
          {toastMessage}
        </div>
      )}

      {/* Public Header — Strict 5 Public Pages + Enquire Now */}
      <Header
        currentRoute={currentRoute}
        favouritesCount={favourites.length}
        onNavigateRoute={navigateTo}
        onOpenFavourites={() => setIsFavouritesOpen(true)}
        onOpenEnquire={() => openContactWithEnquiry('custom')}
        officialPhone={settings.officialPhone}
      />

      {/* Main 5-Page Router */}
      <div className="flex-1 flex flex-col">
        {currentRoute === 'properties' ? (
          <PropertiesPage
            properties={properties}
            activeTab={propertiesTab}
            onChangeTab={setPropertiesTab}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
            onViewDetails={(prop) => setDetailDrawerProperty(prop)}
            onOpenEnquiry={(type, prop, category) => openEnquiryPanel(type, prop, category)}
          />
        ) : currentRoute === 'estate-projects' ? (
          <EstateProjectsPage
            onEnquireProject={(projectName) => openContactWithEnquiry('purchase', null, projectName)}
            onInspectProject={(projectName) =>
              openContactWithEnquiry('inspection', null, projectName)
            }
          />
        ) : currentRoute === 'about' ? (
          <AboutPage
            settings={settings}
            leadership={leadership}
            faqs={faqs}
            testimonials={testimonials}
            onNavigateRoute={navigateTo}
          />
        ) : currentRoute === 'contact' ? (
          <ContactPage
            settings={settings}
            properties={properties}
            initialEnquiryType={contactEnquiryType}
            initialProperty={contactPreselectedProperty}
            initialProject={contactPreselectedProject}
            onSaveInspection={(req) => {
              handleSaveInspections([req, ...inspections]);
              showToast(`Inspection logged: ${req.referenceId}`);
            }}
            onSavePurchase={(req) => {
              handleSavePurchaseEnquiries([req, ...purchaseEnquiries]);
              showToast(`Purchase enquiry saved: ${req.referenceId}`);
            }}
            onSaveGeneralEnquiry={(req) => {
              handleSaveEnquiries([req, ...enquiries]);
              showToast(`Enquiry saved: ${req.referenceId}`);
            }}
          />
        ) : (
          <HomePage
            properties={properties}
            settings={settings}
            leadership={leadership}
            faqs={faqs}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
            onSelectProperty={(prop) => setDetailDrawerProperty(prop)}
            onOpenPropertiesTab={openPropertiesWithTab}
            onNavigateRoute={navigateTo}
            onRequestInspection={() => openContactWithEnquiry('inspection')}
          />
        )}
      </div>

      {/* Public Footer */}
      <Footer
        settings={settings}
        onNavigateRoute={navigateTo}
        onOpenLegalModal={(title, content) => setLegalModal({ isOpen: true, title, content })}
      />

      {/* Slide-out Property Details Drawer (No 6th Public Route) */}
      <PropertyDetailDrawer
        property={detailDrawerProperty}
        onClose={() => setDetailDrawerProperty(null)}
        isFavourite={
          detailDrawerProperty ? favourites.includes(detailDrawerProperty.id) : false
        }
        onToggleFavourite={handleToggleFavourite}
        onRequestInspection={(prop) => openEnquiryPanel('inspection', prop)}
        onEnquireProperty={(prop) =>
          openEnquiryPanel(
            prop.intent === 'Rent' ? 'rental' : 'purchase',
            prop,
            prop.intent === 'Land' ? 'Land for Sale' : 'Houses for Sale'
          )
        }
        officialWhatsapp={settings.officialWhatsapp}
      />

      {/* Modal Enquiry Slide-Over */}
      <EnquirySlideOver
        isOpen={enquiryModalState.isOpen}
        onClose={() => setEnquiryModalState((prev) => ({ ...prev, isOpen: false }))}
        initialType={enquiryModalState.type}
        initialProperty={enquiryModalState.property}
        initialProject={enquiryModalState.project}
        initialCategory={enquiryModalState.category}
        properties={properties}
        locations={settings.locations}
        onSaveInspection={(req) => {
          handleSaveInspections([req, ...inspections]);
          showToast(`Inspection logged: ${req.referenceId}`);
        }}
        onSavePurchase={(req) => {
          handleSavePurchaseEnquiries([req, ...purchaseEnquiries]);
          showToast(`Purchase enquiry saved: ${req.referenceId}`);
        }}
        onSaveGeneralEnquiry={(req) => {
          handleSaveEnquiries([req, ...enquiries]);
          showToast(`Enquiry saved: ${req.referenceId}`);
        }}
      />

      {/* Saved Properties Drawer */}
      <FavouritesDrawer
        isOpen={isFavouritesOpen}
        onClose={() => setIsFavouritesOpen(false)}
        favouriteIds={favourites}
        allProperties={properties}
        onRemoveFavourite={handleToggleFavourite}
        onSelectProperty={(prop) => setDetailDrawerProperty(prop)}
        onEnquireAll={() => openContactWithEnquiry('custom')}
      />

      {/* Private Staff / Admin Portal (Accessible via #admin or /admin, lazy-loaded and hidden from public menus) */}
      {isAdminPortalOpen && (
        <Suspense fallback={null}>
          <AdminPortal
            isOpen={isAdminPortalOpen}
            onClose={() => {
              setIsAdminPortalOpen(false);
              if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
                window.history.pushState(null, '', '/');
              }
            }}
            properties={properties}
            onSaveProperties={handleSaveProperties}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            faqs={faqs}
            onSaveFaqs={handleSaveFaqs}
            leadership={leadership}
            onSaveLeadership={handleSaveLeadership}
            testimonials={testimonials}
            onSaveTestimonials={handleSaveTestimonials}
            enquiries={enquiries}
            onSaveEnquiries={handleSaveEnquiries}
            purchaseEnquiries={purchaseEnquiries}
            onSavePurchaseEnquiries={handleSavePurchaseEnquiries}
            inspections={inspections}
            onSaveInspections={handleSaveInspections}
          />
        </Suspense>
      )}

      {/* Legal Disclaimer Modal */}
      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
        title={legalModal.title}
        content={legalModal.content}
      />
    </div>
  );
}

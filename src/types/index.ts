export type PublicRoute = 'home' | 'properties' | 'estate-projects' | 'about' | 'contact';

export type PropertiesTab = 'houses' | 'land' | 'rentals';

export type EnquiryFormType = 'inspection' | 'purchase' | 'rental' | 'custom';

export type PropertyType =
  | 'Detached Duplex'
  | 'Semi-Detached Duplex'
  | 'Terrace House'
  | 'Apartment'
  | 'Bungalow'
  | 'Residential Land'
  | 'Commercial Property'
  | 'Estate Development'
  | 'Custom Property';

export type ListingIntent = 'Buy' | 'Rent' | 'Land';

export type ListingStatus = 'For Sale' | 'For Rent' | 'Land' | 'Estate Project' | 'Sold' | 'Under Offer';

export type RentalCategory = 'Short Stay' | 'Long-Term Rental';

export type BillingPeriod =
  | 'per night'
  | 'per week'
  | 'per month'
  | 'per year'
  | 'per 2 years'
  | 'per 3 years'
  | 'other agreed duration';

export interface Property {
  id: string;
  referenceId: string;
  slug?: string;
  title: string;
  location: string;
  city: string;
  state: string;
  propertyType: PropertyType;
  intent: ListingIntent;
  status: ListingStatus;
  priceText: string;
  priceNumeric?: number;
  rentPeriod?: 'per annum' | 'per month';
  rentalCategory?: RentalCategory;
  billingPeriod?: BillingPeriod;
  minimumDuration?: string;
  supportedDurations?: string[];
  bedrooms?: number;
  bathrooms?: number;
  plotSize?: string;
  plotDimensions?: string;
  buildingSize?: string;
  featured: boolean;
  isIllustrative?: boolean;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  documentStatus: string;
  roadAccess?: string;
  infrastructure?: string;
  developmentStatus?: string;
  inspectionAvailable: boolean;
  published: boolean;
  createdAt: string;
}

export type RequestStatus =
  | 'New'
  | 'Under Review'
  | 'Contacted'
  | 'Property Suggested'
  | 'Inspection Requested'
  | 'Converted'
  | 'Closed';

export interface PropertyEnquiry {
  id: string;
  referenceId: string;
  enquiryCategory?: EnquiryFormType;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  preferredContactMethod: 'Phone Call' | 'WhatsApp' | 'Email';
  lookingFor: string;
  preferredLocation: string;
  propertyType: string;
  minBudget?: number;
  maxBudget?: number;
  budgetRangeText: string;
  bedrooms?: string;
  plotSize?: string;
  preferredPaymentPlan: 'Outright Payment' | 'Installment Payment' | 'Open to Discussion';
  purpose: string;
  idealPropertyDescription: string;
  preferredTimeline?: string;
  preferredInspectionDate?: string;
  additionalRequirements?: string;
  associatedPropertyId?: string;
  associatedPropertyTitle?: string;
  projectInterest?: string;
  // Rental-specific additive fields
  rentalType?: RentalCategory;
  requestedDuration?: string;
  occupants?: string;
  checkInDate?: string;
  checkOutDate?: string;
  moveInDate?: string;
  consentGiven: boolean;
  createdAt: string;
  status: RequestStatus;
  assignedStaff?: string;
  internalNotes?: string[];
}

export interface PurchaseEnquiry {
  id: string;
  referenceId: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  residentialAddress?: string;
  preferredContactMethod: 'Phone Call' | 'WhatsApp' | 'Email';
  propertyId: string;
  propertyTitle: string;
  propertyReference: string;
  propertyCategory: string;
  propertyLocation: string;
  propertyPrice?: string;
  intendedUse: string;
  purchaseTimeline: string;
  paymentArrangement: string;
  budget?: string;
  preferredPlotSize?: string;
  intendedLandUse?: string;
  plotQuantityType?: 'Individual plot' | 'Multiple plots';
  preferredHouseType?: string;
  bedroomPreference?: string;
  documentationQuestions?: string;
  preferredInspectionDate?: string;
  alternativeInspectionDate?: string;
  preferredTime?: string;
  additionalComments?: string;
  consentGiven: boolean;
  status: RequestStatus;
  createdAt: string;
}

export interface InspectionRequest {
  id: string;
  referenceId: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyCategory?: string;
  enquiryType?: 'Purchase' | 'Land' | 'Rental' | 'Estate Project';
  projectInterest?: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  preferredContactMethod?: 'Phone Call' | 'WhatsApp' | 'Email';
  preferredDate: string;
  alternativeDate?: string;
  preferredTimeSlot: string;
  attendeesCount?: string;
  notes?: string;
  questions?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  propertyService: string;
  content: string;
  verifiedClient: boolean;
}

export interface CompanySettings {
  companyName: string;
  motto: string;
  ceoName: string;
  headOffice: string;
  officialPhone: string;
  officialWhatsapp: string;
  officialEmail: string;
  locations: string[];
  registrationNumber?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Inspection' | 'Land' | 'Rentals' | 'Documentation';
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  portrait: string;
  quote: string;
  bio?: string;
}

export interface EstateProject {
  id: string;
  phaseLabel: string;
  name: string;
  location: string;
  image: string;
  secondaryImage: string;
  totalPlots: number;
  terracedDuplexes?: number;
  detachedDuplexes?: number;
  semiDetachedDuplexes?: number;
  overview: string;
  confirmedHighlights: string[];
}

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Home,
  KeyRound,
  Loader2,
  Search,
  Send,
} from 'lucide-react';
import {
  EnquiryFormType,
  InspectionRequest,
  Property,
  PropertyEnquiry,
  PurchaseEnquiry,
  RentalCategory,
} from '../types';
import { submitEnquiryToAppsScript } from '../services/enquirySync';

interface CentralEnquiryFormProps {
  initialType?: EnquiryFormType;
  initialProperty?: Property | null;
  initialProject?: string;
  initialCategory?: string;
  properties: Property[];
  locations: string[];
  onSaveInspection: (req: InspectionRequest) => Promise<void> | void;
  onSavePurchase: (req: PurchaseEnquiry) => Promise<void> | void;
  onSaveGeneralEnquiry: (req: PropertyEnquiry) => Promise<void> | void;
  onSuccessComplete?: () => void;
}

const SHORT_STAY_DURATIONS = ['Nightly', 'Weekly', 'Monthly', 'Other duration'];
const LONG_TERM_DURATIONS = ['One year', 'Two years', 'Three years', 'Other agreed duration'];

export const CentralEnquiryForm: React.FC<CentralEnquiryFormProps> = ({
  initialType = 'inspection',
  initialProperty = null,
  initialProject = '',
  initialCategory = '',
  properties,
  locations,
  onSaveInspection,
  onSavePurchase,
  onSaveGeneralEnquiry,
  onSuccessComplete,
}) => {
  const [enquiryType, setEnquiryType] = useState<EnquiryFormType>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedType, setSubmittedType] = useState<EnquiryFormType | null>(null);

  // Common contact fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<
    'Phone Call' | 'WhatsApp' | 'Email'
  >('Phone Call');

  // Selected property or estate project context
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialProperty?.id || '');
  const [projectOrPropertyText, setProjectOrPropertyText] = useState(
    initialProject || (initialProperty ? `${initialProperty.title} (${initialProperty.referenceId})` : '')
  );

  // Inspection Request fields
  const [preferredInspectionDate, setPreferredInspectionDate] = useState('');
  const [alternativeDate, setAlternativeDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (9:00 AM – 11:30 AM)');
  const [attendeesCount, setAttendeesCount] = useState('');
  const [inspectionComments, setInspectionComments] = useState('');

  // Purchase Enquiry fields
  const [purchaseCategory, setPurchaseCategory] = useState<'Houses for Sale' | 'Land for Sale' | 'Estate Project'>(
    initialProperty?.intent === 'Land'
      ? 'Land for Sale'
      : initialProject
      ? 'Estate Project'
      : initialCategory === 'Land for Sale'
      ? 'Land for Sale'
      : 'Houses for Sale'
  );
  const [residentialAddress, setResidentialAddress] = useState('');
  const [preferredLocation, setPreferredLocation] = useState(
    initialProperty?.city ||
      (initialProject.includes('Ibusa')
        ? 'Ibusa, Delta State'
        : initialProject.includes('Asaba')
        ? 'Asaba, Delta State'
        : '')
  );
  const [intendedUse, setIntendedUse] = useState('Personal residence');
  const [purchaseTimeline, setPurchaseTimeline] = useState('Within 1 – 3 months');
  const [paymentArrangement, setPaymentArrangement] = useState('Open to Discussion');
  const [purchaseBudget, setPurchaseBudget] = useState('');
  // Purchase conditional fields
  const [preferredPlotSize, setPreferredPlotSize] = useState(initialProperty?.plotSize || '');
  const [intendedLandUse, setIntendedLandUse] = useState('Residential building');
  const [plotQuantityType, setPlotQuantityType] = useState<'Individual plot' | 'Multiple plots'>(
    'Individual plot'
  );
  const [preferredHouseType, setPreferredHouseType] = useState<string>(
    initialProperty?.propertyType && initialProperty.intent === 'Buy'
      ? initialProperty.propertyType
      : ''
  );
  const [bedroomPreference, setBedroomPreference] = useState(
    initialProperty?.bedrooms ? `${initialProperty.bedrooms} Bedrooms` : ''
  );
  const [additionalQuestions, setAdditionalQuestions] = useState('');

  // Rental Enquiry fields
  const [rentalCategory, setRentalCategory] = useState<RentalCategory>(
    initialProperty?.rentalCategory || 'Long-Term Rental'
  );
  const [rentalAccommodationType, setRentalAccommodationType] = useState<string>(
    initialProperty?.intent === 'Rent' ? initialProperty.propertyType : ''
  );
  const [rentalDuration, setRentalDuration] = useState(
    initialProperty?.rentalCategory === 'Short Stay' ? 'Nightly' : 'One year'
  );
  const [rentalBudget, setRentalBudget] = useState('');
  const [occupants, setOccupants] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [rentalRequests, setRentalRequests] = useState('');

  // Custom Property Request fields
  const [customCategory, setCustomCategory] = useState('House for Sale');
  const [customBudget, setCustomBudget] = useState('');
  const [customSizeOrHouseType, setCustomSizeOrHouseType] = useState('');
  const [customBedrooms, setCustomBedrooms] = useState('');
  const [customRentalDuration, setCustomRentalDuration] = useState('');
  const [customIntendedUse, setCustomIntendedUse] = useState('Personal residence');
  const [customTimeline, setCustomTimeline] = useState('1 – 3 months');
  const [customDescription, setCustomDescription] = useState('');

  // Sync external prop changes
  useEffect(() => {
    setEnquiryType(initialType);
    setSubmittedRef(null);
    setErrorMsg(null);
  }, [initialType]);

  useEffect(() => {
    if (initialProperty) {
      setSelectedPropertyId(initialProperty.id);
      setProjectOrPropertyText(`${initialProperty.title} (${initialProperty.referenceId})`);
      if (initialProperty.intent === 'Land') setPurchaseCategory('Land for Sale');
      else if (initialProperty.intent === 'Buy') setPurchaseCategory('Houses for Sale');
      if (initialProperty.intent === 'Rent') {
        setRentalAccommodationType(initialProperty.propertyType);
      }
      if (initialProperty.rentalCategory) {
        setRentalCategory(initialProperty.rentalCategory);
        setRentalDuration(
          initialProperty.rentalCategory === 'Short Stay' ? 'Nightly' : 'One year'
        );
      }
      if (initialProperty.city) setPreferredLocation(initialProperty.city);
    }
  }, [initialProperty]);

  useEffect(() => {
    if (initialProject) {
      setProjectOrPropertyText(initialProject);
      setPurchaseCategory('Estate Project');
      if (initialProject.toLowerCase().includes('ibusa')) {
        setPreferredLocation('Ibusa, Delta State');
      } else if (initialProject.toLowerCase().includes('asaba')) {
        setPreferredLocation('Asaba, Delta State');
      }
    }
  }, [initialProject]);

  // Keep duration options aligned when toggling short stay vs long term
  const handleRentalCategoryChange = (cat: RentalCategory) => {
    setRentalCategory(cat);
    if (cat === 'Short Stay') {
      setRentalDuration(SHORT_STAY_DURATIONS[0]);
    } else {
      setRentalDuration(LONG_TERM_DURATIONS[0]);
    }
  };

  const publishedProperties = properties.filter((p) => p.published);
  const selectedPropertyRecord = publishedProperties.find((p) => p.id === selectedPropertyId);

  const resetSubmissionState = () => {
    setSubmittedRef(null);
    setSubmittedType(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address or leave it blank.');
      return;
    }

    if (enquiryType === 'inspection') {
      if (!projectOrPropertyText.trim() && !selectedPropertyRecord) {
        setErrorMsg('Please select or specify the property or project you wish to inspect.');
        return;
      }
      if (!preferredInspectionDate) {
        setErrorMsg('Please choose your preferred inspection date.');
        return;
      }
      if (!preferredTimeSlot) {
        setErrorMsg('Please choose your preferred inspection time.');
        return;
      }
    }

    if (enquiryType === 'rental') {
      if (!rentalDuration) {
        setErrorMsg('Please select your preferred rental duration.');
        return;
      }
      if (!preferredLocation.trim()) {
        setErrorMsg('Please select or enter your preferred location.');
        return;
      }
      if (!rentalBudget.trim()) {
        setErrorMsg('Please enter or select your budget range.');
        return;
      }
    }

    if (enquiryType === 'custom') {
      if (!preferredLocation.trim()) {
        setErrorMsg('Please select or enter your preferred location.');
        return;
      }
      if (!customBudget.trim()) {
        setErrorMsg('Please provide your budget range.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const nowIso = new Date().toISOString();

      if (enquiryType === 'inspection') {
        const targetTitle =
          selectedPropertyRecord?.title || projectOrPropertyText.trim() || 'General Site Inspection';
        const targetLocation =
          selectedPropertyRecord?.location ||
          (projectOrPropertyText.includes('Phase 2') ? 'Ibusa, Delta State' : '');

        const result = await submitEnquiryToAppsScript({
          type: 'inspection',
          fullName: fullName.trim(),
          phone: phoneNumber.trim(),
          whatsapp: whatsappNumber.trim(),
          email: email.trim(),
          preferredContactMethod,
          propertyOrProject: projectOrPropertyText.trim() || targetTitle,
          preferredInspectionDate,
          alternativeDate,
          preferredTime: preferredTimeSlot,
          attendeesCount,
          comments: inspectionComments.trim(),
        });

        if (!result.ok || !result.reference) {
          setErrorMsg(
            result.error || 'Unable to submit your inspection request. Please try again.'
          );
          return;
        }

        const inspReq: InspectionRequest = {
          id: `insp-${Date.now()}`,
          referenceId: result.reference,
          propertyId: selectedPropertyRecord?.id || 'general',
          propertyTitle: targetTitle,
          propertyLocation: targetLocation,
          propertyCategory: selectedPropertyRecord?.propertyType || undefined,
          enquiryType:
            selectedPropertyRecord?.intent === 'Land'
              ? 'Land'
              : selectedPropertyRecord?.intent === 'Rent'
              ? 'Rental'
              : projectOrPropertyText.includes('Phase')
              ? 'Estate Project'
              : 'Purchase',
          projectInterest: projectOrPropertyText.trim() || undefined,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim() || undefined,
          preferredContactMethod,
          preferredDate: preferredInspectionDate,
          alternativeDate: alternativeDate || undefined,
          preferredTimeSlot,
          attendeesCount: attendeesCount || undefined,
          questions: inspectionComments.trim() || undefined,
          status: 'Pending',
          createdAt: nowIso,
        };

        await Promise.resolve(onSaveInspection(inspReq));
        setSubmittedRef(result.reference);
        setSubmittedType('inspection');
        if (onSuccessComplete) onSuccessComplete();
      } else if (enquiryType === 'purchase') {
        const isLand = purchaseCategory === 'Land for Sale';
        const selectedPropText =
          selectedPropertyRecord?.title
            ? `${selectedPropertyRecord.title} (${selectedPropertyRecord.referenceId})`
            : projectOrPropertyText.trim();

        const result = await submitEnquiryToAppsScript(
          isLand
            ? {
                type: 'land',
                fullName: fullName.trim(),
                phone: phoneNumber.trim(),
                whatsapp: whatsappNumber.trim(),
                email: email.trim(),
                preferredContactMethod,
                selectedProperty: selectedPropText,
                preferredLocation: selectedPropertyRecord?.location || preferredLocation.trim(),
                residentialAddress: residentialAddress.trim(),
                preferredPlotSize: preferredPlotSize.trim(),
                plotQuantity: plotQuantityType,
                intendedLandUse,
                intendedUse,
                purchaseTimeline,
                preferredInspectionDate,
                paymentPreference: paymentArrangement,
                budget: purchaseBudget.trim(),
                additionalQuestions: additionalQuestions.trim(),
              }
            : {
                type: 'purchase',
                fullName: fullName.trim(),
                phone: phoneNumber.trim(),
                whatsapp: whatsappNumber.trim(),
                email: email.trim(),
                preferredContactMethod,
                propertyCategory: purchaseCategory,
                selectedProperty: selectedPropText,
                preferredLocation: selectedPropertyRecord?.location || preferredLocation.trim(),
                residentialAddress: residentialAddress.trim(),
                preferredHouseType,
                bedroomPreference,
                intendedUse,
                purchaseTimeline,
                preferredInspectionDate,
                paymentPreference: paymentArrangement,
                budget: purchaseBudget.trim(),
                additionalQuestions: additionalQuestions.trim(),
              }
        );

        if (!result.ok || !result.reference) {
          setErrorMsg(
            result.error || 'Unable to submit your purchase enquiry. Please try again.'
          );
          return;
        }

        const purchaseReq: PurchaseEnquiry = {
          id: `pur-${Date.now()}`,
          referenceId: result.reference,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim() || undefined,
          residentialAddress: residentialAddress.trim() || undefined,
          preferredContactMethod,
          propertyId: selectedPropertyRecord?.id || 'general-purchase',
          propertyTitle: selectedPropertyRecord?.title || projectOrPropertyText.trim() || '',
          propertyReference: selectedPropertyRecord?.referenceId || '',
          propertyCategory: purchaseCategory,
          propertyLocation: selectedPropertyRecord?.location || preferredLocation.trim(),
          propertyPrice: selectedPropertyRecord?.priceText,
          intendedUse,
          purchaseTimeline,
          paymentArrangement,
          budget: purchaseBudget.trim() || undefined,
          preferredPlotSize: isLand && preferredPlotSize.trim() ? preferredPlotSize.trim() : undefined,
          intendedLandUse: isLand ? intendedLandUse : undefined,
          plotQuantityType: isLand ? plotQuantityType : undefined,
          preferredHouseType:
            purchaseCategory === 'Houses for Sale' && preferredHouseType
              ? preferredHouseType
              : undefined,
          bedroomPreference:
            purchaseCategory === 'Houses for Sale' && bedroomPreference
              ? bedroomPreference
              : undefined,
          preferredInspectionDate: preferredInspectionDate || undefined,
          preferredTime: preferredInspectionDate ? preferredTimeSlot : undefined,
          additionalComments: additionalQuestions.trim() || undefined,
          consentGiven: true,
          status: 'New',
          createdAt: nowIso,
        };

        await Promise.resolve(onSavePurchase(purchaseReq));
        setSubmittedRef(result.reference);
        setSubmittedType('purchase');
        if (onSuccessComplete) onSuccessComplete();
      } else if (enquiryType === 'rental') {
        const selectedPropText =
          selectedPropertyRecord?.title
            ? `${selectedPropertyRecord.title} (${selectedPropertyRecord.referenceId})`
            : projectOrPropertyText.trim();

        const result = await submitEnquiryToAppsScript({
          type: 'rental',
          fullName: fullName.trim(),
          phone: phoneNumber.trim(),
          whatsapp: whatsappNumber.trim(),
          email: email.trim(),
          preferredContactMethod,
          rentalCategory,
          rentalDuration,
          preferredLocation: preferredLocation.trim(),
          budget: rentalBudget.trim(),
          selectedProperty: selectedPropText,
          accommodationType: selectedPropertyRecord?.propertyType || rentalAccommodationType,
          bedrooms: bedroomPreference,
          occupants: occupants.trim(),
          checkInDate: rentalCategory === 'Short Stay' ? checkInDate : '',
          checkOutDate: rentalCategory === 'Short Stay' ? checkOutDate : '',
          moveInDate: rentalCategory === 'Long-Term Rental' ? moveInDate : '',
          additionalRequests: rentalRequests.trim(),
        });

        if (!result.ok || !result.reference) {
          setErrorMsg(
            result.error || 'Unable to submit your rental enquiry. Please try again.'
          );
          return;
        }

        const rentalReq: PropertyEnquiry = {
          id: `rent-${Date.now()}`,
          referenceId: result.reference,
          enquiryCategory: 'rental',
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim() || undefined,
          preferredContactMethod,
          lookingFor: `Rental — ${rentalCategory}`,
          preferredLocation: preferredLocation.trim(),
          propertyType: selectedPropertyRecord?.propertyType || rentalAccommodationType,
          budgetRangeText: rentalBudget.trim(),
          bedrooms: bedroomPreference || undefined,
          preferredPaymentPlan: 'Open to Discussion',
          purpose: `${rentalCategory} (${rentalDuration})`,
          idealPropertyDescription: rentalRequests.trim(),
          additionalRequirements: rentalRequests.trim(),
          preferredInspectionDate: preferredInspectionDate || undefined,
          associatedPropertyId: selectedPropertyRecord?.id,
          associatedPropertyTitle:
            selectedPropertyRecord?.title || projectOrPropertyText.trim() || undefined,
          rentalType: rentalCategory,
          requestedDuration: rentalDuration,
          occupants: occupants.trim() || undefined,
          checkInDate: rentalCategory === 'Short Stay' ? checkInDate || undefined : undefined,
          checkOutDate: rentalCategory === 'Short Stay' ? checkOutDate || undefined : undefined,
          moveInDate: rentalCategory === 'Long-Term Rental' ? moveInDate || undefined : undefined,
          consentGiven: true,
          createdAt: nowIso,
          status: 'New',
        };

        await Promise.resolve(onSaveGeneralEnquiry(rentalReq));
        setSubmittedRef(result.reference);
        setSubmittedType('rental');
        if (onSuccessComplete) onSuccessComplete();
      } else {
        const result = await submitEnquiryToAppsScript({
          type: 'custom',
          fullName: fullName.trim(),
          phone: phoneNumber.trim(),
          whatsapp: whatsappNumber.trim(),
          email: email.trim(),
          preferredContactMethod,
          propertyCategory: customCategory,
          preferredLocation: preferredLocation.trim(),
          budget: customBudget.trim(),
          propertyTypeOrLandSize: customSizeOrHouseType.trim(),
          bedrooms: !customCategory.includes('Land') ? customBedrooms : '',
          requestedRentalDuration: customCategory.includes('Rental')
            ? customRentalDuration.trim()
            : '',
          intendedUse: customIntendedUse,
          expectedTimeline: customTimeline,
          description: customDescription.trim(),
        });

        if (!result.ok || !result.reference) {
          setErrorMsg(
            result.error || 'Unable to submit your property request. Please try again.'
          );
          return;
        }

        const customReq: PropertyEnquiry = {
          id: `req-${Date.now()}`,
          referenceId: result.reference,
          enquiryCategory: 'custom',
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim() || undefined,
          preferredContactMethod,
          lookingFor: customCategory,
          preferredLocation: preferredLocation.trim(),
          propertyType: customSizeOrHouseType.trim(),
          budgetRangeText: customBudget.trim(),
          bedrooms: !customCategory.includes('Land') ? customBedrooms || undefined : undefined,
          plotSize: customCategory.includes('Land')
            ? customSizeOrHouseType.trim() || undefined
            : undefined,
          requestedDuration: customCategory.includes('Rental')
            ? customRentalDuration.trim() || undefined
            : undefined,
          preferredPaymentPlan: 'Open to Discussion',
          purpose: customIntendedUse,
          preferredTimeline: customTimeline,
          idealPropertyDescription: customDescription.trim(),
          consentGiven: true,
          createdAt: nowIso,
          status: 'New',
        };

        await Promise.resolve(onSaveGeneralEnquiry(customReq));
        setSubmittedRef(result.reference);
        setSubmittedType('custom');
        if (onSuccessComplete) onSuccessComplete();
      }
    } catch {
      setErrorMsg(
        'Unable to submit your enquiry at this moment. Your entered details have been preserved — please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRef && submittedType) {
    const confirmationMessage =
      submittedType === 'inspection'
        ? 'Your inspection request has been received. Our team will review the schedule and contact you to confirm an available appointment.'
        : submittedType === 'purchase'
        ? 'Your property enquiry has been received. Our team will review your request and contact you using your preferred contact method.'
        : submittedType === 'rental'
        ? 'Your rental enquiry has been received. Our team will check availability for your requested duration and contact you using your preferred contact method.'
        : 'Your property request has been received. Our team will review your requirements and contact you if a suitable option is identified.';

    return (
      <div className="bg-[#E9F0EB] border border-[#102F2B]/15 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#102F2B] text-[#D6B779] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D5147] bg-white px-3 py-1 rounded-md border border-[#102F2B]/10 inline-block">
            Reference: {submittedRef}
          </span>
          <h3 className="font-serif-display text-2xl font-bold text-[#102F2B]">
            Submission Confirmed
          </h3>
          <p className="text-sm text-[#202824] leading-relaxed">{confirmationMessage}</p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={resetSubmissionState}
            className="px-5 py-2.5 rounded-lg bg-[#102F2B] hover:bg-[#1D5147] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  const enquiryTabs: { id: EnquiryFormType; label: string; icon: React.ReactNode }[] = [
    { id: 'inspection', label: 'Inspection Request', icon: <Calendar className="w-4 h-4" /> },
    { id: 'purchase', label: 'Purchase Enquiry', icon: <Home className="w-4 h-4" /> },
    { id: 'rental', label: 'Rental Enquiry', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'custom', label: 'Custom Property Request', icon: <Search className="w-4 h-4" /> },
  ];

  const rentalDurationOptions =
    rentalCategory === 'Short Stay' ? SHORT_STAY_DURATIONS : LONG_TERM_DURATIONS;

  return (
    <div className="space-y-6">
      {/* Interactive Enquiry Type Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#69736D] mb-2.5">
          Select Enquiry Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {enquiryTabs.map((tab) => {
            const active = enquiryType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setEnquiryType(tab.id);
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-left ${
                  active
                    ? 'bg-[#102F2B] text-white border-[#102F2B] shadow-sm'
                    : 'bg-[#F5F3ED] text-[#202824] border-[#102F2B]/10 hover:bg-[#E9F0EB]'
                }`}
              >
                <span className={active ? 'text-[#D6B779]' : 'text-[#1D5147]'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {/* Shared Customer Contact Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#202824] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202824] mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +234..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202824] mb-1.5">
              WhatsApp Number (Optional — if different)
            </label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Optional WhatsApp number"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202824] mb-1.5">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#202824] mb-1.5">
              Preferred Contact Method *
            </label>
            <div className="flex flex-wrap gap-3">
              {(['Phone Call', 'WhatsApp', 'Email'] as const).map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                    preferredContactMethod === method
                      ? 'bg-[#E9F0EB] border-[#102F2B] text-[#102F2B] font-semibold'
                      : 'bg-white border-[#102F2B]/15 text-[#202824]'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredContactMethod"
                    value={method}
                    checked={preferredContactMethod === method}
                    onChange={() => setPreferredContactMethod(method)}
                    className="accent-[#102F2B]"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 1. INSPECTION REQUEST FIELDS */}
        {enquiryType === 'inspection' && (
          <div className="space-y-4 pt-3 border-t border-[#102F2B]/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Property or Estate Project of Interest *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedPropertyId(val);
                      const match = publishedProperties.find((p) => p.id === val);
                      if (match) {
                        setProjectOrPropertyText(`${match.title} (${match.referenceId})`);
                      } else if (val === 'phase-1') {
                        setProjectOrPropertyText('King Zion Estate Phase 1 — Asaba');
                      } else if (val === 'phase-2') {
                        setProjectOrPropertyText('King Zion Estate Phase 2 — Ibusa');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                  >
                    <option value="">Select listing or estate project...</option>
                    <option value="phase-1">King Zion Estate Phase 1 — Asaba</option>
                    <option value="phase-2">King Zion Estate Phase 2 — Ibusa</option>
                    {publishedProperties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.referenceId})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={projectOrPropertyText}
                    onChange={(e) => setProjectOrPropertyText(e.target.value)}
                    placeholder="Or type property / project name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Inspection Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredInspectionDate}
                  onChange={(e) => setPreferredInspectionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Time *
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Morning (9:00 AM – 11:30 AM)">Morning (9:00 AM – 11:30 AM)</option>
                  <option value="Midday (12:00 PM – 2:30 PM)">Midday (12:00 PM – 2:30 PM)</option>
                  <option value="Afternoon (3:00 PM – 5:00 PM)">Afternoon (3:00 PM – 5:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Alternative Date (Optional)
                </label>
                <input
                  type="date"
                  value={alternativeDate}
                  onChange={(e) => setAlternativeDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Number of Attendees (Optional)
                </label>
                <select
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="">Not specified (Optional)</option>
                  <option value="1 person">1 person</option>
                  <option value="2 people">2 people</option>
                  <option value="3–4 people">3–4 people</option>
                  <option value="Representative on my behalf">Representative on my behalf</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                Questions or Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={inspectionComments}
                onChange={(e) => setInspectionComments(e.target.value)}
                placeholder="Any specific details or questions ahead of the site visit..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
              />
            </div>

            <p className="text-xs text-[#69736D] bg-[#F5F3ED] p-3 rounded-lg border border-[#102F2B]/10">
              Note: Submitting an inspection request does not guarantee an appointment. Our team will review the schedule and contact you to confirm availability.
            </p>
          </div>
        )}

        {/* 2. PURCHASE ENQUIRY FIELDS */}
        {enquiryType === 'purchase' && (
          <div className="space-y-4 pt-3 border-t border-[#102F2B]/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Property Category *
                </label>
                <select
                  value={purchaseCategory}
                  onChange={(e) =>
                    setPurchaseCategory(
                      e.target.value as 'Houses for Sale' | 'Land for Sale' | 'Estate Project'
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Houses for Sale">Houses for Sale</option>
                  <option value="Land for Sale">Land for Sale</option>
                  <option value="Estate Project">Estate Project (Phase 1 / Phase 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Selected Property / Project Reference
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedPropertyId(val);
                    const match = publishedProperties.find((p) => p.id === val);
                    if (match) setProjectOrPropertyText(`${match.title} (${match.referenceId})`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="">General purchase enquiry</option>
                  {publishedProperties
                    .filter((p) => p.intent !== 'Rent')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.referenceId})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Location (Optional)
                </label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Asaba, Ibusa"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Residential Address (Optional)
                </label>
                <input
                  type="text"
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  placeholder="Optional city or address"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              {/* Conditional House Fields */}
              {purchaseCategory === 'Houses for Sale' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Preferred House Type (Optional)
                    </label>
                    <select
                      value={preferredHouseType}
                      onChange={(e) => setPreferredHouseType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                    >
                      <option value="">Select house type (optional)...</option>
                      <option value="Detached Duplex">Detached Duplex</option>
                      <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
                      <option value="Terrace House">Terrace House</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Any House Type">Open to Options</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Bedroom Preference (Optional)
                    </label>
                    <select
                      value={bedroomPreference}
                      onChange={(e) => setBedroomPreference(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                    >
                      <option value="">Select bedrooms (optional)...</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 Bedrooms">2 Bedrooms</option>
                      <option value="3 Bedrooms">3 Bedrooms</option>
                      <option value="4 Bedrooms">4 Bedrooms</option>
                      <option value="5+ Bedrooms">5+ Bedrooms</option>
                    </select>
                  </div>
                </>
              )}

              {/* Conditional Land Fields */}
              {purchaseCategory === 'Land for Sale' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Preferred Plot Size (Optional)
                    </label>
                    <input
                      type="text"
                      value={preferredPlotSize}
                      onChange={(e) => setPreferredPlotSize(e.target.value)}
                      placeholder="e.g. 50 ft × 100 ft or 930 sqm"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Plot Quantity (Optional)
                    </label>
                    <div className="flex gap-3">
                      {(['Individual plot', 'Multiple plots'] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-xs cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="plotQuantityType"
                            checked={plotQuantityType === opt}
                            onChange={() => setPlotQuantityType(opt)}
                            className="accent-[#102F2B]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Intended Land Use (Optional)
                    </label>
                    <select
                      value={intendedLandUse}
                      onChange={(e) => setIntendedLandUse(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                    >
                      <option value="Residential building">Residential building</option>
                      <option value="Land banking / investment">Land banking / investment</option>
                      <option value="Commercial development">Commercial development</option>
                      <option value="Mixed use / other">Mixed use / other</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Intended Use (Optional)
                </label>
                <select
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Personal residence">Personal residence</option>
                  <option value="Investment">Investment</option>
                  <option value="Family use">Family use</option>
                  <option value="Commercial use">Commercial use</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Purchase Timeline (Optional)
                </label>
                <select
                  value={purchaseTimeline}
                  onChange={(e) => setPurchaseTimeline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 1 – 3 months">Within 1 – 3 months</option>
                  <option value="3 – 6 months">3 – 6 months</option>
                  <option value="Exploring options">Exploring options</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Inspection Date (Optional)
                </label>
                <input
                  type="date"
                  value={preferredInspectionDate}
                  onChange={(e) => setPreferredInspectionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Payment Preference (Optional)
                </label>
                <select
                  value={paymentArrangement}
                  onChange={(e) => setPaymentArrangement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Open to Discussion">Open to Discussion</option>
                  <option value="Outright Payment">Outright Payment</option>
                  <option value="Enquire About Milestone Plan">Enquire About Payment Terms</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Budget (₦) (Optional)
                </label>
                <input
                  type="text"
                  value={purchaseBudget}
                  onChange={(e) => setPurchaseBudget(e.target.value)}
                  placeholder="e.g. ₦45,000,000 – ₦90,000,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                Additional Questions (Optional)
              </label>
              <textarea
                rows={3}
                value={additionalQuestions}
                onChange={(e) => setAdditionalQuestions(e.target.value)}
                placeholder="Ask about availability, documentation, or viewing arrangements..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
              />
            </div>
          </div>
        )}

        {/* 3. RENTAL ENQUIRY FIELDS */}
        {enquiryType === 'rental' && (
          <div className="space-y-4 pt-3 border-t border-[#102F2B]/10">
            <div>
              <label className="block text-xs font-semibold text-[#202824] mb-2">
                What type of rental are you interested in? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['Short Stay', 'Long-Term Rental'] as RentalCategory[]).map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                      rentalCategory === cat
                        ? 'bg-[#E9F0EB] border-[#102F2B] text-[#102F2B] font-semibold'
                        : 'bg-white border-[#102F2B]/20 text-[#202824]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rentalCategory"
                      checked={rentalCategory === cat}
                      onChange={() => handleRentalCategoryChange(cat)}
                      className="accent-[#102F2B]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Rental Duration *
                </label>
                <select
                  value={rentalDuration}
                  onChange={(e) => setRentalDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  {rentalDurationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Location *
                </label>
                <input
                  type="text"
                  required
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Asaba, Ibusa"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Budget Range (₦) *
                </label>
                <input
                  type="text"
                  required
                  value={rentalBudget}
                  onChange={(e) => setRentalBudget(e.target.value)}
                  placeholder={
                    rentalCategory === 'Short Stay'
                      ? 'e.g. ₦100,000 – ₦200,000 per night'
                      : 'e.g. ₦1,500,000 – ₦5,000,000 per year'
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Property Reference (Optional)
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedPropertyId(val);
                    const match = publishedProperties.find((p) => p.id === val);
                    if (match) setProjectOrPropertyText(`${match.title} (${match.referenceId})`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="">General rental enquiry</option>
                  {publishedProperties
                    .filter((p) => p.intent === 'Rent')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.referenceId})
                      </option>
                    ))}
                </select>
              </div>

              {rentalCategory === 'Short Stay' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Check-In Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                      Check-Out Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                    Preferred Move-In Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Number of Occupants (Optional)
                </label>
                <input
                  type="text"
                  value={occupants}
                  onChange={(e) => setOccupants(e.target.value)}
                  placeholder="e.g. 2 adults"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Accommodation Type (Optional)
                </label>
                <select
                  value={rentalAccommodationType}
                  onChange={(e) => setRentalAccommodationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="">Select accommodation type (optional)...</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Short-Stay Apartment">Short-Stay Apartment</option>
                  <option value="Detached Duplex">Detached Duplex</option>
                  <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
                  <option value="Terrace House">Terrace House</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Studio / Mini Flat">Studio / Mini Flat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Number of Bedrooms (Optional)
                </label>
                <select
                  value={bedroomPreference}
                  onChange={(e) => setBedroomPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="">Select bedrooms (optional)...</option>
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2 Bedrooms">2 Bedrooms</option>
                  <option value="3 Bedrooms">3 Bedrooms</option>
                  <option value="4+ Bedrooms">4+ Bedrooms</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                Additional Requests (Optional)
              </label>
              <textarea
                rows={3}
                value={rentalRequests}
                onChange={(e) => setRentalRequests(e.target.value)}
                placeholder="Share any specific preferences or questions regarding the rental period..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
              />
            </div>

            <p className="text-xs text-[#69736D] bg-[#F5F3ED] p-3 rounded-lg border border-[#102F2B]/10">
              Note: Rental rates, billing cycles, and availability for your requested duration depend on the specific property and will be confirmed directly by our team.
            </p>
          </div>
        )}

        {/* 4. CUSTOM PROPERTY REQUEST FIELDS */}
        {enquiryType === 'custom' && (
          <div className="space-y-4 pt-3 border-t border-[#102F2B]/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Property Category *
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="House for Sale">House for Sale</option>
                  <option value="Land for Sale">Land for Sale</option>
                  <option value="Short-Stay Rental">Short-Stay Rental</option>
                  <option value="Long-Term Rental">Long-Term Rental</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Preferred Location *
                </label>
                <input
                  type="text"
                  required
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Asaba, Ibusa, or preferred area"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Budget Range (₦) *
                </label>
                <input
                  type="text"
                  required
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="e.g. ₦30,000,000 – ₦60,000,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  {customCategory.includes('Land')
                    ? 'Preferred Land Size (Optional)'
                    : 'House / Apartment Type (Optional)'}
                </label>
                <input
                  type="text"
                  value={customSizeOrHouseType}
                  onChange={(e) => setCustomSizeOrHouseType(e.target.value)}
                  placeholder={
                    customCategory.includes('Land')
                      ? 'e.g. 1 plot (465 sqm) or 2 plots'
                      : 'e.g. Detached Duplex, Bungalow, Apartment'
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                />
              </div>

              {!customCategory.includes('Land') && (
                <div>
                  <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                    Bedroom Requirement (Optional)
                  </label>
                  <select
                    value={customBedrooms}
                    onChange={(e) => setCustomBedrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                  >
                    <option value="">Any</option>
                    <option value="1–2 Bedrooms">1–2 Bedrooms</option>
                    <option value="3 Bedrooms">3 Bedrooms</option>
                    <option value="4 Bedrooms">4 Bedrooms</option>
                    <option value="5+ Bedrooms">5+ Bedrooms</option>
                  </select>
                </div>
              )}

              {customCategory.includes('Rental') && (
                <div>
                  <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                    Requested Rental Duration (Optional)
                  </label>
                  <input
                    type="text"
                    value={customRentalDuration}
                    onChange={(e) => setCustomRentalDuration(e.target.value)}
                    placeholder="e.g. Nightly, Monthly, 1 year, 2 years"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Intended Use (Optional)
                </label>
                <select
                  value={customIntendedUse}
                  onChange={(e) => setCustomIntendedUse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Personal residence">Personal residence</option>
                  <option value="Investment">Investment</option>
                  <option value="Family use">Family use</option>
                  <option value="Commercial use">Commercial use</option>
                  <option value="Short-stay / Hospitality">Short-stay / Hospitality</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                  Expected Timeline (Optional)
                </label>
                <select
                  value={customTimeline}
                  onChange={(e) => setCustomTimeline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="1 – 3 months">1 – 3 months</option>
                  <option value="3 – 6 months">3 – 6 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202824] mb-1.5">
                Additional Description (Optional)
              </label>
              <textarea
                rows={3}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe what you are looking for..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#102F2B]/20 bg-white text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#B58C48]"
              />
            </div>

            <p className="text-xs text-[#69736D] bg-[#F5F3ED] p-3 rounded-lg border border-[#102F2B]/10 flex items-start gap-2">
              <ClipboardList className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
              <span>
                Submitting a custom request does not guarantee immediate availability. Our team will review your requirements and contact you if a suitable option is identified.
              </span>
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#B58C48] hover:bg-[#967139] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>
              {isSubmitting
                ? 'Submitting...'
                : enquiryType === 'inspection'
                ? 'Submit Inspection Request'
                : enquiryType === 'purchase'
                ? 'Submit Purchase Enquiry'
                : enquiryType === 'rental'
                ? 'Submit Rental Enquiry'
                : 'Submit Property Request'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

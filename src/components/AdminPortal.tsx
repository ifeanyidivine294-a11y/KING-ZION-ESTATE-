import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit,
  FileText,
  HelpCircle,
  Home,
  MessageSquareQuote,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  BillingPeriod,
  CompanySettings,
  FAQItem,
  InspectionRequest,
  LeadershipMember,
  Property,
  PropertyEnquiry,
  PurchaseEnquiry,
  RentalCategory,
  RequestStatus,
  Testimonial,
} from '../types';
import { NIGERIAN_ASSETS } from '../assets/imageManifest';
import { formatDate, formatNaira } from '../utils/formatters';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSaveProperties: (properties: Property[]) => void;
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  faqs: FAQItem[];
  onSaveFaqs: (faqs: FAQItem[]) => void;
  leadership: LeadershipMember[];
  onSaveLeadership: (leadership: LeadershipMember[]) => void;
  testimonials: Testimonial[];
  onSaveTestimonials: (testimonials: Testimonial[]) => void;
  enquiries: PropertyEnquiry[];
  onSaveEnquiries: (enquiries: PropertyEnquiry[]) => void;
  purchaseEnquiries: PurchaseEnquiry[];
  onSavePurchaseEnquiries: (purchases: PurchaseEnquiry[]) => void;
  inspections: InspectionRequest[];
  onSaveInspections: (inspections: InspectionRequest[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  properties,
  onSaveProperties,
  settings,
  onSaveSettings,
  faqs,
  onSaveFaqs,
  leadership,
  onSaveLeadership,
  testimonials,
  onSaveTestimonials,
  enquiries,
  onSaveEnquiries,
  purchaseEnquiries,
  onSavePurchaseEnquiries,
  inspections,
  onSaveInspections,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'requests'
    | 'purchases'
    | 'inspections'
    | 'properties'
    | 'settings'
    | 'leadership'
    | 'faqs'
    | 'testimonials'
  >('requests');

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);

  const [formSettings, setFormSettings] = useState<CompanySettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('All');

  // New Testimonial state
  const [newTestimonialName, setNewTestimonialName] = useState('');
  const [newTestimonialRole, setNewTestimonialRole] = useState('');
  const [newTestimonialLocation, setNewTestimonialLocation] = useState('');
  const [newTestimonialContent, setNewTestimonialContent] = useState('');

  if (!isOpen) return null;

  const handleUpdateEnquiryStatus = (id: string, newStatus: RequestStatus) => {
    onSaveEnquiries(enquiries.map((enq) => (enq.id === id ? { ...enq, status: newStatus } : enq)));
  };

  const handleUpdatePurchaseStatus = (id: string, newStatus: RequestStatus) => {
    onSavePurchaseEnquiries(
      purchaseEnquiries.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleAddEnquiryNote = (id: string, noteText: string) => {
    if (!noteText.trim()) return;
    onSaveEnquiries(
      enquiries.map((enq) =>
        enq.id === id
          ? {
              ...enq,
              internalNotes: [
                ...(enq.internalNotes || []),
                `${new Date().toLocaleDateString()}: ${noteText}`,
              ],
            }
          : enq
      )
    );
  };

  const handleTogglePublishProperty = (id: string) => {
    onSaveProperties(properties.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  };

  const handleDeleteProperty = (id: string) => {
    onSaveProperties(properties.filter((p) => p.id !== id));
  };

  const handleSavePropertyForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingProperty ? editingProperty.id : `kze-${Date.now()}`;
    const referenceId = editingProperty
      ? editingProperty.referenceId
      : `KZE-PROP-${Math.floor(100 + Math.random() * 900)}`;

    const title = formData.get('title') as string;
    const intent = formData.get('intent') as Property['intent'];
    const slug =
      editingProperty?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const imageChoice = (formData.get('image') as string) || NIGERIAN_ASSETS.housesDuplex;
    const rentalCategoryVal = (formData.get('rentalCategory') as RentalCategory) || undefined;
    const billingPeriodVal = (formData.get('billingPeriod') as BillingPeriod) || undefined;
    const minimumDurationVal = (formData.get('minimumDuration') as string) || undefined;

    const newProp: Property = {
      id,
      referenceId,
      slug,
      title,
      location: formData.get('location') as string,
      city: (formData.get('location') as string).split(',')[0].trim(),
      state: 'Delta State',
      propertyType: formData.get('propertyType') as Property['propertyType'],
      intent,
      status: formData.get('status') as Property['status'],
      priceText: (formData.get('priceText') as string) || 'Price on enquiry',
      priceNumeric: Number(formData.get('priceNumeric')) || undefined,
      rentalCategory: intent === 'Rent' ? rentalCategoryVal : undefined,
      billingPeriod: intent === 'Rent' ? billingPeriodVal : undefined,
      minimumDuration: intent === 'Rent' ? minimumDurationVal : undefined,
      supportedDurations:
        intent === 'Rent'
          ? rentalCategoryVal === 'Short Stay'
            ? ['Nightly', 'Weekly', 'Monthly', 'Other duration']
            : ['One year', 'Two years', 'Three years', 'Other agreed duration']
          : undefined,
      bedrooms: Number(formData.get('bedrooms')) || undefined,
      bathrooms: Number(formData.get('bathrooms')) || undefined,
      plotSize: (formData.get('plotSize') as string) || undefined,
      buildingSize: (formData.get('buildingSize') as string) || undefined,
      featured: formData.get('featured') === 'on',
      image: imageChoice,
      gallery: [imageChoice],
      description: formData.get('description') as string,
      amenities: (formData.get('amenities') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      documentStatus: formData.get('documentStatus') as string,
      inspectionAvailable: true,
      published: editingProperty ? editingProperty.published : true,
      createdAt: editingProperty ? editingProperty.createdAt : new Date().toISOString(),
    };

    if (editingProperty) {
      onSaveProperties(properties.map((p) => (p.id === id ? newProp : p)));
    } else {
      onSaveProperties([newProp, ...properties]);
    }

    setEditingProperty(null);
    setIsCreatingProperty(false);
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialName.trim() || !newTestimonialContent.trim()) return;
    const item: Testimonial = {
      id: `test-${Date.now()}`,
      name: newTestimonialName.trim(),
      role: newTestimonialRole.trim() || 'Client',
      location: newTestimonialLocation.trim() || 'Delta State',
      propertyService: 'Verified Client Feedback',
      content: newTestimonialContent.trim(),
      verifiedClient: true,
    };
    onSaveTestimonials([item, ...testimonials]);
    setNewTestimonialName('');
    setNewTestimonialRole('');
    setNewTestimonialLocation('');
    setNewTestimonialContent('');
  };

  const filteredEnquiries =
    enquiryStatusFilter === 'All'
      ? enquiries
      : enquiries.filter((e) => e.status === enquiryStatusFilter);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col border border-[#102F2B]/15 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#102F2B] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Shield className="w-5 h-5 text-[#D6B779]" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold">
                KING ZION'S ESTATE — Private Staff & Admin Portal
              </h2>
              <p className="text-xs text-white/70">
                Manage Property Inventory, Purchase/Rental/Custom Enquiries, Inspections & Verified Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close Admin Portal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F5F3ED] border-b border-[#102F2B]/10 px-6 flex items-center gap-1.5 overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'requests'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Rentals & Custom ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'purchases'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Purchase Enquiries ({purchaseEnquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inspections'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Inspections ({inspections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Properties ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Contact & Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('leadership')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'leadership'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leadership</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'testimonials'
                ? 'border-[#102F2B] text-[#102F2B] bg-white'
                : 'border-transparent text-[#69736D] hover:text-[#102F2B]'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Testimonials ({testimonials.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* TAB 1: RENTAL & CUSTOM ENQUIRIES */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#102F2B]/10">
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                    Rental & Custom Property Requests
                  </h3>
                  <p className="text-xs text-[#69736D]">
                    Includes short-stay & long-term rental enquiries as well as custom property requests.
                  </p>
                </div>

                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-[#102F2B]/20 rounded-md bg-white text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Property Suggested">Property Suggested</option>
                  <option value="Inspection Requested">Inspection Requested</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="py-14 text-center text-[#69736D] text-xs">
                  No enquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiries.map((req) => (
                    <div
                      key={req.id}
                      className="border border-[#102F2B]/15 rounded-xl p-4 bg-[#F5F3ED]/50 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#102F2B] bg-white px-2 py-0.5 rounded border">
                            {req.referenceId}
                          </span>
                          <span className="text-xs font-bold text-[#202824]">{req.fullName}</span>
                          <span className="text-[11px] text-[#69736D]">
                            • {formatDate(req.createdAt)}
                          </span>
                        </div>

                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleUpdateEnquiryStatus(req.id, e.target.value as RequestStatus)
                          }
                          className="text-xs font-semibold px-2.5 py-1 rounded border bg-white text-[#102F2B]"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Property Suggested">Property Suggested</option>
                          <option value="Inspection Requested">Inspection Requested</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[#69736D] block">Phone / Contact Method:</span>
                          <span className="font-semibold text-[#202824]">{req.phoneNumber}</span>
                          <p className="text-[11px] text-[#1D5147]">{req.preferredContactMethod}</p>
                        </div>
                        <div>
                          <span className="text-[#69736D] block">Category & Location:</span>
                          <span className="font-semibold text-[#202824]">{req.lookingFor}</span>
                          <p className="text-[11px] text-[#69736D]">{req.preferredLocation}</p>
                        </div>
                        <div>
                          <span className="text-[#69736D] block">Budget / Duration:</span>
                          <span className="font-semibold text-[#102F2B]">{req.budgetRangeText}</span>
                          {req.requestedDuration && (
                            <p className="text-[11px] text-[#69736D]">
                              Duration: {req.requestedDuration}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="text-[#69736D] block">Reference / Dates:</span>
                          <span className="font-semibold text-[#202824]">
                            {req.associatedPropertyTitle || req.purpose}
                          </span>
                          {(req.checkInDate || req.moveInDate) && (
                            <p className="text-[11px] text-[#69736D]">
                              {req.checkInDate ? `${req.checkInDate} → ${req.checkOutDate || ''}` : `Move-in: ${req.moveInDate}`}
                            </p>
                          )}
                        </div>
                      </div>

                      {req.idealPropertyDescription && (
                        <div className="p-2.5 bg-white rounded-lg border text-xs text-[#202824]">
                          <strong className="text-[#102F2B]">Notes:</strong> {req.idealPropertyDescription}
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-[#69736D]">
                            Staff Notes ({req.internalNotes?.length || 0}):
                          </span>
                          {req.internalNotes?.map((note, i) => (
                            <p key={i} className="text-[11px] text-[#202824]">
                              • {note}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add staff note..."
                            id={`note-input-${req.id}`}
                            className="px-2.5 py-1 text-xs border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(
                                `note-input-${req.id}`
                              ) as HTMLInputElement;
                              if (input && input.value) {
                                handleAddEnquiryNote(req.id, input.value);
                                input.value = '';
                              }
                            }}
                            className="px-2.5 py-1 bg-[#102F2B] text-white rounded text-xs font-semibold"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PURCHASE ENQUIRIES */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#102F2B]/10">
                <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                  House & Land Purchase Enquiries
                </h3>
                <p className="text-xs text-[#69736D]">
                  Direct purchase enquiries submitted from house, land, estate project, and Contact forms.
                </p>
              </div>

              {purchaseEnquiries.length === 0 ? (
                <div className="py-14 text-center text-[#69736D] text-xs">
                  No purchase enquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {purchaseEnquiries.map((pur) => (
                    <div
                      key={pur.id}
                      className="border border-[#102F2B]/15 rounded-xl p-4 bg-[#F5F3ED]/40 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#102F2B] bg-white px-2 py-0.5 rounded border">
                            {pur.referenceId}
                          </span>
                          <span className="font-bold text-[#202824]">{pur.fullName}</span>
                          <span className="text-[#69736D]">• {formatDate(pur.createdAt)}</span>
                        </div>
                        <select
                          value={pur.status}
                          onChange={(e) =>
                            handleUpdatePurchaseStatus(pur.id, e.target.value as RequestStatus)
                          }
                          className="px-2.5 py-1 rounded border bg-white font-semibold text-[#102F2B]"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Inspection Requested">Inspection Requested</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-[#69736D] block">Target Property / Category:</span>
                          {pur.propertyTitle ? (
                            <>
                              <strong>{pur.propertyTitle}</strong> ({pur.propertyCategory})
                            </>
                          ) : (
                            <strong>{pur.propertyCategory}</strong>
                          )}
                        </div>
                        <div>
                          <span className="text-[#69736D] block">Phone / Preferred Contact:</span>
                          <strong>{pur.phoneNumber}</strong> • {pur.preferredContactMethod}
                        </div>
                        <div>
                          <span className="text-[#69736D] block">Use & Timeline:</span>
                          <strong>{pur.intendedUse}</strong> • {pur.purchaseTimeline}
                        </div>
                      </div>
                      {pur.additionalComments && (
                        <p className="bg-white p-2 rounded border text-[#202824]">
                          {pur.additionalComments}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INSPECTIONS */}
          {activeTab === 'inspections' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#102F2B]/10">
                <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                  Inspection Requests
                </h3>
                <p className="text-xs text-[#69736D]">
                  Review and update inspection schedule confirmations.
                </p>
              </div>

              {inspections.length === 0 ? (
                <div className="py-14 text-center text-[#69736D] text-xs">
                  No inspection requests submitted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-[#102F2B]/15">
                    <thead className="bg-[#F5F3ED] text-[#102F2B] uppercase font-bold border-b">
                      <tr>
                        <th className="p-3">Ref</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Property / Project</th>
                        <th className="p-3">Requested Date & Time</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {inspections.map((insp) => (
                        <tr key={insp.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-bold text-[#102F2B]">
                            {insp.referenceId}
                          </td>
                          <td className="p-3 font-semibold">{insp.fullName}</td>
                          <td className="p-3">
                            <span className="font-medium block">{insp.propertyTitle}</span>
                            <span className="text-[#69736D]">{insp.propertyLocation}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold block">{insp.preferredDate}</span>
                            <span className="text-[#69736D]">{insp.preferredTimeSlot}</span>
                          </td>
                          <td className="p-3">
                            <span>{insp.phoneNumber}</span>
                            <span className="block text-[#1D5147]">
                              {insp.preferredContactMethod || 'Phone'}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={insp.status}
                              onChange={(e) =>
                                onSaveInspections(
                                  inspections.map((item) =>
                                    item.id === insp.id
                                      ? { ...item, status: e.target.value as InspectionRequest['status'] }
                                      : item
                                  )
                                )
                              }
                              className="px-2 py-1 rounded border bg-white font-semibold text-[#102F2B]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MANAGE PROPERTIES */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#102F2B]/10">
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                    Manage Property Listings
                  </h3>
                  <p className="text-xs text-[#69736D]">
                    Only published records appear on the public Properties page and Featured carousel.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProperty(null);
                    setIsCreatingProperty(true);
                  }}
                  className="px-3.5 py-2 bg-[#102F2B] hover:bg-[#1D5147] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Property</span>
                </button>
              </div>

              {(isCreatingProperty || editingProperty) && (
                <div className="p-5 rounded-xl border border-[#102F2B] bg-[#F5F3ED] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-display text-base font-bold text-[#102F2B]">
                      {editingProperty
                        ? `Edit Property (${editingProperty.referenceId})`
                        : 'Add New Property'}
                    </h4>
                    <button
                      onClick={() => {
                        setEditingProperty(null);
                        setIsCreatingProperty(false);
                      }}
                      className="text-xs font-semibold text-[#69736D] hover:text-[#102F2B]"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSavePropertyForm} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Title *</label>
                        <input
                          type="text"
                          name="title"
                          required
                          defaultValue={editingProperty?.title || ''}
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Location *</label>
                        <input
                          type="text"
                          name="location"
                          required
                          defaultValue={editingProperty?.location || 'Asaba, Delta State'}
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Property Type *</label>
                        <select
                          name="propertyType"
                          defaultValue={editingProperty?.propertyType || 'Detached Duplex'}
                          className="w-full px-3 py-2 border rounded bg-white"
                        >
                          <option value="Detached Duplex">Detached Duplex</option>
                          <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
                          <option value="Terrace House">Terrace House</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Bungalow">Bungalow</option>
                          <option value="Residential Land">Residential Land</option>
                          <option value="Estate Development">Estate Development</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Intent (Tab Category)</label>
                        <select
                          name="intent"
                          defaultValue={editingProperty?.intent || 'Buy'}
                          className="w-full px-3 py-2 border rounded bg-white"
                        >
                          <option value="Buy">Buy (Houses for Sale)</option>
                          <option value="Land">Land (Land for Sale)</option>
                          <option value="Rent">Rent (Rentals)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Status</label>
                        <select
                          name="status"
                          defaultValue={editingProperty?.status || 'For Sale'}
                          className="w-full px-3 py-2 border rounded bg-white"
                        >
                          <option value="For Sale">For Sale</option>
                          <option value="For Rent">For Rent</option>
                          <option value="Land">Land</option>
                          <option value="Estate Project">Estate Project</option>
                          <option value="Under Offer">Under Offer</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Numeric Price (₦)</label>
                        <input
                          type="number"
                          name="priceNumeric"
                          defaultValue={editingProperty?.priceNumeric || ''}
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Display Price & Period</label>
                        <input
                          type="text"
                          name="priceText"
                          defaultValue={editingProperty?.priceText || 'Price on enquiry'}
                          placeholder="e.g. ₦4,500,000 per year"
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Rental Subcategory (if Rent)</label>
                        <select
                          name="rentalCategory"
                          defaultValue={editingProperty?.rentalCategory || 'Long-Term Rental'}
                          className="w-full px-3 py-2 border rounded bg-white"
                        >
                          <option value="Short Stay">Short Stay</option>
                          <option value="Long-Term Rental">Long-Term Rental</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Billing Period (if Rent)</label>
                        <select
                          name="billingPeriod"
                          defaultValue={editingProperty?.billingPeriod || 'per year'}
                          className="w-full px-3 py-2 border rounded bg-white"
                        >
                          <option value="per night">per night</option>
                          <option value="per week">per week</option>
                          <option value="per month">per month</option>
                          <option value="per year">per year</option>
                          <option value="per 2 years">per 2 years</option>
                          <option value="per 3 years">per 3 years</option>
                          <option value="other agreed duration">other agreed duration</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Bedrooms / Bathrooms</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            name="bedrooms"
                            defaultValue={editingProperty?.bedrooms || ''}
                            placeholder="Beds"
                            className="w-full px-3 py-2 border rounded bg-white"
                          />
                          <input
                            type="number"
                            name="bathrooms"
                            defaultValue={editingProperty?.bathrooms || ''}
                            placeholder="Baths"
                            className="w-full px-3 py-2 border rounded bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Plot / Floor Area</label>
                        <input
                          type="text"
                          name="plotSize"
                          defaultValue={editingProperty?.plotSize || ''}
                          placeholder="e.g. 465 sqm (50×100 ft)"
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Minimum Duration (Rent)</label>
                        <input
                          type="text"
                          name="minimumDuration"
                          defaultValue={editingProperty?.minimumDuration || ''}
                          placeholder="e.g. 2 Nights or 1 Year"
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">Image URL *</label>
                        <input
                          type="text"
                          name="image"
                          defaultValue={editingProperty?.image || NIGERIAN_ASSETS.housesDuplex}
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Documentation Note</label>
                        <input
                          type="text"
                          name="documentStatus"
                          defaultValue={
                            editingProperty?.documentStatus ||
                            'Available for review upon enquiry'
                          }
                          className="w-full px-3 py-2 border rounded bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Description</label>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={editingProperty?.description || ''}
                        className="w-full px-3 py-2 border rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Features (comma separated)</label>
                      <input
                        type="text"
                        name="amenities"
                        defaultValue={editingProperty?.amenities?.join(', ') || ''}
                        className="w-full px-3 py-2 border rounded bg-white"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        defaultChecked={editingProperty ? editingProperty.featured : true}
                        className="accent-[#102F2B]"
                      />
                      <span>Feature in Homepage Carousel</span>
                    </label>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProperty(null);
                          setIsCreatingProperty(false);
                        }}
                        className="px-4 py-2 border rounded font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#102F2B] text-white rounded font-semibold"
                      >
                        Save Property
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto border border-[#102F2B]/15 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F3ED] text-[#102F2B] uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Image</th>
                      <th className="p-3">Title & Location</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Published</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {properties.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-[#102F2B]">{p.referenceId}</td>
                        <td className="p-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-12 h-10 object-cover rounded border"
                          />
                        </td>
                        <td className="p-3">
                          <strong className="block">{p.title}</strong>
                          <span className="text-[#69736D]">{p.location}</span>
                        </td>
                        <td className="p-3 font-semibold text-[#102F2B]">
                          {p.priceText || formatNaira(p.priceNumeric)}
                        </td>
                        <td className="p-3">{p.status}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleTogglePublishProperty(p.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.published
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {p.published ? 'Published' : 'Draft / Hidden'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProperty(p);
                                setIsCreatingProperty(false);
                              }}
                              className="p-1.5 text-[#102F2B] hover:bg-gray-100 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COMPANY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="pb-3 border-b border-[#102F2B]/10">
                <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                  Verified Company Contact & Channels
                </h3>
                <p className="text-xs text-[#69736D]">
                  Leave any phone, WhatsApp, email, or social link blank if unverified — blank channels will not be displayed publicly.
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Company settings saved successfully.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formSettings.companyName}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, companyName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Motto</label>
                  <input
                    type="text"
                    value={formSettings.motto}
                    onChange={(e) => setFormSettings({ ...formSettings, motto: e.target.value })}
                    className="w-full px-3 py-2 border rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Confirmed Office Address</label>
                  <input
                    type="text"
                    value={formSettings.headOffice}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, headOffice: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Verified Phone Number</label>
                    <input
                      type="text"
                      value={formSettings.officialPhone}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, officialPhone: e.target.value })
                      }
                      placeholder="Leave empty if unconfirmed"
                      className="w-full px-3 py-2 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Verified WhatsApp Number</label>
                    <input
                      type="text"
                      value={formSettings.officialWhatsapp}
                      onChange={(e) =>
                        setFormSettings({ ...formSettings, officialWhatsapp: e.target.value })
                      }
                      placeholder="Leave empty if unconfirmed"
                      className="w-full px-3 py-2 border rounded bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Verified Email Address</label>
                  <input
                    type="email"
                    value={formSettings.officialEmail}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, officialEmail: e.target.value })
                    }
                    placeholder="Leave empty if unconfirmed"
                    className="w-full px-3 py-2 border rounded bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold mb-1">Facebook URL (Optional)</label>
                    <input
                      type="url"
                      value={formSettings.socialLinks?.facebook || ''}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          socialLinks: { ...formSettings.socialLinks, facebook: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Instagram URL (Optional)</label>
                    <input
                      type="url"
                      value={formSettings.socialLinks?.instagram || ''}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          socialLinks: { ...formSettings.socialLinks, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#102F2B] hover:bg-[#1D5147] text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: LEADERSHIP */}
          {activeTab === 'leadership' && (
            <div className="space-y-6 max-w-3xl">
              <div className="pb-3 border-b border-[#102F2B]/10">
                <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                  CEO & Property Coordinator Profiles
                </h3>
                <p className="text-xs text-[#69736D]">
                  Upload genuine approved portrait URLs and confirmed names/descriptions. Leave portrait blank to show the neutral labelled placeholder.
                </p>
              </div>

              <div className="space-y-4">
                {leadership.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border border-[#102F2B]/15 rounded-xl bg-[#F5F3ED]/40 space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            onSaveLeadership(
                              leadership.map((m) =>
                                m.id === member.id ? { ...m, name: e.target.value } : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Position</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) =>
                            onSaveLeadership(
                              leadership.map((m) =>
                                m.id === member.id ? { ...m, role: e.target.value } : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">
                          Approved Portrait Image URL (Blank = Placeholder)
                        </label>
                        <input
                          type="text"
                          value={member.portrait}
                          onChange={(e) =>
                            onSaveLeadership(
                              leadership.map((m) =>
                                m.id === member.id ? { ...m, portrait: e.target.value } : m
                              )
                            )
                          }
                          placeholder="Leave blank until official photograph is uploaded"
                          className="w-full px-3 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={member.quote}
                          onChange={(e) =>
                            onSaveLeadership(
                              leadership.map((m) =>
                                m.id === member.id ? { ...m, quote: e.target.value } : m
                              )
                            )
                          }
                          className="w-full px-3 py-1.5 border rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 max-w-3xl">
              <div className="pb-3 border-b border-[#102F2B]/10">
                <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">FAQs Editor</h3>
              </div>
              {faqs.map((faq, index) => (
                <div key={faq.id} className="p-3 border rounded-lg bg-[#F5F3ED]/40 space-y-2 text-xs">
                  <span className="font-bold text-[#102F2B]">Question #{index + 1}</span>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      onSaveFaqs(
                        faqs.map((f) => (f.id === faq.id ? { ...f, question: e.target.value } : f))
                      )
                    }
                    className="w-full px-3 py-1.5 border rounded bg-white font-medium"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) =>
                      onSaveFaqs(
                        faqs.map((f) => (f.id === faq.id ? { ...f, answer: e.target.value } : f))
                      )
                    }
                    className="w-full px-3 py-1.5 border rounded bg-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 8: VERIFIED TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-3xl">
              <div className="pb-3 border-b border-[#102F2B]/10">
                <h3 className="font-serif-display text-lg font-bold text-[#102F2B]">
                  Genuine Verified Client Testimonials
                </h3>
                <p className="text-xs text-[#69736D]">
                  Testimonials remain hidden on the public website until genuine client testimonials are added here.
                </p>
              </div>

              <form onSubmit={handleAddTestimonial} className="p-4 border rounded-xl bg-[#F5F3ED] space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Verified Client Name *"
                    value={newTestimonialName}
                    onChange={(e) => setNewTestimonialName(e.target.value)}
                    className="px-3 py-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Client Role / Context"
                    value={newTestimonialRole}
                    onChange={(e) => setNewTestimonialRole(e.target.value)}
                    className="px-3 py-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newTestimonialLocation}
                    onChange={(e) => setNewTestimonialLocation(e.target.value)}
                    className="px-3 py-2 border rounded bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Client feedback quote *"
                  value={newTestimonialContent}
                  onChange={(e) => setNewTestimonialContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#102F2B] text-white rounded font-semibold"
                >
                  Add Verified Testimonial
                </button>
              </form>

              {testimonials.length === 0 ? (
                <p className="text-xs text-[#69736D]">
                  No testimonials added. The public testimonials section is omitted.
                </p>
              ) : (
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 border rounded-xl flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#102F2B]">
                          {t.name} ({t.role}) — {t.location}
                        </p>
                        <p className="text-[#69736D] mt-1">"{t.content}"</p>
                      </div>
                      <button
                        onClick={() =>
                          onSaveTestimonials(testimonials.filter((item) => item.id !== t.id))
                        }
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

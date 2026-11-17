import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  EnquiryFormType,
  InspectionRequest,
  Property,
  PropertyEnquiry,
  PurchaseEnquiry,
} from '../types';
import { CentralEnquiryForm } from './CentralEnquiryForm';

interface EnquirySlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: EnquiryFormType;
  initialProperty?: Property | null;
  initialProject?: string;
  initialCategory?: string;
  properties: Property[];
  locations: string[];
  onSaveInspection: (req: InspectionRequest) => Promise<void> | void;
  onSavePurchase: (req: PurchaseEnquiry) => Promise<void> | void;
  onSaveGeneralEnquiry: (req: PropertyEnquiry) => Promise<void> | void;
}

export const EnquirySlideOver: React.FC<EnquirySlideOverProps> = ({
  isOpen,
  onClose,
  initialType,
  initialProperty,
  initialProject,
  initialCategory,
  properties,
  locations,
  onSaveInspection,
  onSavePurchase,
  onSaveGeneralEnquiry,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Property Enquiry Form"
    >
      <div className="relative w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-[#102F2B] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D6B779] block">
              King Zion's Estate
            </span>
            <h2 className="font-serif-display text-lg sm:text-xl font-bold text-white">
              Submit Your Property Enquiry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <CentralEnquiryForm
            initialType={initialType}
            initialProperty={initialProperty}
            initialProject={initialProject}
            initialCategory={initialCategory}
            properties={properties}
            locations={locations}
            onSaveInspection={onSaveInspection}
            onSavePurchase={onSavePurchase}
            onSaveGeneralEnquiry={onSaveGeneralEnquiry}
          />
        </div>
      </div>
    </div>
  );
};

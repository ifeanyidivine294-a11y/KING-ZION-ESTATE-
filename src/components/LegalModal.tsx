import React from 'react';
import { Shield, X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#102F2B]/15 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-[#102F2B]">
          <Shield className="w-5 h-5 text-[#B58C48]" />
          <h3 className="font-serif-display text-xl font-bold text-[#102F2B]">{title}</h3>
        </div>

        <div className="text-xs sm:text-sm text-[#69736D] leading-relaxed space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <p>{content}</p>
          <div className="p-3.5 rounded-lg bg-[#F5F3ED] border border-[#102F2B]/10 text-[#202824] text-xs">
            <strong>KING ZION'S ESTATE Notice:</strong> All property inspections, survey verifications, and documentation reviews are coordinated directly through our Asaba office.
          </div>
        </div>

        <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#102F2B] hover:bg-[#1D5147] text-white rounded-lg text-xs font-semibold transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

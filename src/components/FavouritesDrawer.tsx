import React from 'react';
import { ArrowRight, Eye, Heart, Trash2, X } from 'lucide-react';
import { Property } from '../types';
import { formatNaira } from '../utils/formatters';

interface FavouritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favouriteIds: string[];
  allProperties: Property[];
  onRemoveFavourite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onEnquireAll: () => void;
}

export const FavouritesDrawer: React.FC<FavouritesDrawerProps> = ({
  isOpen,
  onClose,
  favouriteIds,
  allProperties,
  onRemoveFavourite,
  onSelectProperty,
  onEnquireAll,
}) => {
  if (!isOpen) return null;

  const savedProperties = allProperties.filter((p) => favouriteIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#102F2B]/10">
        <div className="p-5 bg-[#102F2B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#D6B779] text-[#D6B779]" />
            <h3 className="font-serif-display text-lg font-bold">
              Saved Properties ({savedProperties.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close saved properties"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {savedProperties.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E9F0EB] flex items-center justify-center text-[#102F2B]">
                <Heart className="w-6 h-6 stroke-1" />
              </div>
              <h4 className="font-semibold text-sm text-[#102F2B]">No saved properties yet</h4>
              <p className="text-xs text-[#69736D] max-w-xs mx-auto">
                Tap the heart icon on any property to keep it handy while browsing.
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#102F2B]/10 bg-[#F5F3ED]/60"
              >
                <div className="w-20 h-16 rounded-lg bg-[#E9F0EB] overflow-hidden shrink-0">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#102F2B] truncate">{prop.title}</h4>
                  <p className="text-[11px] text-[#69736D] truncate">{prop.location}</p>
                  <p className="text-xs font-bold text-[#1D5147] mt-0.5">
                    {prop.priceText || formatNaira(prop.priceNumeric)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProperty(prop);
                    }}
                    className="p-1.5 text-[#102F2B] hover:bg-white rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFavourite(prop.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {savedProperties.length > 0 && (
          <div className="p-5 border-t border-[#102F2B]/10 bg-[#F5F3ED]">
            <button
              onClick={() => {
                onClose();
                onEnquireAll();
              }}
              className="w-full py-3 bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Enquire About Saved Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

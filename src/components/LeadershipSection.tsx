import React from 'react';
import { UserCheck } from 'lucide-react';
import { LeadershipMember } from '../types';

interface LeadershipSectionProps {
  leadership: LeadershipMember[];
  compact?: boolean;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  leadership,
  compact = false,
}) => {
  if (!leadership || leadership.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {leadership.map((member) => {
        const hasAuthenticPortrait = Boolean(member.portrait && member.portrait.trim());

        return (
          <article
            key={member.id}
            className="bg-white rounded-xl border border-[#102F2B]/10 shadow-xs overflow-hidden flex flex-col sm:flex-row items-stretch"
          >
            {/* Rectangular / Subtly Rounded Portrait Frame */}
            <div className="w-full sm:w-44 md:w-48 shrink-0 bg-[#E9F0EB] flex flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-[#102F2B]/10 min-h-[190px]">
              {hasAuthenticPortrait ? (
                <img
                  src={member.portrait}
                  alt={`${member.name} — ${member.role}`}
                  className="w-full h-44 sm:h-full object-cover object-top rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 rounded-lg border border-dashed border-[#102F2B]/25 bg-[#F5F3ED]">
                  <div className="w-14 h-14 rounded-full bg-[#102F2B]/10 text-[#102F2B] flex items-center justify-center mb-2.5">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#102F2B] block leading-snug">
                    Official Portrait Pending Upload
                  </span>
                  <span className="text-[10px] text-[#69736D] mt-1">
                    Replace via Admin Portal
                  </span>
                </div>
              )}
            </div>

            {/* Text Bio */}
            <div className="p-5 sm:p-6 flex flex-col justify-center space-y-2 flex-1">
              <div>
                <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#102F2B]">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#B58C48]">{member.role}</p>
              </div>
              <p className="text-xs sm:text-sm text-[#69736D] leading-relaxed">
                {compact ? member.quote : member.bio || member.quote}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

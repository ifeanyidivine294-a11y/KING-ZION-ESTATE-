import React from 'react';
import { ArrowRight, Calendar, CheckCircle2, Info, MapPin } from 'lucide-react';
import { INITIAL_ESTATE_PROJECTS } from '../data/initialData';

interface EstateProjectsPageProps {
  onEnquireProject: (projectName: string) => void;
  onInspectProject: (projectName: string) => void;
}

export const EstateProjectsPage: React.FC<EstateProjectsPageProps> = ({
  onEnquireProject,
  onInspectProject,
}) => {
  return (
    <main className="w-full bg-[#F5F3ED]/60 min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#102F2B] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D6B779] block">
            Development Portfolio
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            King Zion's Estate Projects
          </h1>
          <p className="text-sm sm:text-base text-[#F5F3ED]/85 leading-relaxed">
            Explore our Phase 1 development in Asaba and Phase 2 development in Ibusa, Delta State. Stated figures represent recorded estate inventory and are subject to confirmation upon enquiry.
          </p>
        </div>
      </section>

      {/* Phase 1 & Phase 2 Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {INITIAL_ESTATE_PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className="bg-white rounded-2xl border border-[#102F2B]/10 overflow-hidden shadow-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Photography Column */}
              <div className="lg:col-span-5 bg-[#E9F0EB] flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.name} exterior`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-4 left-4 bg-[#102F2B] text-[#D6B779] px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider shadow">
                    {project.phaseLabel}
                  </div>
                </div>
                <div className="relative aspect-[16/9] w-full overflow-hidden border-t border-[#102F2B]/10">
                  <img
                    src={project.secondaryImage}
                    alt={`${project.name} site layout visual`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Project Information Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1D5147]">
                    <MapPin className="w-4 h-4 text-[#B58C48] shrink-0" />
                    <span>{project.location}</span>
                  </div>

                  <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#102F2B]">
                    {project.name}
                  </h2>

                  <p className="text-sm sm:text-base text-[#69736D] leading-relaxed">
                    {project.overview}
                  </p>

                  {/* Strictly Stated Inventory Metrics */}
                  <div className="bg-[#F5F3ED] rounded-xl p-5 border border-[#102F2B]/10 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#69736D] block">
                      Previously Stated Project Inventory (Confirm Current Availability)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                      <div>
                        <span className="text-xs text-[#69736D] block">Land Plots</span>
                        <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#102F2B] tabular-nums-naira">
                          {project.totalPlots} Plots
                        </span>
                      </div>

                      {project.terracedDuplexes !== undefined && (
                        <div>
                          <span className="text-xs text-[#69736D] block">Terraced Duplexes</span>
                          <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#102F2B] tabular-nums-naira">
                            {project.terracedDuplexes} Units
                          </span>
                        </div>
                      )}

                      {project.detachedDuplexes !== undefined && (
                        <div>
                          <span className="text-xs text-[#69736D] block">Detached Duplexes</span>
                          <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#102F2B] tabular-nums-naira">
                            {project.detachedDuplexes} Units
                          </span>
                        </div>
                      )}

                      {project.semiDetachedDuplexes !== undefined && (
                        <div>
                          <span className="text-xs text-[#69736D] block">Semi-Detached Duplexes</span>
                          <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#102F2B] tabular-nums-naira">
                            {project.semiDetachedDuplexes} Units
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirmed Project Highlights */}
                  <ul className="space-y-2.5 pt-2">
                    {project.confirmedHighlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-[#202824]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#1D5147] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs Routing to Contact Page Preselected */}
                <div className="pt-5 border-t border-[#102F2B]/10 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onEnquireProject(project.name)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#B58C48] hover:bg-[#967139] text-white text-sm font-semibold shadow-xs transition-colors"
                  >
                    <span>Enquire About {project.phaseLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onInspectProject(project.name)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#102F2B] text-[#102F2B] hover:bg-[#E9F0EB] text-sm font-semibold transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request Inspection</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Transparency Notice */}
        <div className="bg-white rounded-xl p-6 border border-[#102F2B]/10 flex items-start gap-3 text-sm text-[#69736D]">
          <Info className="w-5 h-5 text-[#102F2B] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#102F2B]">Important Project Notice:</strong> Project inventory numbers reflect overall development scope and do not guarantee that all plots or housing units remain available. Current pricing, specific plot allocations, documentation, and site conditions are confirmed upon direct enquiry and physical inspection.
          </p>
        </div>
      </section>
    </main>
  );
};

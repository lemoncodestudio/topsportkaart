import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { FeatureCollection, Feature } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import provinciesData from './data/provincies.json';
import coropData from './data/corop.json';
import {
  allSportsData,
  getEntriesForRegion,
  calculateRegionScore,
  normalizeByPopulation,
} from './data/sportsData';
import type { SportEntry } from './data/sportsData';

type RegionType = 'province' | 'corop' | 'gemeente';

interface Filters {
  teamsporten: boolean;
  individuelesporten: boolean;
  infrastructuur: boolean;
  voetbal: boolean;
  hockey: boolean;
  overigTeam: boolean;
  wielrennen: boolean;
  schaatsen: boolean;
  overigIndividueel: boolean;
  normalizeByPopulation: boolean;
}

const defaultFilters: Filters = {
  teamsporten: true,
  individuelesporten: true,
  infrastructuur: true,
  voetbal: true,
  hockey: true,
  overigTeam: true,
  wielrennen: true,
  schaatsen: true,
  overigIndividueel: true,
  normalizeByPopulation: true,
};

// Helper to get readable level description
function getLevelDescription(level: string): string {
  const descriptions: Record<string, string> = {
    'eredivisie': 'Eredivisie',
    'eerste_divisie': 'Eerste Divisie',
    'hoofdklasse': 'Hoofdklasse',
    'olympisch': 'Olympisch',
    'topsportcentrum': 'TeamNL Centrum',
    'ntc': 'NTC',
    'talentschool': 'Talentschool',
  };
  return descriptions[level] || level;
}

// Get badge color based on level
function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    'eredivisie': 'bg-amber-500/20 text-amber-700',
    'eerste_divisie': 'bg-slate-500/20 text-slate-700',
    'hoofdklasse': 'bg-orange-500/20 text-orange-700',
    'olympisch': 'bg-blue-500/20 text-blue-700',
    'topsportcentrum': 'bg-red-500/20 text-red-700',
    'ntc': 'bg-purple-500/20 text-purple-700',
    'talentschool': 'bg-green-500/20 text-green-700',
  };
  return colors[level] || 'bg-gray-500/20 text-gray-700';
}

// Color interpolation from dark blue to dark red
function getColor(score: number, maxScore: number): string {
  if (maxScore === 0) return '#1e3a5f';
  const ratio = Math.min(score / maxScore, 1);

  const startR = 30, startG = 58, startB = 95;
  const endR = 139, endG = 0, endB = 0;

  const r = Math.round(startR + (endR - startR) * ratio);
  const g = Math.round(startG + (endG - startG) * ratio);
  const b = Math.round(startB + (endB - startB) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

function filterSportsData(data: SportEntry[], filters: Filters): SportEntry[] {
  return data.filter(entry => {
    const isInfrastructure = ['topsportcentrum', 'ntc', 'talentschool'].includes(entry.level);
    if (isInfrastructure && !filters.infrastructuur) return false;
    if (isInfrastructure) return true;

    if (entry.type === 'team' && !filters.teamsporten) return false;
    if (entry.type === 'individual' && !filters.individuelesporten) return false;

    if (entry.category === 'voetbal' && !filters.voetbal) return false;
    if (entry.category === 'hockey' && !filters.hockey) return false;
    if (['basketbal', 'volleybal', 'handbal'].includes(entry.category) && !filters.overigTeam) return false;
    if (entry.category === 'wielrennen' && !filters.wielrennen) return false;
    if (entry.category === 'schaatsen' && !filters.schaatsen) return false;
    if (['zwemmen', 'atletiek', 'overig'].includes(entry.category) && !filters.overigIndividueel) return false;

    return true;
  });
}

// Toggle Switch Component
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-[13px] text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-out
          ${checked ? 'bg-blue-500' : 'bg-gray-200'}
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ease-out
            ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}
          `}
        />
      </button>
    </label>
  );
}

// Chip Button Component
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200
        ${active
          ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
          : 'bg-white/80 text-gray-600 hover:bg-white'
        }
      `}
    >
      {children}
    </button>
  );
}

// Fixed Header with Filters
interface HeaderProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  regionType: RegionType;
  setRegionType: (type: RegionType) => void;
}

function Header({ filters, setFilters, regionType, setRegionType }: HeaderProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (key: keyof Filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] safe-area-top">
      {/* Main Header Bar */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Topsportkaart</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Region Type Pills */}
            <div className="flex gap-1 bg-gray-100/80 p-1 rounded-full">
              {(['province', 'corop', 'gemeente'] as RegionType[]).map((type) => (
                <Chip
                  key={type}
                  active={regionType === type}
                  onClick={() => setRegionType(type)}
                >
                  {type === 'province' ? 'Prov' : type === 'corop' ? 'COROP' : 'Gem'}
                </Chip>
              ))}
            </div>

            {/* Filter Button */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                  ${filtersOpen
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              {/* Filter Dropdown */}
              <div className={`
                absolute top-full right-0 mt-2 w-72
                bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20
                border border-gray-200/60 overflow-hidden
                transition-all duration-300 ease-out origin-top-right
                ${filtersOpen
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }
              `}>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">Filters</span>
                  </div>

                  {/* Main Filters */}
                  <div className="space-y-3">
                    <Toggle
                      checked={filters.teamsporten}
                      onChange={() => toggleFilter('teamsporten')}
                      label="Teamsporten"
                    />
                    <Toggle
                      checked={filters.individuelesporten}
                      onChange={() => toggleFilter('individuelesporten')}
                      label="Individuele sporten"
                    />
                    <Toggle
                      checked={filters.infrastructuur}
                      onChange={() => toggleFilter('infrastructuur')}
                      label="Topsportinfrastructuur"
                    />
                  </div>

                  {/* Normalization */}
                  <div className="pt-3 border-t border-gray-100">
                    <Toggle
                      checked={filters.normalizeByPopulation}
                      onChange={() => toggleFilter('normalizeByPopulation')}
                      label="Per 100.000 inwoners"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gemeente Warning */}
        {regionType === 'gemeente' && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Gemeenten binnenkort beschikbaar</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Bottom Sheet for Region Details
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string | null;
  regionData: SportEntry[];
  regionScore: number;
  normalized: boolean;
}

function BottomSheet({ isOpen, onClose, selectedRegion, regionData, regionScore, normalized }: BottomSheetProps) {
  const [expanded, setExpanded] = useState(false);

  // Reset expanded state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setExpanded(false);
    }
  }, [isOpen]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Backdrop - only when expanded */}
      <div
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-[998]
          transition-opacity duration-300
          ${isOpen && expanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setExpanded(false)}
      />

      {/* Sheet */}
      <div
        className={`
          fixed left-0 right-0 bottom-0 z-[999]
          bg-white rounded-t-3xl shadow-2xl shadow-black/30
          transition-all duration-300 ease-out
          ${isOpen
            ? expanded
              ? 'translate-y-0'
              : 'translate-y-0'
            : 'translate-y-full'
          }
        `}
        style={{
          maxHeight: expanded ? 'calc(100vh - 120px)' : 'auto',
        }}
      >
        {/* Clickable Header Area */}
        <div
          className="cursor-pointer select-none"
          onClick={toggleExpanded}
        >
          {/* Handle Bar */}
          <div className="pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
          </div>

          {selectedRegion && (
            <div className="px-5 pb-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{selectedRegion}</h2>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {regionData.length} {regionData.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Expand/Collapse Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded();
                    }}
                    className={`
                      p-2 rounded-full transition-all duration-200
                      ${expanded ? 'bg-gray-100 rotate-180' : 'bg-blue-50 hover:bg-blue-100'}
                    `}
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Score Card - Always visible */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 mt-4 shadow-xl shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">Score</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white tracking-tight">
                        {regionScore.toFixed(normalized ? 1 : 0)}
                      </span>
                      <span className="text-[12px] text-gray-400">
                        {normalized ? 'per 100k' : 'punten'}
                      </span>
                    </div>
                  </div>
                  {!expanded && regionData.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-blue-400">
                      <span>Toon details</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-out
            ${expanded ? 'max-h-[60vh] overflow-y-auto' : 'max-h-0'}
          `}
        >
          {selectedRegion && (
            <div className="px-5 pb-6">
              {/* Entries List */}
              {regionData.length > 0 ? (
                <div className="space-y-2">
                  {regionData.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-gray-50/80 rounded-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[15px] text-gray-900 truncate">{entry.name}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getLevelColor(entry.level)}`}>
                              {getLevelDescription(entry.level)}
                            </span>
                            <span className="text-[12px] text-gray-400">{entry.location}</span>
                          </div>
                        </div>
                        <div className="ml-3 text-[15px] font-semibold text-gray-900 bg-white px-2.5 py-1 rounded-lg shadow-sm">
                          +{entry.points}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-gray-500">Geen resultaten met huidige filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Floating Legend
function Legend() {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-[100] pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/10 p-4 max-w-md mx-auto pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Laag</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{
            background: 'linear-gradient(to right, #1e3a5f, #8b0000)'
          }}></div>
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Hoog</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [regionType, setRegionType] = useState<RegionType>('province');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredData = useMemo(() => filterSportsData(allSportsData, filters), [filters]);

  const regionScores = useMemo(() => {
    const scores: Record<string, number> = {};
    const regions = new Set<string>();

    filteredData.forEach(entry => {
      if (regionType === 'province') regions.add(entry.province);
      else if (regionType === 'corop') regions.add(entry.corop);
      else regions.add(entry.location);
    });

    regions.forEach(region => {
      if (region === 'Onbekend') return;
      let score = calculateRegionScore(filteredData, regionType, region);
      if (filters.normalizeByPopulation && (regionType === 'province' || regionType === 'corop')) {
        score = normalizeByPopulation(score, region);
      }
      scores[region] = score;
    });

    return scores;
  }, [filteredData, regionType, filters.normalizeByPopulation]);

  const maxScore = useMemo(() => Math.max(...Object.values(regionScores), 1), [regionScores]);

  const selectedRegionData = useMemo(() => {
    if (!selectedRegion) return [];
    return getEntriesForRegion(filteredData, regionType, selectedRegion);
  }, [selectedRegion, filteredData, regionType]);

  const selectedRegionScore = useMemo(() => {
    if (!selectedRegion) return 0;
    return regionScores[selectedRegion] || 0;
  }, [selectedRegion, regionScores]);

  const getStyle = useCallback((feature: Feature | undefined): PathOptions => {
    if (!feature?.properties) return {};

    const regionName = feature.properties.statnaam;
    const score = regionScores[regionName] || 0;
    const isSelected = regionName === selectedRegion;

    return {
      fillColor: getColor(score, maxScore),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#1e3a5f' : 'rgba(255,255,255,0.8)',
      fillOpacity: isSelected ? 0.9 : 0.75,
    };
  }, [regionScores, maxScore, selectedRegion]);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    const regionName = feature.properties?.statnaam;
    if (!regionName) return;

    layer.on({
      click: () => {
        setSelectedRegion(regionName);
      },
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 2,
          color: '#1e3a5f',
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        if (regionName !== selectedRegion) {
          const target = e.target;
          target.setStyle(getStyle(feature));
        }
      },
    });

    const score = regionScores[regionName] || 0;
    layer.bindTooltip(
      `<strong>${regionName}</strong><br/>${score.toFixed(filters.normalizeByPopulation ? 1 : 0)} ${filters.normalizeByPopulation ? 'per 100k' : 'punten'}`,
      { sticky: true, className: 'custom-tooltip' }
    );
  }, [regionScores, selectedRegion, getStyle, filters.normalizeByPopulation]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f5f5f7]">
      {/* Fixed Header */}
      <Header
        filters={filters}
        setFilters={setFilters}
        regionType={regionType}
        setRegionType={setRegionType}
      />

      {/* Full Screen Map */}
      <div className="absolute inset-0 pt-[60px]">
        <MapContainer
          center={[52.2, 5.5]}
          zoom={7}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <GeoJSON
            key={`${regionType}-${JSON.stringify(filters)}-${selectedRegion}`}
            data={(regionType === 'corop' ? coropData : provinciesData) as FeatureCollection}
            style={getStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>

      {/* Legend (only visible when no region selected) */}
      {!selectedRegion && <Legend />}

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedRegion}
        onClose={() => setSelectedRegion(null)}
        selectedRegion={selectedRegion}
        regionData={selectedRegionData}
        regionScore={selectedRegionScore}
        normalized={filters.normalizeByPopulation}
      />

      <style>{`
        .custom-tooltip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
          padding: 10px 14px;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .custom-tooltip strong {
          color: #1a1a1a;
          font-weight: 600;
        }
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
      `}</style>
    </div>
  );
}

export default App;

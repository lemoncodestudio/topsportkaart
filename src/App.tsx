import { useState, useMemo, useCallback } from 'react';
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
        px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200
        ${active
          ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      {children}
    </button>
  );
}

interface SidebarProps {
  selectedRegion: string | null;
  regionData: SportEntry[];
  regionScore: number;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  regionType: RegionType;
  setRegionType: (type: RegionType) => void;
  onClose: () => void;
}

function Sidebar({
  selectedRegion,
  regionData,
  regionScore,
  filters,
  setFilters,
  regionType,
  setRegionType,
  onClose,
}: SidebarProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const toggleFilter = (key: keyof Filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-xl">
      {/* Header */}
      <div className="hidden md:block p-6 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Topsportkaart</h1>
        <p className="text-[13px] text-gray-500 mt-1">Concentratie van topsport in Nederland</p>
      </div>

      {/* Region Type Selector */}
      <div className="px-5 py-4 border-b border-gray-200/60">
        <div className="flex gap-2">
          {(['province', 'corop', 'gemeente'] as RegionType[]).map((type) => (
            <Chip
              key={type}
              active={regionType === type}
              onClick={() => setRegionType(type)}
            >
              {type === 'province' ? 'Provincies' : type === 'corop' ? 'COROP' : 'Gemeenten'}
            </Chip>
          ))}
        </div>
        {regionType === 'gemeente' && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Gemeenten binnenkort beschikbaar</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200/60">
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <span className="font-medium text-[15px] text-gray-900">Filters</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${filtersExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ease-out ${filtersExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-5 pb-5 space-y-5">
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
            <div className="pt-4 border-t border-gray-100">
              <Toggle
                checked={filters.normalizeByPopulation}
                onChange={() => toggleFilter('normalizeByPopulation')}
                label="Per 100.000 inwoners"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Region */}
      <div className="flex-1 overflow-y-auto">
        {selectedRegion ? (
          <div className="p-5">
            {/* Region Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{selectedRegion}</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">
                  {regionData.length} {regionData.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 mb-5 shadow-xl shadow-gray-900/20">
              <div className="text-[13px] text-gray-400 uppercase tracking-wide mb-1">Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">
                  {regionScore.toFixed(filters.normalizeByPopulation ? 1 : 0)}
                </span>
                <span className="text-[13px] text-gray-400">
                  {filters.normalizeByPopulation ? 'per 100k' : 'punten'}
                </span>
              </div>
            </div>

            {/* Entries List */}
            {regionData.length > 0 ? (
              <div className="space-y-2">
                {regionData.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors group"
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
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Selecteer een regio</h3>
            <p className="text-[13px] text-gray-500">Klik op de kaart om details te bekijken</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-5 border-t border-gray-200/60 bg-gray-50/50">
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        if (window.innerWidth < 768) {
          setSidebarOpen(true);
        }
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
    <div className="h-screen flex flex-col md:flex-row bg-[#f5f5f7]">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-5 py-4 flex items-center justify-between relative z-[1001]">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Topsportkaart</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:relative z-[1000] md:z-auto w-[340px]
        top-[65px] md:top-0 bottom-0 md:h-full
        transition-transform duration-300 ease-out
        border-r border-gray-200/60
        shadow-2xl md:shadow-none
      `}>
        <Sidebar
          selectedRegion={selectedRegion}
          regionData={selectedRegionData}
          regionScore={selectedRegionScore}
          filters={filters}
          setFilters={setFilters}
          regionType={regionType}
          setRegionType={setRegionType}
          onClose={() => {
            setSelectedRegion(null);
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed top-[65px] left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-[999]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Map */}
      <div className="flex-1 relative">
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

        {/* Floating Legend for Mobile */}
        <div className="md:hidden absolute bottom-6 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/10 p-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Laag</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{
                background: 'linear-gradient(to right, #1e3a5f, #8b0000)'
              }}></div>
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Hoog</span>
            </div>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}

export default App;

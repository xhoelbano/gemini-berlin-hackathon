import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { Search, Navigation, Layers, Map as MapIcon, Loader2 } from 'lucide-react';
import { searchLocations } from '../services/gemini';

interface MapInterfaceProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const MapInterface: React.FC<MapInterfaceProps> = ({ projects, onSelectProject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{title: string, uri: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'structural'>('standard');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Check if Leaflet is loaded from index.html
    const L = (window as any).L;
    if (!L) {
        console.error("Leaflet not found");
        return;
    }

    if (mapInstanceRef.current) return; // Already initialized

    const berlin = [52.4900, 13.3600];
    
    const map = L.map(mapContainerRef.current, {
        center: berlin,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
    });

    // Clean, architectural basemap (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);
    setMapLoaded(true);

    // Cleanup
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []);

  // Update Markers & Polygons
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const L = (window as any).L;
    
    layerGroupRef.current.clearLayers();

    projects.forEach(project => {
        const color = viewMode === 'structural' ? '#2563eb' : (project.status === 'Active' ? '#22c55e' : '#0ea5e9');
        
        // Convert boundary objects {lat, lng} to arrays [lat, lng]
        const latLngs = (project.boundary as any[]).map(p => [p.lat, p.lng]);

        // Polygon
        const polygon = L.polygon(latLngs, {
            color: color,
            fillColor: color,
            fillOpacity: viewMode === 'structural' ? 0.1 : 0.4,
            weight: 2
        }).addTo(layerGroupRef.current);

        polygon.on('click', () => onSelectProject(project));

        // Marker (Custom Div Icon to look like the circles)
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color};" class="custom-marker-pin"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([project.coordinates.lat, project.coordinates.lng], { icon: icon })
            .addTo(layerGroupRef.current);

        // Popup
        const popupContent = `
            <div style="font-family: 'Inter', sans-serif; padding: 12px; min-width: 200px;">
                <h3 style="font-weight: 700; margin-bottom: 4px; font-size: 14px;">${project.title}</h3>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">${project.status}</p>
                <button id="btn-${project.id}" style="width: 100%; background: #0f172a; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                    Open Studio
                </button>
            </div>
        `;

        marker.bindPopup(popupContent, {
            className: 'custom-popup',
            closeButton: true,
            offset: [0, -10]
        });

        marker.on('popupopen', () => {
            setTimeout(() => {
                const btn = document.getElementById(`btn-${project.id}`);
                if (btn) btn.onclick = () => onSelectProject(project);
            }, 50);
        });
    });

  }, [projects, viewMode, mapLoaded, onSelectProject]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
    } catch (e) {
        console.error("Search failed", e);
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden">
      
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative shadow-xl">
            <input 
                type="text" 
                placeholder="Search Berlin..." 
                className="w-full bg-white text-slate-800 border-2 border-slate-200 rounded-full py-3 px-12 focus:ring-4 focus:ring-sky-500/20 outline-none font-medium shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <button type="submit" className="absolute right-2 top-2 bg-slate-900 p-1.5 rounded-full hover:bg-slate-700 transition">
                {isSearching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Navigation className="w-4 h-4 text-white" />}
            </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 relative z-[500]">
                <div className="p-2 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50">Results</div>
                {searchResults.map((res, i) => (
                    <a key={i} href={res.uri} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-slate-50 text-sm text-sky-600 border-b border-slate-100 last:border-0 truncate font-medium">
                        {res.title}
                    </a>
                ))}
            </div>
        )}
      </div>

      {/* View Toggle */}
      <div className="absolute top-20 right-4 z-[400] flex flex-col gap-2">
           <button 
             onClick={() => setViewMode(viewMode === 'standard' ? 'structural' : 'standard')}
             className={`p-3 rounded-full shadow-lg border-2 transition-all duration-300 ${viewMode === 'structural' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             title="Toggle Structural View"
           >
               <Layers className="w-6 h-6" />
           </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} id="map-container" className="absolute inset-0 z-0 h-full w-full outline-none bg-slate-100">
          {!mapLoaded && (
              <div className="flex items-center justify-center h-full bg-slate-100">
                  <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
                  <span className="ml-2 text-slate-500">Loading Map...</span>
              </div>
          )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur p-4 rounded-xl border border-slate-200 text-xs text-slate-600 shadow-xl">
          <h4 className="font-bold mb-2 uppercase tracking-wider text-slate-400 text-[10px]">{viewMode === 'structural' ? 'Engineering Layer' : 'Planning Zones'}</h4>
          {viewMode === 'structural' ? (
              <div className="flex items-center"><span className="w-6 h-6 border-2 border-blue-600 border-dashed bg-blue-600/20 mr-2"></span> Surveyed Area</div>
          ) : (
             <>
                <div className="flex items-center mb-2"><span className="w-4 h-4 rounded-full bg-green-500 mr-2 border-2 border-white shadow-sm"></span> Active Projects</div>
                <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-sky-500 mr-2 border-2 border-white shadow-sm"></span> Proposed</div>
             </>
          )}
      </div>
    </div>
  );
};

export default MapInterface;
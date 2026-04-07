'use client';

import { useEffect, useRef } from 'react';
import { WastewaterFacility } from '@/types';

// Define types for Leaflet to avoid TypeScript issues
declare global {
  interface Window {
    L: any;
  }
}

interface MapComponentProps {
  facilities: WastewaterFacility[];
  onMarkerClick: (facility: WastewaterFacility) => void;
}

export default function MapComponent({ facilities, onMarkerClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize map centered on Kendari, Indonesia
      mapInstanceRef.current = window.L.map(mapRef.current).setView([-3.9778, 122.5194], 12);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      updateMarkers();
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [facilities]);

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    facilities.forEach(facility => {
      if (facility.latitude && facility.longitude) {
        const getMarkerColor = (status: string) => {
          if (status.includes('Optimal')) {
            return 'green';
          }
          return 'red';
        };

        const markerColor = getMarkerColor(facility.kondisi_status_operasional);
        
        // Create custom icon
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${markerColor === 'green' ? '#10b981' : '#ef4444'};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = window.L.marker([facility.latitude, facility.longitude], {
          icon: customIcon
        }).addTo(mapInstanceRef.current);

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${facility.nama}</h3>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Lokasi:</strong> ${facility.kelurahan_desa}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Kapasitas:</strong> ${facility.kapasitas_desain} SR</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Pengelola:</strong> ${facility.lembaga_pengelola}</p>
            <div style="margin: 8px 0;">
              <span style="
                background-color: ${facility.kondisi_status_operasional.includes('Optimal') ? '#dcfce7' : '#fecaca'};
                color: ${facility.kondisi_status_operasional.includes('Optimal') ? '#166534' : '#dc2626'};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
              ">${facility.kondisi_status_operasional}</span>
            </div>
            <button onclick="window.selectFacility(${facility.id})" style="
              background-color: #3b82f6;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
              margin-top: 8px;
            ">Lihat Detail</button>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Add click event
        marker.on('click', () => {
          onMarkerClick(facility);
        });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  // Make selectFacility available globally for popup buttons
  useEffect(() => {
    (window as any).selectFacility = (facilityId: number) => {
      const facility = facilities.find(f => f.id === facilityId);
      if (facility) {
        onMarkerClick(facility);
      }
    };

    return () => {
      delete (window as any).selectFacility;
    };
  }, [facilities, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}

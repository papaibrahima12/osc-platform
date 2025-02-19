import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NGO } from '../types/user';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  ngos: NGO[];
}

// Default coordinates for Senegal (centered on Dakar)
const DEFAULT_CENTER: [number, number] = [14.6937, -17.4441];

export default function Map({ ngos }: MapProps) {
  // Get coordinates for NGOs
  const ngoCoordinates = ngos.map(ngo => {
    // Use stored coordinates if available
    if (ngo.latitude && ngo.longitude) {
      return {
        ngo,
        coordinates: [ngo.latitude, ngo.longitude] as [number, number]
      };
    }

    // Fallback to default coordinates (Dakar)
    return {
      ngo,
      coordinates: DEFAULT_CENTER
    };
  });

  // Calculate center point (average of all coordinates)
  const center = ngoCoordinates.length > 0
      ? [
        ngoCoordinates.reduce((sum, item) => sum + item.coordinates[0], 0) / ngoCoordinates.length,
        ngoCoordinates.reduce((sum, item) => sum + item.coordinates[1], 0) / ngoCoordinates.length
      ] as [number, number]
      : DEFAULT_CENTER;

  return (
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
            center={center}
            zoom={7}
            className="h-full w-full"
        >
          <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {ngoCoordinates.map(({ ngo, coordinates }) => (
              <Marker
                  key={ngo.id}
                  position={coordinates}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900">{ngo.name}</h3>
                    <p className="text-sm text-gray-600">{ngo.address}</p>
                    <p className="text-sm text-gray-600">{ngo.email}</p>
                    {ngo.phone && (
                        <p className="text-sm text-gray-600">{ngo.phone}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
          ))}
        </MapContainer>
      </div>
  );
}
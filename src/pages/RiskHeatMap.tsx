/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Circle, Marker, InfoWindow } from '@react-google-maps/api';
import { usePublicStore } from '../store/publicStore';
import { Button } from '@/components/ui/button';
import React from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '650px'
};

const center = { lat: 9.0820, lng: 8.6753 };

export default function RiskHeatmap() {
  const { heatmapData, fetchHeatmapData } = usePublicStore();
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="text-red-600 p-8">Google Maps API Key is missing</div>;
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold">Geospatial Risk Heatmap</h2>
          <p className="text-gray-600">High-risk interview zones highlighted</p>
        </div>
        <Button onClick={fetchHeatmapData} variant="outline">Refresh Data</Button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={6.5}
            onLoad={() => setMapLoaded(true)}
          >
            {heatmapData.map((point: any, index) => {
              const isHighRisk = point.intensity > 65;
              return (
                <React.Fragment key={index}>
                  <Circle
                    center={{ lat: point.lat, lng: point.lng }}
                    radius={point.intensity * 18000}
                    options={{
                      fillColor: isHighRisk ? "#b91c1c" : "#f59e0b",
                      fillOpacity: 0.45,
                      strokeColor: isHighRisk ? "#991b1b" : "#c2410c",
                      strokeWeight: 2,
                    }}
                    onClick={() => setSelectedPoint(point)}
                  />
                  {isHighRisk && (
                    <Marker
                      position={{ lat: point.lat, lng: point.lng }}
                      onClick={() => setSelectedPoint(point)}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {selectedPoint && (
              <InfoWindow
                position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
                onCloseClick={() => setSelectedPoint(null)}
              >
                <div className="p-3 max-w-xs">
                  <h4 className="font-bold">{selectedPoint.title}</h4>
                  <p className="text-orange-600">{selectedPoint.company}</p>
                  <div className="mt-3 text-sm">
                    <div>Risk Level: <span className="font-bold text-red-600">{selectedPoint.intensity}%</span></div>
                    <div>Reports: {selectedPoint.reportCount}</div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
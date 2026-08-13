import { siteConfig } from './site';

const EARTH_RADIUS_MILES = 3958.8;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  coordinates: Coordinates;
  label: string;
  distanceMiles: number;
  source: 'mapbox' | 'postcode' | 'fallback';
  confidence: 'verified' | 'manual_review';
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function distanceMiles(from: Coordinates, to: Coordinates): number {
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * EARTH_RADIUS_MILES * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeUkPostcode(query: string): Promise<GeocodeResult | null> {
  const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = (await response.json().catch(() => null)) as
    | {
        result?: {
          postcode?: string;
          latitude?: number;
          longitude?: number;
          admin_district?: string;
          region?: string;
        };
      }
    | null;

  const result = data?.result;
  if (!result || typeof result.latitude !== 'number' || typeof result.longitude !== 'number') {
    return null;
  }

  const coordinates = { lat: result.latitude, lng: result.longitude };
  const label = [
    result.postcode,
    result.admin_district,
    result.region,
    'UK',
  ].filter(Boolean).join(', ');

  return {
    coordinates,
    label,
    distanceMiles: distanceMiles(siteConfig.center, coordinates),
    source: 'postcode',
    confidence: 'verified',
  };
}

export async function geocodeEdinburghAddress(address: string): Promise<GeocodeResult> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_SECRET_TOKEN;
  const query = address.trim();

  if (!token) {
    const postcodeResult = await geocodeUkPostcode(query);
    if (postcodeResult) return postcodeResult;

    return {
      coordinates: siteConfig.center,
      label: query,
      distanceMiles: 0,
      source: 'fallback',
      confidence: 'manual_review',
    };
  }

  const params = new URLSearchParams({
    access_token: token,
    country: 'gb',
    language: 'en',
    limit: '1',
    proximity: `${siteConfig.center.lng},${siteConfig.center.lat}`,
    types: 'address,postcode,place,locality',
  });

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    return {
      coordinates: siteConfig.center,
      label: query,
      distanceMiles: 0,
      source: 'fallback',
      confidence: 'manual_review',
    };
  }

  const data = (await response.json()) as {
    features?: Array<{
      center?: [number, number];
      place_name?: string;
      place_name_en?: string;
      text?: string;
      text_en?: string;
      geometry?: { coordinates?: [number, number] };
      properties?: { full_address?: string; name?: string; place_formatted?: string };
    }>;
  };

  const feature = data.features?.[0];
  const coordinates = feature?.geometry?.coordinates || feature?.center;

  if (!coordinates) {
    return {
      coordinates: siteConfig.center,
      label: query,
      distanceMiles: 0,
      source: 'fallback',
      confidence: 'manual_review',
    };
  }

  const result = { lng: coordinates[0], lat: coordinates[1] };
  const miles = distanceMiles(siteConfig.center, result);
  const label =
    feature.properties?.full_address ||
    feature.place_name_en ||
    feature.place_name ||
    [feature.properties?.name, feature.properties?.place_formatted].filter(Boolean).join(', ') ||
    feature.text_en ||
    feature.text ||
    query;

  return {
    coordinates: result,
    label,
    distanceMiles: miles,
    source: 'mapbox',
    confidence: 'verified',
  };
}

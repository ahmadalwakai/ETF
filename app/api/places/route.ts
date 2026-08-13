import { NextResponse } from 'next/server';
import { distanceMiles } from '@/lib/geo';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

interface MapboxFeature {
  id?: string;
  center?: [number, number];
  place_name?: string;
  place_name_en?: string;
  text?: string;
  text_en?: string;
  context?: Array<{ text?: string; text_en?: string }>;
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    mapbox_id?: string;
    name?: string;
    full_address?: string;
    place_formatted?: string;
    feature_type?: string;
  };
}

interface MapboxResponse {
  features?: MapboxFeature[];
}

function readMapboxToken(): string {
  return (process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_SECRET_TOKEN || '').trim();
}

function formatLabel(feature: MapboxFeature): string {
  const properties = feature.properties;
  return (
    properties?.full_address ||
    feature.place_name_en ||
    feature.place_name ||
    [properties?.name, properties?.place_formatted].filter(Boolean).join(', ') ||
    feature.text_en ||
    feature.text ||
    properties?.name ||
    'Address suggestion'
  );
}

function formatContext(feature: MapboxFeature): string {
  const propertiesContext = feature.properties?.place_formatted;
  if (propertiesContext) return propertiesContext;

  return (feature.context || [])
    .map((item) => item.text_en || item.text)
    .filter(Boolean)
    .join(', ');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim();
  const token = readMapboxToken();

  if (query.length < 3) {
    return NextResponse.json({ suggestions: [], tokenConfigured: Boolean(token) });
  }

  if (!token) {
    return NextResponse.json({
      suggestions: [],
      tokenConfigured: false,
      message: 'Mapbox token is not configured.',
    });
  }

  const params = new URLSearchParams({
    access_token: token,
    autocomplete: 'true',
    country: 'gb',
    language: 'en',
    limit: '6',
    proximity: `${siteConfig.center.lng},${siteConfig.center.lat}`,
    types: 'address,postcode,place,locality',
  });

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        suggestions: [],
        tokenConfigured: true,
        message: 'Address autocomplete is temporarily unavailable.',
      },
      { status: 502 },
    );
  }

  const data = (await response.json()) as MapboxResponse;
  const suggestions = (data.features || [])
    .map((feature, index) => {
      const coordinates = feature.geometry?.coordinates || feature.center;
      if (!coordinates) return null;

      const point = { lng: coordinates[0], lat: coordinates[1] };
      const miles = distanceMiles(siteConfig.center, point);
      const label = formatLabel(feature);
      const context = formatContext(feature);

      return {
        id: feature.properties?.mapbox_id || feature.id || `${label}-${index}`,
        label,
        name: feature.properties?.name || feature.text_en || feature.text || label,
        context,
        lat: point.lat,
        lng: point.lng,
        distanceMiles: Number(miles.toFixed(1)),
        inServiceArea: miles <= siteConfig.serviceRadiusMiles,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ suggestions, tokenConfigured: true });
}

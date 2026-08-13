import { siteConfig } from './site';

export interface TyreRescueBookingPayload {
  externalReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  lat: number;
  lng: number;
  distanceMiles: number;
  distanceSource: string;
  bookingType: string;
  serviceType: string;
  quantity: number;
  tyreSizeDisplay?: string;
  vehicleReg?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  scheduledAt?: string;
  lockingNutStatus?: 'has_key' | 'no_key' | 'standard';
  notes?: string;
  paymentType: 'cash' | 'full' | 'deposit';
  status?: 'awaiting_payment' | 'paid';
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  priceSnapshot: Record<string, unknown>;
  gclid?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface TyreRescueQuoteBookingPayload {
  quoteId: string;
  externalReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tyrePhotoUrl?: string;
  vehicleReg?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  tyreSizeDisplay?: string;
  lockingNutStatus?: 'has_key' | 'no_key' | 'standard';
  notes?: string;
  fulfillmentOption?: 'delivery' | 'fitting' | null;
  paymentFlow?: 'payment_intent' | 'external_checkout';
}

export interface TyreRescueBookingResponse {
  success: boolean;
  mode?: string;
  refNumber?: string;
  total?: number;
  stripeClientSecret?: string | null;
  sourceDisplay?: string;
  booking?: {
    id: string;
    refNumber: string;
    status: string;
  };
  error?: string;
  details?: unknown;
}

export function getTyreRescueIntegrationConfigStatus() {
  const secret = process.env.EDINBURGH_TYRE_FITTING_INTEGRATION_SECRET?.trim();
  return {
    configured: Boolean(secret),
    message: secret ? null : 'EDINBURGH_TYRE_FITTING_INTEGRATION_SECRET is not configured',
  };
}

export async function handoffBookingToTyreRescue(
  payload: TyreRescueBookingPayload | TyreRescueQuoteBookingPayload,
): Promise<TyreRescueBookingResponse> {
  const baseUrl = process.env.TYRE_RESCUE_API_BASE_URL || 'https://www.tyrerescue.uk';
  const secret = process.env.EDINBURGH_TYRE_FITTING_INTEGRATION_SECRET;

  if (!secret) {
    throw new Error('EDINBURGH_TYRE_FITTING_INTEGRATION_SECRET is not configured');
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/integrations/projects/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-integration-key': secret,
      'x-source-app': siteConfig.integrationSource,
    },
    body: JSON.stringify({
      sourceApp: siteConfig.integrationSource,
      ...payload,
    }),
  });

  const data = (await response.json().catch(() => null)) as TyreRescueBookingResponse | null;

  if (!response.ok || !data?.success) {
    return {
      success: false,
      error: data?.error ?? 'Tyre Rescue rejected the booking handoff',
      details: data,
    };
  }

  return data;
}

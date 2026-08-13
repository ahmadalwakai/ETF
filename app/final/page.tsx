import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, Clock, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Booking Received',
  description: 'Your Edinburgh Tyre Fitting booking has been received.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function FinalPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; requestRef?: string; total?: string; payment?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref || 'pending';
  const requestRef = params.requestRef || '';
  const total = params.total ? Number(params.total) : null;
  const paymentStatus = params.payment === 'success' ? 'success' : params.payment === 'cancelled' ? 'cancelled' : 'pending';

  return (
    <main className="final-wrap">
      <section className="final-card" data-payment={paymentStatus}>
        <div className="success-mark">
          {paymentStatus === 'cancelled' ? <Clock size={34} aria-hidden="true" /> : <CheckCircle2 size={34} aria-hidden="true" />}
        </div>
        <span className="eyebrow">
          {paymentStatus === 'success' ? 'Payment received' : paymentStatus === 'cancelled' ? 'Payment not completed' : 'Booking received'}
        </span>
        <h1>
          {paymentStatus === 'success'
            ? 'Your tyre booking is confirmed.'
            : paymentStatus === 'cancelled'
              ? 'Your booking is waiting for payment.'
              : 'Your tyre booking has been received.'}
        </h1>
        <p>
          {paymentStatus === 'success'
            ? 'Your secure card payment has been completed. Keep your phone nearby while we review timing, access and any details that need attention.'
            : paymentStatus === 'cancelled'
              ? 'The request was created, but Stripe Checkout was not completed. Please call or start a new booking if you still need the tyre visit.'
              : 'We have received your Edinburgh Tyre Fitting request. Keep your phone nearby while we review the details, confirm timing and check anything that needs attention.'}
        </p>
        <div className="ref-box">
          <div>
            <span>Booking ref</span>
            <strong>{ref}</strong>
          </div>
          {requestRef && (
            <div>
              <span>Request ref</span>
              <strong>{requestRef}</strong>
            </div>
          )}
          {total != null && Number.isFinite(total) && (
            <div>
              <span>Estimate</span>
              <strong>
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  maximumFractionDigits: 0,
                }).format(total)}
              </strong>
            </div>
          )}
        </div>
        <div className="final-meta-grid">
          <div>
            <Clock size={20} aria-hidden="true" />
            <strong>{paymentStatus === 'cancelled' ? 'Payment required' : 'Fast review'}</strong>
            <span>
              {paymentStatus === 'cancelled'
                ? 'A visit cannot be treated as confirmed until payment is completed or the team agrees another option.'
                : 'We check the request and contact you if timing needs confirming.'}
            </span>
          </div>
          <div>
            <ShieldCheck size={20} aria-hidden="true" />
            <strong>Clear details</strong>
            <span>Tyre size, access and payment details can be confirmed before the visit.</span>
          </div>
        </div>
        <div className="next-steps">
          <div>
            <strong>1</strong>
            <span>{paymentStatus === 'cancelled' ? 'Complete payment or contact the team.' : 'We review tyre size, access notes and urgency.'}</span>
          </div>
          <div>
            <strong>2</strong>
            <span>We check availability and confirm the visit timing.</span>
          </div>
          <div>
            <strong>3</strong>
            <span>You get a call or message if anything needs confirming.</span>
          </div>
        </div>
        <div className="button-row">
          <a className="primary-button" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>
            <Phone size={18} aria-hidden="true" />
            Call now
          </a>
          <a className="secondary-button" href={`https://wa.me/${siteConfig.whatsapp}`}>
            <MessageCircle size={18} aria-hidden="true" />
            WhatsApp
          </a>
          <Link className="secondary-button" href="/">
            Create another booking
          </Link>
        </div>
      </section>
    </main>
  );
}

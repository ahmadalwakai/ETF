import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { BookingForm } from '@/components/BookingForm';
import { faqs, serviceAreas, siteConfig } from '@/lib/site';
import { serviceOptions } from '@/lib/pricing';

function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    areaServed: [
      'Edinburgh',
      'Leith',
      'Musselburgh',
      'Dalkeith',
      'Livingston',
      'Linlithgow',
      'North Berwick',
      'Penicuik',
      'Peebles',
      'Lothians',
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.center.lat,
        longitude: siteConfig.center.lng,
      },
      geoRadius: `${siteConfig.serviceRadiusMiles} miles`,
    },
    makesOffer: serviceOptions.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.label,
        description: service.description,
      },
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}

const heroHighlights = [
  { value: '50 mi', label: 'Edinburgh, Lothians and nearby countryside' },
  { value: '4 services', label: 'Fitting, punctures, urgent call-outs and locking nut help' },
  { value: '1 minute', label: 'Fast booking with address search and live estimate' },
];

const bookingSteps = [
  {
    title: 'Choose the help you need',
    text: 'Pick fitting, puncture repair, emergency call-out or locking wheel nut help.',
  },
  {
    title: 'Tell us where the vehicle is',
    text: 'Use a postcode, street, workplace, hotel, car park or safe roadside location.',
  },
  {
    title: 'Confirm tyre and contact details',
    text: 'Add tyre size if you know it. If not, we can check before arranging the visit.',
  },
  {
    title: 'Keep your phone close',
    text: 'We confirm timing, access and any final details before the call-out.',
  },
];

const experienceCards = [
  {
    icon: Map,
    title: 'Address search built for Edinburgh',
    text: 'Start typing a postcode or place and choose a suggested location inside the 50-mile area.',
  },
  {
    icon: CreditCard,
    title: 'Estimate before you submit',
    text: 'The booking shows a starting price, distance band and call-out estimate before you finish.',
  },
  {
    icon: Clock,
    title: 'Designed for urgent moments',
    text: 'Short steps, large controls and clear prompts make the form easier to use from a phone.',
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <JsonLd />
      <header className="topbar">
        <Link href="/" aria-label="Edinburgh Tyre Fitting home" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <span className="brand-mark">ETF</span>
          <strong className="brand-name">{siteConfig.name}</strong>
        </Link>
        <nav className="nav-actions" aria-label="Quick contact">
          <a className="nav-pill" href="#services">
            Services
          </a>
          <a className="nav-pill" href="#areas">
            Areas
          </a>
          <a className="nav-cta" href="#book">
            Book now
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a className="icon-link" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} aria-label="Call Edinburgh Tyre Fitting">
            <Phone size={20} aria-hidden="true" />
          </a>
          <a className="icon-link" href={`https://wa.me/${siteConfig.whatsapp}`} aria-label="WhatsApp Edinburgh Tyre Fitting">
            <MessageCircle size={20} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <MapPin size={16} aria-hidden="true" />
            Edinburgh plus 50-mile countryside cover
          </span>
          <h1>Edinburgh Tyre Fitting</h1>
          <p className="hero-lede">
            Mobile tyre fitting, puncture repair and urgent tyre support at your location. Start with your address, get
            a clear estimate and keep the booking moving without waiting at a garage.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#book">
              Start booking
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-button" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>
              <Phone size={18} aria-hidden="true" />
              Call
            </a>
          </div>
          <div className="hero-badge-row" aria-label="Booking highlights">
            {heroHighlights.map((item) => (
              <div className="hero-badge" key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <BookingForm />
        <div className="hero-support">
          <div className="hero-image" aria-hidden="true">
            <Image
              src="/edinburgh-tyre-fitting-hero.png"
              alt=""
              width={920}
              height={520}
              priority
            />
            <div className="image-caption">
              <span>Mobile fitting at home, work or roadside</span>
              <strong>Edinburgh + 50 miles</strong>
            </div>
          </div>
          <div className="proof-row">
            <div className="proof-item">
              <CheckCircle2 size={20} aria-hidden="true" />
              <strong>Clear before visit</strong>
              <span>We check tyre size, access and timing so the booking is not vague.</span>
            </div>
            <div className="proof-item">
              <Clock size={20} aria-hidden="true" />
              <strong>Same-day help</strong>
              <span>For fitting, punctures and urgent call-outs when availability allows.</span>
            </div>
            <div className="proof-item">
              <ShieldCheck size={20} aria-hidden="true" />
              <strong>Safety first</strong>
              <span>Roadside details and locking wheel nut status are captured before the visit.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-band journey-band">
        <div className="band-inner">
          <div className="section-head">
            <h2>A smoother booking from the first tap.</h2>
            <p>Each step asks only for the details needed to price, locate and prepare the tyre visit.</p>
          </div>
          <div className="journey-grid">
            {bookingSteps.map((step, index) => (
              <article className="journey-step" key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-band" id="services">
        <div className="band-inner">
          <div className="section-head">
            <h2>Choose the tyre service that matches the problem.</h2>
            <p>
              Clear service choices help customers book the right help first time, whether the vehicle is parked,
              stranded or missing a locking wheel nut key.
            </p>
          </div>
          <div className="service-detail-grid">
            {serviceOptions.map((service, index) => {
              const Icon = index === 0 ? Wrench : index === 1 ? ShieldCheck : Navigation;
              return (
                <Link className="service-detail" key={service.value} href={`/services/${service.slug}`}>
                  <div className="service-icon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <span className="service-kicker">Live Tyre Rescue quote</span>
                  <h3>{service.label}</h3>
                  <p>{service.longDescription}</p>
                  <strong>
                    View service
                    <ArrowRight size={16} aria-hidden="true" />
                  </strong>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-band experience-band">
        <div className="band-inner experience-layout">
          <div className="experience-copy">
            <span className="eyebrow">Built for customers in a hurry</span>
            <h2>Less guessing, fewer phone calls, better booking details.</h2>
            <p>
              The page is tuned for real tyre emergencies: easy address entry, plain language, visible pricing cues and
              simple next steps.
            </p>
          </div>
          <div className="experience-grid">
            {experienceCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className="experience-card" key={card.title}>
                  <Icon size={22} aria-hidden="true" />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-band" id="areas">
        <div className="band-inner">
          <div className="section-head">
            <h2>Service areas around Edinburgh.</h2>
            <p>Book inside Edinburgh or nearby countryside routes up to 50 miles from the city centre.</p>
          </div>
          <div className="coverage-layout">
            <div className="coverage-panel">
              <MapPin size={28} aria-hidden="true" />
              <h3>50-mile booking area</h3>
              <p>
                The form checks distance from Edinburgh and shows a distance band where possible before the customer
                finishes the booking.
              </p>
              <a href="#book">
                Check your address
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="area-grid compact-area-grid">
              {serviceAreas.map((area) => (
                <Link className="area-card" key={area.slug} href={`/areas/${area.slug}`}>
                  <h3>{area.name}</h3>
                  <p>{area.summary}</p>
                  <span>{area.distance}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-band faq-band">
        <div className="band-inner">
          <div className="section-head">
            <h2>Questions customers ask before booking.</h2>
            <p>Clear answers help customers book with the right tyre, location and timing details.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq) => (
              <article className="faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <span>{siteConfig.name}</span>
          <span>Mobile tyre fitting across Edinburgh and 50 miles around it.</span>
        </div>
      </footer>
    </main>
  );
}

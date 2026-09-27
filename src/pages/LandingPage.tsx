import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Sparkles,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
  Fuel,
  Battery,
  Truck,
  CheckCircle2,
  ChevronDown,
  Star,
  Users,
  Compass,
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { useTranslation } from '../i18n/LanguageContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const services = [
    {
      icon: Fuel,
      title: 'Fuel Emergency Guidance',
      desc: 'Authorized navigation to nearest 24/7 pump or safe towing. Strict adherence to legal fuel safety guidelines.',
    },
    {
      icon: Wrench,
      title: 'Flat Tyre & Puncture Repair',
      desc: 'Mobile puncture unit equipped with on-board 10-bar compressor and spare wheel fitting tools.',
    },
    {
      icon: Battery,
      title: '12V / 24V Battery Jumpstart',
      desc: 'High-amperage booster pack jumpstart, battery testing, alternator diagnosis, and EV 12V auxiliary recovery.',
    },
    {
      icon: Truck,
      title: 'Hydraulic Flatbed Towing',
      desc: 'Safe flatbed towing for EVs, luxury sedans, SUVs, and commercial vehicles with zero wheel drag.',
    },
    {
      icon: ShieldCheck,
      title: 'On-Spot Mechanical Triage',
      desc: 'Clutch bleeding, radiator overheat triage, belt tensioning, and emergency brake inspection.',
    },
    {
      icon: ShieldAlert,
      title: 'Accident & SOS First Response',
      desc: 'High-priority distress response, location broadcast to family, and rapid emergency dispatch.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Tell us what happened',
      desc: 'Speak or type in English, Tamil, Tanglish, or Hindi, or snap a photo of the vehicle problem.',
    },
    {
      number: '02',
      title: 'Share your location',
      desc: 'Instant GPS pinpoint captures your exact highway lane or landmark with zero manual typing.',
    },
    {
      number: '03',
      title: 'Get matched with the right help',
      desc: 'Smart algorithm matches nearby verified mechanics based on tool compatibility and response speed.',
    },
    {
      number: '04',
      title: 'Track until you are back on the road',
      desc: 'Watch the technician vehicle move in real-time, get exact ETA countdown, pay via UPI, and review.',
    },
  ];

  const faqs = [
    {
      q: 'Does RoadResQ provide direct fuel delivery in loose canisters?',
      a: 'For fire safety and government regulations, RoadResQ strictly provides authorized escort to verified 24/7 fuel stations or safe flatbed towing rather than hazardous open canister deliveries.',
    },
    {
      q: 'How does ResQ AI understand Tamil and Tanglish?',
      a: 'ResQ AI includes a natural language roadside model trained on spoken regional phrases like "En bike petrol theernthu pochu" or "Anna start aagala", converting them into structured mechanical triage.',
    },
    {
      q: 'Are service providers verified?',
      a: 'Yes. Every mechanic and tow operator on RoadResQ submits government driving licenses, mechanic certifications, and vehicle registration before admin approval.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'You can settle fees via UPI (GPay, PhonePe, Paytm), credit/debit cards, or cash directly after on-site service completion.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-700 dark:text-blue-300">
            <span className="w-2 h-2 rounded-full bg-[#FF6500] animate-ping" />
            <span>AI-Powered 24/7 Roadside Assistance Network</span>
          </div>

          {/* Heading & Subheading */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Stranded? Get <span className="text-[#FF6500]">Roadside Help.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
              AI-powered roadside assistance that understands your problem and connects you with the right help in minutes.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/assistance')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-black text-base tracking-wide shadow-xl shadow-[#FF6500]/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Wrench className="w-5 h-5" />
              <span>GET ROADSIDE ASSISTANCE</span>
            </button>
            <button
              onClick={() => navigate('/resq-ai')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[#FF6500]" />
              <span>ASK RESQ AI</span>
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">~8 Mins</div>
              <div className="text-xs text-slate-500 font-medium">Average Arrival Time</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">4.9 ★</div>
              <div className="text-xs text-slate-500 font-medium">Customer Rating</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 font-medium">Verified Mechanics</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">24/7</div>
              <div className="text-xs text-slate-500 font-medium">Highway Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#FF6500] uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">How RoadResQ Works</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From the moment your vehicle stops until you safely resume your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.number}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="text-4xl font-black text-slate-200 dark:text-slate-800 mb-4">
                {st.number}
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{st.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPREHENSIVE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Complete Coverage
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Roadside Rescue Services
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Transparent pricing, certified technicians, and specialized mobile vans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{srv.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* RESQ AI SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FF6500]">
              <Sparkles className="w-4 h-4" />
              <span>RESQ AI RESCUE COORDINATOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Speaks Your Language. Understands Your Breakdown.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              ResQ AI does not give generic advice. It detects urgency, provides real-time highway safety instructions, and calls dispatch APIs to bring certified help to your coordinate.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/resq-ai')}
                className="px-6 py-3 rounded-xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-bold text-sm transition"
              >
                Experience ResQ AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Answers regarding safety, pricing, and our dispatch protocol.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{f.q}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="md" showTagline={true} />
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
            © {new Date().getFullYear()} RoadResQ Inc. All rights reserved. 24/7 Rapid Emergency Roadside Triage.
          </div>
        </div>
      </footer>
    </div>
  );
};

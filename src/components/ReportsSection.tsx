import React, { useState } from 'react';
import { FileText, Flame, BookOpen, Send, CheckCircle2, MessageCircle, MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { MinisterialReport, PrayerPetition } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';
import { WHATSAPP_NUMBER } from './WhatsAppWidget';

interface ReportsSectionProps {
  reports: MinisterialReport[];
  onSubmitPetition: (petition: PrayerPetition) => void;
  onOpenNotifications: () => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  reports,
  onSubmitPetition,
  onOpenNotifications
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Prayer petition form state
  const [petName, setPetName] = useState('');
  const [petEmail, setPetEmail] = useState('');
  const [petPhone, setPetPhone] = useState('');
  const [petCategory, setPetCategory] = useState<PrayerPetition['category']>('Ministry Direction');
  const [petText, setPetText] = useState('');
  const [petitionSubmitted, setPetitionSubmitted] = useState(false);

  const categories = ['All', 'Revival Dispatch', 'Building Project', 'Apostolic Communique', 'Field Report'];

  const filteredReports = selectedCategory === 'All'
    ? reports
    : reports.filter((r) => r.category === selectedCategory);

  const handlePetitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName || !petText) return;

    const newPetition: PrayerPetition = {
      id: `pet-${Date.now()}`,
      name: petName,
      email: petEmail || undefined,
      phone: petPhone || undefined,
      category: petCategory,
      petitionText: petText,
      timestamp: 'Just now',
      prayedOver: false
    };

    onSubmitPetition(newPetition);
    soundEffects.playAlertChime();
    setPetitionSubmitted(true);
    setTimeout(() => {
      setPetitionSubmitted(false);
      setPetName('');
      setPetEmail('');
      setPetPhone('');
      setPetText('');
    }, 4000);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>Apostolic Dispatches & Field Intelligence</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Ministerial Reports & Updates
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Official communiques from Apostle Nicholas Dlamini documenting end-time revival outbreaks, church building milestones, and doctrinal alerts across communities.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const isExpanded = expandedReportId === report.id;

          return (
            <div
              key={report.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-600/40 rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {report.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{report.date}</span>
                  </span>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-white leading-snug">
                  {report.title}
                </h3>

                {report.location && (
                  <p className="text-xs text-amber-400/90 flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{report.location}</span>
                  </p>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.summary}
                </p>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs text-slate-300 animate-fadeIn">
                    {report.content.map((p, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {report.scriptures && report.scriptures.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-300/90 font-editorial italic">
                        Scriptural Grounding: {report.scriptures.join(' · ')}
                      </div>
                    )}

                    {report.stats && report.stats.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                        {report.stats.map((s, idx) => (
                          <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="font-mono text-xs font-bold text-white block">
                              {s.value}
                            </span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block mt-0.5">
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 italic">
                  By {report.author}
                </span>
                <button
                  onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {isExpanded ? 'Show Less ↑' : 'Read Full Dispatch →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pastoral Prayer Request & Apostolic Covering Box */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border border-amber-600/30 p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Apostolic Intercession & Pastoral Altar</span>
            </div>
            
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
              Submit Your Prayer Petition to Apostle Nicholas
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Every request is brought before the morning prayer altar of the Smart Leaders Family of Churches. We believe God for miraculous deliverance, financial breakthrough, and divine alignment.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/26879309372?text=${encodeURIComponent('Shalom Apostle Nicholas, I am reaching out for pastoral prayer and agreement.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pray via WhatsApp ({WHATSAPP_NUMBER})</span>
              </a>

              <button
                onClick={onOpenNotifications}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-600/40 text-xs font-medium"
              >
                Enable Push Alerts
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            {petitionSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3 text-xs animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-cinzel text-base font-bold text-white">
                  Petition Received & Covered
                </h4>
                <p className="text-slate-300 max-w-md mx-auto">
                  Thank you, {petName}. Your petition has been recorded in the S.M.A.R.T intercessory queue and backed up to your account. Apostle Nicholas Dlamini and the prayer team will stand with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePetitionSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor David"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number (Call / WhatsApp)
                    </label>
                    <input
                      type="tel"
                      placeholder="+268 76... or +27 82..."
                      value={petPhone}
                      onChange={(e) => setPetPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@domain.com"
                      value={petEmail}
                      onChange={(e) => setPetEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Petition Focus
                    </label>
                    <select
                      value={petCategory}
                      onChange={(e) => setPetCategory(e.target.value as PrayerPetition['category'])}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Ministry Direction">Ministry Direction & Apostolic Call</option>
                      <option value="Deliverance & Healing">Deliverance & Physical Healing</option>
                      <option value="Church Planting">Church Planting & Territorial Authority</option>
                      <option value="Financial Breakthrough">Financial Breakthrough & Projects</option>
                      <option value="Family & Marriage">Family & Marriage Protection</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Specific Prayer Petition
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your situation in faith. Apostle Nicholas will agree with you..."
                    value={petText}
                    onChange={(e) => setPetText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Apostolic Prayer Altar</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

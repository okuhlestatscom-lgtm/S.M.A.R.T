import React, { useState } from 'react';
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Radio,
  Users,
  Mail,
  Check,
  ArrowRight,
  Send,
  Compass,
  Bell,
  BellRing,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ItineraryEvent, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_NAME } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';

interface ItinerarySectionProps {
  itinerary: ItineraryEvent[];
  onOpenLive: () => void;
  onRsvpSuccess: (eventId: string, guestName: string) => void;
  onSyncNotificationReminder?: (event: ItineraryEvent) => void;
  onShowToast: (msg: string) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  itinerary,
  onOpenLive,
  onRsvpSuccess,
  onSyncNotificationReminder,
  onShowToast,
}) => {
  // View mode: 'calendar' or 'agenda'
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');

  // Month navigation for interactive calendar (starts Nov 2026)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Nov 2026, 1 = Dec 2026, 2 = Jan 2027, etc.

  // Calendar dates definition
  const months = [
    { name: 'November 2026', year: 2026, month: 10, daysInMonth: 30, startDayOfWeek: 0 }, // Sun Nov 1
    { name: 'December 2026', year: 2026, month: 11, daysInMonth: 31, startDayOfWeek: 2 }, // Tue Dec 1
    { name: 'January 2027', year: 2027, month: 0, daysInMonth: 31, startDayOfWeek: 5 },   // Fri Jan 1
    { name: 'February 2027', year: 2027, month: 1, daysInMonth: 28, startDayOfWeek: 1 },  // Mon Feb 1
    { name: 'March 2027', year: 2027, month: 2, daysInMonth: 31, startDayOfWeek: 1 },     // Mon Mar 1
  ];

  const currentMonth = months[currentMonthIndex];

  // Selected date in calendar view
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(12); // default Nov 12

  // Track synced reminders in local state
  const [syncedEventIds, setSyncedEventIds] = useState<Record<string, boolean>>({});

  // RSVP Modal
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<ItineraryEvent | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpDelegates, setRsvpDelegates] = useState('1');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Invite Apostle Nicholas modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteMinistry, setInviteMinistry] = useState('');
  const [inviteCity, setInviteCity] = useState('');
  const [inviteDates, setInviteDates] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRsvp) return;
    onRsvpSuccess(selectedEventForRsvp.id, rsvpName);
    setRsvpSubmitted(true);
    soundEffects.playAlertChime();
    setTimeout(() => {
      setRsvpSubmitted(false);
      setSelectedEventForRsvp(null);
      setRsvpName('');
      setRsvpEmail('');
      onShowToast(`Reservation confirmed for ${selectedEventForRsvp.city}! Check your email for badge.`);
    }, 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSuccess(true);
    soundEffects.playAlertChime();
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteOpen(false);
      setInviteMinistry('');
      setInviteCity('');
      setInviteDates('');
      setInviteEmail('');
      onShowToast('Apostolic invitation submitted to secretariat.');
    }, 2000);
  };

  // Sync event with notification system
  const handleSyncNotification = (event: ItineraryEvent) => {
    setSyncedEventIds((prev) => ({ ...prev, [event.id]: true }));
    soundEffects.playAlertChime();

    if (onSyncNotificationReminder) {
      onSyncNotificationReminder(event);
    } else {
      onShowToast(`Reminder for "${event.title}" synced with notification bell!`);
    }
  };

  // Generate .ics calendar file download
  const handleDownloadIcs = (event: ItineraryEvent) => {
    const cleanTitle = event.title.replace(/[^a-zA-Z0-9 ]/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SMART Ministry Tools//Apostle Nicholas Dlamini//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${event.id}-${Date.now()}@smartministrytools.org
SUMMARY:${event.title} - Apostle Nicholas Dlamini
DESCRIPTION:Theme: ${event.theme}\\nVenue: ${event.venue}\\nSpeaker: Apostle Nicholas Dlamini\\nLive Stream: ${event.livestreamUrl || YOUTUBE_CHANNEL_URL}\\nScripture: ${event.scripture}
LOCATION:${event.venue}, ${event.city}, ${event.country}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title} with Apostle Nicholas Dlamini starts in 2 hours.
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanTitle.replace(/\s+/g, '_')}_Apostle_Nicholas.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast(`Calendar invite (.ics) downloaded for ${event.city}`);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (event: ItineraryEvent) => {
    const title = encodeURIComponent(`${event.title} — Apostle Nicholas Dlamini`);
    const details = encodeURIComponent(
      `Apostolic Summit with Apostle Nicholas Dlamini.\nTheme: ${event.theme}\nHost: ${event.hostMinistry}\nScripture: ${event.scripture}\nLive Stream: ${event.livestreamUrl || YOUTUBE_CHANNEL_URL}`
    );
    const location = encodeURIComponent(`${event.venue}, ${event.city}, ${event.country}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Filter events matching the current view month for calendar view
  const eventsInCurrentMonth = itinerary.filter((ev) => {
    const date = new Date(ev.startDateISO);
    return date.getFullYear() === currentMonth.year && date.getMonth() === currentMonth.month;
  });

  // Get events on a specific day number of current month
  const getEventsOnDay = (day: number) => {
    return eventsInCurrentMonth.filter((ev) => {
      const date = new Date(ev.startDateISO);
      const startDay = date.getDate();
      // Multi-day check
      if (ev.endDateISO) {
        const endDate = new Date(ev.endDateISO);
        const endDay = endDate.getDate();
        return day >= startDay && day <= endDay;
      }
      return day === startDay;
    });
  };

  const selectedDayEvents = selectedDayNumber ? getEventsOnDay(selectedDayNumber) : [];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-2">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Apostolic Tour & Global Convocation Schedule</span>
          </div>
          <h2 className="text-3xl font-cinzel font-bold text-white">
            Live Event Calendar & Itinerary
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore Apostle Nicholas Dlamini's upcoming ministry engagements across nations. Sync reminders with your notification bell, reserve leadership seats, or stream live sessions via YouTube.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'agenda'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Agenda List ({itinerary.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-semibold rounded-xl border border-amber-800/60 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Invite Apostle</span>
          </button>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Month Navigator */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  {currentMonth.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {eventsInCurrentMonth.length} Apostolic Engagement{eventsInCurrentMonth.length !== 1 ? 's' : ''} Scheduled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (currentMonthIndex > 0) {
                    setCurrentMonthIndex(currentMonthIndex - 1);
                    setSelectedDayNumber(null);
                  }
                }}
                disabled={currentMonthIndex === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (currentMonthIndex < months.length - 1) {
                    setCurrentMonthIndex(currentMonthIndex + 1);
                    setSelectedDayNumber(null);
                  }
                }}
                disabled={currentMonthIndex === months.length - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
            {/* Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Blank cells for start of month */}
              {Array.from({ length: currentMonth.startDayOfWeek }).map((_, i) => (
                <div key={`blank-${i}`} className="min-h-[64px] sm:min-h-[82px] rounded-xl bg-slate-950/40 border border-transparent opacity-30" />
              ))}

              {/* Day cells */}
              {Array.from({ length: currentMonth.daysInMonth }).map((_, i) => {
                const dayNumber = i + 1;
                const dayEvents = getEventsOnDay(dayNumber);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDayNumber === dayNumber;

                return (
                  <button
                    key={`day-${dayNumber}`}
                    onClick={() => setSelectedDayNumber(dayNumber)}
                    className={`min-h-[64px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-xl text-left flex flex-col justify-between transition-all border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30'
                        : hasEvents
                        ? 'bg-slate-950 border-amber-600/40 hover:border-amber-500'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-amber-400' : hasEvents ? 'text-white' : 'text-slate-400'
                      }`}>
                        {dayNumber}
                      </span>
                      {hasEvents && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>

                    {hasEvents && (
                      <div className="space-y-1 w-full">
                        {dayEvents.slice(0, 1).map((ev) => (
                          <div
                            key={ev.id}
                            className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-medium truncate w-full"
                          >
                            {ev.city}
                          </div>
                        ))}
                        {dayEvents.length > 1 && (
                          <span className="text-[9px] font-mono text-slate-400 block text-right">
                            +{dayEvents.length - 1} more
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Events Drawer */}
          {selectedDayNumber && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-amber-400" />
                  <h4 className="font-cinzel text-base font-bold text-white">
                    Events on {currentMonth.name.split(' ')[0]} {selectedDayNumber}, {currentMonth.year}
                  </h4>
                </div>
                <span className="text-xs font-mono text-amber-400">
                  {selectedDayEvents.length} Event{selectedDayEvents.length !== 1 ? 's' : ''} Scheduled
                </span>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No public ministerial events scheduled for this exact date. Click any highlighted date above to review regional summits.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold">
                            {ev.city}, {ev.country}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {ev.dateRange}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-800/40 flex items-center gap-1">
                            <Radio className="w-2.5 h-2.5 fill-red-400" />
                            <span>YouTube Live Stream</span>
                          </span>
                        </div>

                        <h5 className="font-cinzel text-lg font-bold text-white">
                          {ev.title}
                        </h5>
                        <p className="text-xs text-amber-300 italic">
                          "{ev.theme}"
                        </p>
                        <p className="text-xs text-slate-300">
                          <strong>Venue:</strong> {ev.venue} · <strong>Times:</strong> {ev.sessionTimes}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {/* Live Stream link */}
                        <a
                          href={ev.livestreamUrl || YOUTUBE_CHANNEL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                        >
                          <Radio className="w-3.5 h-3.5 fill-white" />
                          <span>Watch on YouTube</span>
                        </a>

                        {/* Sync notification button */}
                        <button
                          onClick={() => handleSyncNotification(ev)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            syncedEventIds[ev.id]
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          {syncedEventIds[ev.id] ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Reminder Synced ✓</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 text-amber-400" />
                              <span>Sync Reminder</span>
                            </>
                          )}
                        </button>

                        {/* RSVP button */}
                        <button
                          onClick={() => setSelectedEventForRsvp(ev)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow"
                        >
                          RSVP Seats
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: CHRONOLOGICAL AGENDA CARDS */}
      {viewMode === 'agenda' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itinerary.map((event) => {
            const percentFull = Math.min(100, Math.round((event.rsvpCount / event.rsvpCapacity) * 100));
            const isSynced = syncedEventIds[event.id];

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-600/40 transition-all p-6 flex flex-col justify-between shadow-xl relative"
              >
                <div>
                  {/* Location & Status Line */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{event.city}, {event.country}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600/20 text-red-400 border border-red-800/40 flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5 fill-red-400" />
                        <span>Live Stream</span>
                      </span>
                      <span className="text-slate-500 font-mono">{event.status}</span>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h3 className="font-cinzel text-xl font-bold text-white leading-snug">
                    {event.title}
                  </h3>

                  {/* Theme */}
                  <p className="text-xs text-amber-300 font-editorial italic mt-1">
                    "{event.theme}"
                  </p>

                  {/* Speaker */}
                  <div className="mt-2 text-xs text-slate-300 flex items-center gap-1.5">
                    <span className="text-slate-500">Minister:</span>
                    <strong className="text-white font-medium">{event.speaker || 'Apostle Nicholas Dlamini'}</strong>
                  </div>

                  {/* Host Church & Venue */}
                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 font-medium w-16 shrink-0">Host:</span>
                      <span className="font-medium text-slate-200">{event.hostMinistry}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 font-medium w-16 shrink-0">Venue:</span>
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium text-slate-200">{event.dateRange}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{event.sessionTimes}</span>
                    </div>
                  </div>

                  {/* Scripture Anchor */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Scripture Anchor:</span>
                    <span className="font-mono text-amber-400 font-semibold">{event.scripture}</span>
                  </div>

                  {/* RSVP Capacity Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>Delegation RSVPs</span>
                      <span>
                        {event.rsvpCount} / {event.rsvpCapacity} registered ({percentFull}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${percentFull}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions Strip */}
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* RSVP */}
                    <button
                      onClick={() => setSelectedEventForRsvp(event)}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Reserve Seat / RSVP</span>
                    </button>

                    {/* Watch Live on YouTube */}
                    <a
                      href={event.livestreamUrl || YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow"
                      title="Watch Live Stream on YouTube"
                    >
                      <Radio className="w-3.5 h-3.5 fill-white" />
                      <span>Live Stream</span>
                    </a>
                  </div>

                  {/* Secondary calendar sync & reminders row */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    {/* Sync with Notifications */}
                    <button
                      onClick={() => handleSyncNotification(event)}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                        isSynced
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                      title="Sync reminder alert with the notification bell"
                    >
                      {isSynced ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Reminder Synced ✓</span>
                        </>
                      ) : (
                        <>
                          <BellRing className="w-3 h-3 text-amber-400" />
                          <span>Sync with Notifications</span>
                        </>
                      )}
                    </button>

                    {/* Google Calendar Link */}
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors"
                      title="Add to Google Calendar"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* iCal .ics download */}
                    <button
                      onClick={() => handleDownloadIcs(event)}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors"
                      title="Download .ics Calendar File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Modal */}
      {selectedEventForRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Reserve Seats for {selectedEventForRsvp.city}
            </h3>
            <p className="text-xs text-amber-300 mt-1">
              {selectedEventForRsvp.title} · {selectedEventForRsvp.dateRange}
            </p>

            {rsvpSubmitted ? (
              <div className="my-8 text-center p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">Seat Reserved Successfully</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Confirmation and schedule details have been dispatched to {rsvpEmail}. We look forward to receiving you ministerially.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastor David Osei / Minister Sarah"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address (for delegate badge)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="leader@ministry.org"
                    value={rsvpEmail}
                    onChange={(e) => setRsvpEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Number of Ministry Leaders Attending
                  </label>
                  <select
                    value={rsvpDelegates}
                    onChange={(e) => setRsvpDelegates(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="1">1 Delegate (Personal Registration)</option>
                    <option value="2">2 Ministry Leaders</option>
                    <option value="5">5 Leaders (Pastoral Delegation)</option>
                    <option value="10">10+ Leaders (Full Elders Board)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForRsvp(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                  >
                    Confirm RSVP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invite Apostle Nicholas Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Invite Apostle Nicholas Dlamini
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Submit your ministerial request for summits, bootcamps, or apostolic conferences.
            </p>

            {inviteSuccess ? (
              <div className="my-8 text-center p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">Invitation Submitted</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The ministerial office will review your dates and prayerfully correspond via {inviteEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Host Church / Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Apostolic Assembly"
                    value={inviteMinistry}
                    onChange={(e) => setInviteMinistry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City & Country
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Windhoek, Namibia"
                    value={inviteCity}
                    onChange={(e) => setInviteCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Proposed Dates
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. March 15 - 18, 2027"
                    value={inviteDates}
                    onChange={(e) => setInviteDates(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Secretariat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="office@graceapostolic.org"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};

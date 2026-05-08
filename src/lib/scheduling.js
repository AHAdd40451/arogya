import { addMinutes, isAfter, isBefore, format, addDays, startOfDay } from "date-fns";

/**
 * Parse "9:00 AM" or "5:00 PM" → [hours24, minutes]
 */
export function parseHourStr(str) {
  if (!str) return [9, 0];
  const parts = str.trim().split(" ");
  const [h, m = 0] = parts[0].split(":").map(Number);
  const meridiem = parts[1];
  let hour = h;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return [hour, m];
}

/**
 * Convert provider-local date+time to a UTC Date object.
 * Uses Intl.DateTimeFormat to derive the timezone offset at that moment,
 * so it handles DST correctly without needing date-fns-tz.
 *
 * @param {string} dateStr  "YYYY-MM-DD"
 * @param {number} hour     24-hour
 * @param {number} minute
 * @param {string|undefined} tz  IANA timezone, e.g. "America/Los_Angeles"
 */
export function providerLocalToUTC(dateStr, hour, minute, tz) {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Build an approximate UTC timestamp close to the target time
  const ref = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  if (!tz) return ref;

  // Ask Intl what this UTC instant looks like in the provider's timezone
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(ref);

  const tzH = parseInt(parts.find((p) => p.type === "hour").value,   10);
  const tzM = parseInt(parts.find((p) => p.type === "minute").value, 10);

  // Compute the correction needed
  let diffMin = (hour * 60 + minute) - (tzH * 60 + tzM);
  // Handle day-boundary wrap-around
  if (diffMin >  720) diffMin -= 1440;
  if (diffMin < -720) diffMin += 1440;

  return new Date(ref.getTime() + diffMin * 60_000);
}

/**
 * Get the 3-letter weekday abbreviation ("Mon"…"Sun") for a Date
 * expressed in the provider's timezone.
 */
export function getDayAbbrev(date, tz) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz || undefined,
    weekday: "short",
  }).format(date);
}

/**
 * Generate slot start times (as UTC Date objects) for a given calendar date
 * and provider availability settings.
 *
 * @param {string} dateStr "YYYY-MM-DD"
 * @param {Object} provider
 */
export function generateSlots(dateStr, provider) {
  const {
    availability_days   = [],
    availability_start  = "9:00 AM",
    availability_end    = "5:00 PM",
    slot_duration_minutes = 15,
    time_zone,
  } = provider;

  // Check that this weekday is in the provider's working days
  const refDate = new Date(`${dateStr}T12:00:00Z`);
  const dayAbbrev = getDayAbbrev(refDate, time_zone);
  if (availability_days.length > 0 && !availability_days.includes(dayAbbrev)) {
    return [];
  }

  const [sh, sm] = parseHourStr(availability_start);
  const [eh, em] = parseHourStr(availability_end);

  const startUTC = providerLocalToUTC(dateStr, sh, sm, time_zone);
  const endUTC   = providerLocalToUTC(dateStr, eh, em, time_zone);

  const slots = [];
  let cursor = startUTC;
  while (true) {
    const next = addMinutes(cursor, slot_duration_minutes);
    if (isAfter(next, endUTC)) break;
    slots.push(new Date(cursor));
    cursor = next;
  }
  return slots;
}

/**
 * Return a Set of ISO strings for slots that overlap any booked window.
 *
 * @param {Date[]} slots
 * @param {Array<{starts_at:string,ends_at:string}>} bookedTimes
 * @param {number} slotDuration  minutes
 */
export function getBookedSlotStarts(slots, bookedTimes, slotDuration) {
  const disabled = new Set();
  for (const slot of slots) {
    const slotEnd = addMinutes(slot, slotDuration);
    for (const booked of bookedTimes) {
      const bStart = new Date(booked.starts_at);
      const bEnd   = new Date(booked.ends_at);
      if (isBefore(slot, bEnd) && isAfter(slotEnd, bStart)) {
        disabled.add(slot.toISOString());
        break;
      }
    }
  }
  return disabled;
}

/**
 * Format a UTC Date as a local time string in the provider's timezone.
 * e.g., "9:00 AM"
 */
export function formatSlotTime(utcDate, tz) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz || undefined,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(utcDate);
}

/**
 * Check if a provider is available right now:
 * is_online=true AND current UTC time falls within their availability window for today.
 */
export function isAvailableNow(provider) {
  if (!provider.is_online) return false;
  const now = new Date();
  const dayAbbrev = getDayAbbrev(now, provider.time_zone);
  if (provider.availability_days?.length > 0 && !provider.availability_days.includes(dayAbbrev)) {
    return false;
  }
  const todayStr = format(now, "yyyy-MM-dd");
  const [sh, sm] = parseHourStr(provider.availability_start || "9:00 AM");
  const [eh, em] = parseHourStr(provider.availability_end   || "5:00 PM");
  const startUTC = providerLocalToUTC(todayStr, sh, sm, provider.time_zone);
  const endUTC   = providerLocalToUTC(todayStr, eh, em, provider.time_zone);
  return isAfter(now, startUTC) && isBefore(now, endUTC);
}

/**
 * Return a human-readable "next available" string for a provider card.
 * Looks up to 14 days ahead.
 */
export function getNextAvailable(provider) {
  const now = new Date();
  for (let i = 0; i <= 13; i++) {
    const date    = addDays(startOfDay(now), i);
    const dateStr = format(date, "yyyy-MM-dd");
    const slots   = generateSlots(dateStr, provider);
    const future  = slots.filter((s) => isAfter(s, now));
    if (future.length > 0) {
      const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(date, "EEE, MMM d");
      return `${dayLabel} at ${formatSlotTime(future[0], provider.time_zone)}`;
    }
  }
  return "No availability soon";
}

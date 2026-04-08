import { OPENING_HOURS, type OpeningHour } from '@/data/contact';

type OpeningHourGroup = { label: string; hours: string };

/**
 * Collapse consecutive days that share the same hours into a single label.
 * E.g. 6× "10h00 - 14h00 • 15h00 - 19h00" → "Lundi → Samedi".
 */
function groupOpeningHours(hours: OpeningHour[] = OPENING_HOURS): OpeningHourGroup[] {
  const groups: OpeningHourGroup[] = [];
  let i = 0;
  while (i < hours.length) {
    let j = i;
    while (j + 1 < hours.length && hours[j + 1].hours === hours[i].hours) j++;
    groups.push({
      label: i === j ? hours[i].day : `${hours[i].day} → ${hours[j].day}`,
      hours: hours[i].hours,
    });
    i = j + 1;
  }
  return groups;
}

type Props = {
  /** Center-align label and chips (used in narrow centered layouts like FooterMenu). */
  centered?: boolean;
};

/**
 * Shared opening hours renderer.
 *
 * Single source of truth: `OPENING_HOURS`. Days with identical hours are
 * collapsed into a range label, then each time slot is rendered as a borderless
 * chip. Used in ContactInfo, FooterContact, FooterMenu and FullScreenMenu so
 * the visual treatment stays consistent across the site.
 */
export function OpeningHoursList({ centered = false }: Props = {}) {
  const groups = groupOpeningHours();

  return (
    <dl className={`space-y-3 ${centered ? 'text-center' : ''}`}>
      {groups.map((group) => {
        const isClosed = group.hours === 'Fermé';
        const slots = isClosed ? ['Fermé'] : group.hours.split('•').map((s) => s.trim());

        return (
          <div key={group.label}>
            <dt className="mb-1.5 text-body-xs font-medium uppercase tracking-widest text-secondary-blue">
              {group.label}
            </dt>
            <dd className={`flex flex-wrap gap-1.5 ${centered ? 'justify-center' : ''}`}>
              {slots.map((slot, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-body-sm tabular-nums ${
                    isClosed ? 'bg-white/5 text-white/60' : 'bg-white/[0.08] text-white'
                  }`}
                >
                  {slot}
                </span>
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

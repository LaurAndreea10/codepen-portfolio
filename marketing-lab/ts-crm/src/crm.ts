/**
 * Mini-CRM core — strict TypeScript, pure functions, no DOM.
 * Compiled with `tsc` and used by Marketing Lab (#09). Author: Laura Andreea.
 */

export const STAGES = ['lead', 'calificat', 'propunere', 'negociere', 'castigat', 'pierdut'] as const;
export type Stage = (typeof STAGES)[number];

export type Contact = {
  readonly id: string;
  name: string;
  email: string;
  company: string;
  value: number;          // deal value, EUR
  stage: Stage;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type ContactInput = Pick<Contact, 'name' | 'email' | 'company'> & Partial<Pick<Contact, 'value' | 'stage' | 'tags'>>;

export type ValidationError = { field: keyof ContactInput; code: 'required' | 'invalid' | 'range' | 'duplicate'; message: string };

export type Result<T, E> = { ok: true; value: T } | { ok: false; errors: E };

/** Allowed transitions — a won/lost deal can only be reopened as a lead. */
const TRANSITIONS: Record<Stage, readonly Stage[]> = {
  lead: ['calificat', 'pierdut'],
  calificat: ['propunere', 'lead', 'pierdut'],
  propunere: ['negociere', 'calificat', 'pierdut'],
  negociere: ['castigat', 'propunere', 'pierdut'],
  castigat: ['lead'],
  pierdut: ['lead']
};

/** Probability of closing per stage — used for the weighted forecast. */
export const WIN_PROBABILITY: Record<Stage, number> = {
  lead: 0.1, calificat: 0.25, propunere: 0.5, negociere: 0.75, castigat: 1, pierdut: 0
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isStage(x: unknown): x is Stage {
  return typeof x === 'string' && (STAGES as readonly string[]).includes(x);
}

export function validateContact(input: ContactInput, existing: readonly Contact[] = [], ignoreId?: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const name = input.name?.trim() ?? '';
  const email = input.email?.trim().toLowerCase() ?? '';
  if (!name) errors.push({ field: 'name', code: 'required', message: 'Numele este obligatoriu' });
  else if (name.length < 2) errors.push({ field: 'name', code: 'invalid', message: 'Numele e prea scurt' });
  if (!email) errors.push({ field: 'email', code: 'required', message: 'Emailul este obligatoriu' });
  else if (!EMAIL_RE.test(email)) errors.push({ field: 'email', code: 'invalid', message: 'Email invalid' });
  else if (existing.some(c => c.email === email && c.id !== ignoreId)) errors.push({ field: 'email', code: 'duplicate', message: 'Există deja un contact cu acest email' });
  if (!input.company?.trim()) errors.push({ field: 'company', code: 'required', message: 'Compania este obligatorie' });
  if (input.value !== undefined && (!Number.isFinite(input.value) || input.value < 0 || input.value > 10_000_000)) {
    errors.push({ field: 'value', code: 'range', message: 'Valoarea trebuie să fie între 0 și 10.000.000' });
  }
  if (input.stage !== undefined && !isStage(input.stage)) errors.push({ field: 'stage', code: 'invalid', message: 'Etapă necunoscută' });
  return errors;
}

let counter = 0;
export function makeId(now: number = Date.now()): string {
  counter = (counter + 1) % 1_000_000;
  return `c_${now.toString(36)}_${counter.toString(36)}`;
}

export function createContact(input: ContactInput, existing: readonly Contact[] = [], now: number = Date.now()): Result<Contact, ValidationError[]> {
  const errors = validateContact(input, existing);
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      id: makeId(now),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      company: input.company.trim(),
      value: input.value ?? 0,
      stage: input.stage ?? 'lead',
      tags: normalizeTags(input.tags ?? []),
      createdAt: now,
      updatedAt: now
    }
  };
}

export function normalizeTags(tags: readonly string[]): string[] {
  return [...new Set(tags.map(t => t.trim().toLowerCase()).filter(Boolean))].sort();
}

export function canMove(from: Stage, to: Stage): boolean {
  return TRANSITIONS[from].includes(to);
}

export function nextStages(from: Stage): readonly Stage[] {
  return TRANSITIONS[from];
}

export function moveStage(contact: Contact, to: Stage, now: number = Date.now()): Result<Contact, string> {
  if (!canMove(contact.stage, to)) return { ok: false, errors: `Tranziție nepermisă: ${contact.stage} → ${to}` };
  return { ok: true, value: { ...contact, stage: to, updatedAt: now } };
}

export type PipelineSummary = {
  byStage: Record<Stage, { count: number; value: number }>;
  openValue: number;
  weightedForecast: number;
  winRate: number;         // won / (won + lost)
};

export function summarize(contacts: readonly Contact[]): PipelineSummary {
  const byStage = Object.fromEntries(STAGES.map(s => [s, { count: 0, value: 0 }])) as Record<Stage, { count: number; value: number }>;
  let weightedForecast = 0;
  for (const c of contacts) {
    byStage[c.stage].count++;
    byStage[c.stage].value += c.value;
    if (c.stage !== 'castigat' && c.stage !== 'pierdut') weightedForecast += c.value * WIN_PROBABILITY[c.stage];
  }
  const openValue = STAGES.filter(s => s !== 'castigat' && s !== 'pierdut').reduce((sum, s) => sum + byStage[s].value, 0);
  const closed = byStage.castigat.count + byStage.pierdut.count;
  return { byStage, openValue, weightedForecast: Math.round(weightedForecast), winRate: closed ? byStage.castigat.count / closed : 0 };
}

export function search(contacts: readonly Contact[], query: string): Contact[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...contacts];
  const terms = q.split(/\s+/);
  return contacts.filter(c => {
    const hay = `${c.name} ${c.email} ${c.company} ${c.tags.join(' ')}`.toLowerCase();
    return terms.every(t => hay.includes(t));
  });
}

export type SortKey = 'name' | 'value' | 'updatedAt';
export function sortBy(contacts: readonly Contact[], key: SortKey, dir: 'asc' | 'desc' = 'asc'): Contact[] {
  const m = dir === 'asc' ? 1 : -1;
  return [...contacts].sort((a, b) => {
    const x = a[key], y = b[key];
    return (typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y, 'ro') : (x as number) - (y as number)) * m;
  });
}

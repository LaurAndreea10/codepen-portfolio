import { describe, it, expect } from 'vitest';
import { createContact, validateContact, moveStage, canMove, summarize, search, sortBy, normalizeTags, type Contact } from '../src/crm';

const base = { name: 'Ioana Rusu', email: 'Ioana@Nova.ro', company: 'Nova SRL', value: 12000 };
const make = (over: Partial<typeof base> & { stage?: Contact['stage'] } = {}, list: Contact[] = []) => {
  const r = createContact({ ...base, ...over }, list, 1_700_000_000_000);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.value;
};

describe('validateContact', () => {
  it('accepts a valid contact', () => expect(validateContact(base)).toEqual([]));
  it('requires name, email, company', () => {
    const e = validateContact({ name: '', email: '', company: '' });
    expect(e.map(x => x.field).sort()).toEqual(['company', 'email', 'name']);
  });
  it('rejects invalid emails', () => expect(validateContact({ ...base, email: 'ioana@' })[0]?.code).toBe('invalid'));
  it('detects duplicate emails case-insensitively', () => {
    const c = make();
    expect(validateContact({ ...base, email: 'IOANA@nova.ro' }, [c])[0]?.code).toBe('duplicate');
    expect(validateContact({ ...base }, [c], c.id)).toEqual([]);
  });
  it('checks the value range', () => expect(validateContact({ ...base, value: -5 })[0]?.code).toBe('range'));
});

describe('createContact', () => {
  it('normalises email and defaults stage to lead', () => {
    const c = make();
    expect(c.email).toBe('ioana@nova.ro');
    expect(c.stage).toBe('lead');
    expect(c.id).toMatch(/^c_/);
  });
  it('returns errors instead of throwing', () => {
    const r = createContact({ name: 'A', email: 'x', company: '' });
    expect(r.ok).toBe(false);
  });
  it('normalises tags', () => expect(normalizeTags([' VIP', 'vip', 'saas', ''])).toEqual(['saas', 'vip']));
});

describe('pipeline', () => {
  it('only allows defined transitions', () => {
    expect(canMove('lead', 'calificat')).toBe(true);
    expect(canMove('lead', 'castigat')).toBe(false);
    const r = moveStage(make(), 'castigat');
    expect(r.ok).toBe(false);
  });
  it('moves immutably', () => {
    const c = make();
    const r = moveStage(c, 'calificat', 5);
    expect(r.ok && r.value.stage).toBe('calificat');
    expect(c.stage).toBe('lead');
  });
  it('summarises value, forecast and win rate', () => {
    const list = [
      make({ email: 'a@a.ro', value: 1000 }),
      make({ email: 'b@b.ro', value: 2000, stage: 'negociere' }),
      make({ email: 'c@c.ro', value: 3000, stage: 'castigat' }),
      make({ email: 'd@d.ro', value: 4000, stage: 'pierdut' })
    ];
    const s = summarize(list);
    expect(s.openValue).toBe(3000);
    expect(s.weightedForecast).toBe(1000 * 0.1 + 2000 * 0.75);
    expect(s.winRate).toBe(0.5);
    expect(s.byStage.castigat.value).toBe(3000);
  });
});

describe('search & sort', () => {
  const list = [make({ name: 'Mihai Stan', email: 'm@x.ro', company: 'Orbit' }), make({ name: 'Ana Pop', email: 'a@x.ro', company: 'Nova', value: 50 })];
  it('matches all terms across fields', () => {
    expect(search(list, 'mihai orbit').length).toBe(1);
    expect(search(list, 'nova').map(c => c.name)).toEqual(['Ana Pop']);
    expect(search(list, '').length).toBe(2);
  });
  it('sorts by name and value', () => {
    expect(sortBy(list, 'name')[0]?.name).toBe('Ana Pop');
    expect(sortBy(list, 'value', 'desc')[0]?.name).toBe('Mihai Stan');
  });
});

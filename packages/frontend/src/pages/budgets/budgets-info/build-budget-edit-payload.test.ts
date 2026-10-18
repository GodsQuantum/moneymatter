import { describe, expect, it } from 'vitest';

import { buildBudgetEditPayload } from './build-budget-edit-payload';

describe('buildBudgetEditPayload', () => {
  const baseValues = { name: 'Groceries', startDate: null, endDate: null };

  it.each([null, undefined, '', 0, -50, Number.NaN])('sends a null limit for %s', (limitAmount) => {
    expect(buildBudgetEditPayload({ ...baseValues, limitAmount }).limitAmount).toBeNull();
  });

  it('keeps a positive limit, including numeric strings', () => {
    expect(buildBudgetEditPayload({ ...baseValues, limitAmount: 250 }).limitAmount).toBe(250);
    expect(buildBudgetEditPayload({ ...baseValues, limitAmount: '99.5' }).limitAmount).toBe(99.5);
  });

  it('serializes the start date as start of day and missing dates to null', () => {
    const startDate = new Date(2026, 8, 23, 15, 30);
    const payload = buildBudgetEditPayload({ ...baseValues, limitAmount: null, startDate });

    expect(payload.startDate).toBe(new Date(2026, 8, 23).toISOString());
    expect(payload.endDate).toBeNull();
  });

  it('serializes the end date as end of day', () => {
    const endDate = new Date(2026, 8, 30, 9, 15);
    const payload = buildBudgetEditPayload({ ...baseValues, limitAmount: null, endDate });

    expect(payload.endDate).toBe(new Date(2026, 8, 30, 23, 59, 59, 999).toISOString());
  });

  it('includes categoryIds only when given', () => {
    expect('categoryIds' in buildBudgetEditPayload({ ...baseValues, limitAmount: null })).toBe(false);
    expect(buildBudgetEditPayload({ ...baseValues, limitAmount: null, categoryIds: ['cat-1'] })).toEqual({
      name: 'Groceries',
      limitAmount: null,
      startDate: null,
      endDate: null,
      categoryIds: ['cat-1'],
    });
  });
});

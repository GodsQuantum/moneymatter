import { endOfDay, startOfDay } from 'date-fns';

interface BudgetFormValues {
  name: string;
  limitAmount: number | string | null | undefined;
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categoryIds?: string[];
}

interface BudgetPayload {
  name: string;
  limitAmount: number | null;
  startDate: string | null;
  endDate: string | null;
  categoryIds?: string[];
}

/** Anything but a positive finite number clears the limit (`null`). */
export const buildBudgetPayload = ({
  name,
  limitAmount,
  startDate,
  endDate,
  categoryIds,
}: BudgetFormValues): BudgetPayload => {
  const limit = limitAmount === '' || limitAmount == null ? NaN : Number(limitAmount);

  return {
    name,
    limitAmount: Number.isFinite(limit) && limit > 0 ? limit : null,
    startDate: startDate ? startOfDay(startDate).toISOString() : null,
    endDate: endDate ? endOfDay(endDate).toISOString() : null,
    ...(categoryIds ? { categoryIds } : {}),
  };
};

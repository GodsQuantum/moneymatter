import { findOrThrowNotFound } from '@common/utils/find-or-throw-not-found';
import { t } from '@i18n/index';
import { NotFoundError } from '@js/errors';
import Trackers from '@models/trackers.model';

import { authorizeBudgetRead } from '../authorize-budget-access';

/** Smart tracking is the owner's: a recipient gets the same 404 as a stranger. */
export const findOwnedTracker = async ({ userId, budgetId }: { userId: number; budgetId: string }) => {
  const { isOwner } = await authorizeBudgetRead({ userId, budgetId });
  if (!isOwner) throw new NotFoundError({ message: t({ key: 'budgets.budgetNotFound' }) });

  return findOrThrowNotFound({
    query: Trackers.findOne({ where: { id: budgetId, userId } }),
    message: t({ key: 'budgets.budgetNotFound' }),
  });
};

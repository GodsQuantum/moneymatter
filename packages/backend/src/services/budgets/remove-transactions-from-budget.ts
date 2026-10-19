import { SHARE_PERMISSIONS } from '@bt/shared/types';
import { findOrThrowNotFound } from '@common/utils/find-or-throw-not-found';
import { t } from '@i18n/index';
import TrackerTransactions from '@models/tracker-transactions.model';
import Trackers from '@models/trackers.model';
import { withTransaction } from '@services/common/with-transaction';
import Sequelize, { Op } from 'sequelize';

import { authorizeBudgetAccess } from './authorize-budget-access';
import { rejectUnlinkedTransactions } from './smart-tracking/suggestion-feedback';

interface RemoveTransactionsPayload {
  budgetId: string;
  userId: number;
  transactionIds: string[];
}

export const removeTransactionsFromBudget = withTransaction(async (payload: RemoveTransactionsPayload) => {
  const { budgetId, userId, transactionIds } = payload;

  const { ownerUserId, isOwner } = await authorizeBudgetAccess({
    userId,
    budgetId,
    requiredPermission: SHARE_PERMISSIONS.write,
  });

  const budget = await findOrThrowNotFound({
    query: Trackers.findOne({ where: { id: budgetId, userId: ownerUserId } }),
    message: t({ key: 'budgets.budgetNotFound' }),
  });

  if (isOwner) {
    // Owner can detach anything attached to their budget — recipient-attached rows
    // (metadata.addedByUserId set) and owner-attached rows alike.
    const where = { trackerId: budgetId, transactionId: { [Op.in]: transactionIds } };
    const unlinkedIds = budget.aiEnabled
      ? (await TrackerTransactions.findAll({ where, attributes: ['transactionId'] })).map((row) => row.transactionId)
      : [];
    const removedCount = await TrackerTransactions.destroy({ where });
    await rejectUnlinkedTransactions({ userId, budgetId, transactionIds: unlinkedIds });
    return { removedCount };
  }

  // Recipient can only detach rows THEY attached. We match on the JSONB `addedByUserId`
  // field rather than the underlying `transaction.userId` so a recipient who tries to
  // remove an *owner-attached* link to one of their own transactions (e.g. owner pulled
  // recipient's tx into the budget) still gets blocked.
  //
  // SQL: `metadata->>'addedByUserId' = '<userId>'`. The pattern follows the codebase's
  // `Sequelize.where(Sequelize.literal(...))` convention for JSONB filters (see
  // bank-data-providers/* and cancel-invitation.service.ts).
  //
  // The destroy returns the number of rows actually removed — we surface this so the
  // recipient can tell "your detach matched nothing" (e.g., they passed transactionIds
  // that belong to owner-attached rows) apart from a normal success.
  const removedCount = await TrackerTransactions.destroy({
    where: {
      trackerId: budgetId,
      transactionId: { [Op.in]: transactionIds },
      [Op.and]: [Sequelize.where(Sequelize.literal(`"metadata"->>'addedByUserId'`), String(userId))],
    },
  });
  return { removedCount };
});

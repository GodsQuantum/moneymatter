import { RESOURCE_TYPES } from '@bt/shared/types';
import Trackers from '@models/trackers.model';

import { type ShareableResource, buildPerResourceSource } from '../share-context-resolver';

/**
 * Per-resource share source for budgets: explicit `ResourceShares` row of type
 * `budget`. For now the only source — budgets-via-household will land as a
 * *selective* (owner-picks-which-budgets) source rather than the all-of-grantor's-
 * resources fall-through that accounts use. When that lands it slots into
 * `budgetShareable.sources` without resolver changes.
 */
const budgetPerResourceSource = buildPerResourceSource<Trackers>({
  resourceType: RESOURCE_TYPES.budget,
});

export const budgetShareable: ShareableResource<Trackers> = {
  model: Trackers,
  resourceType: RESOURCE_TYPES.budget,
  sources: [budgetPerResourceSource],
};

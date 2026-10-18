import { recordId } from '@common/lib/zod/custom-types';
import { Money } from '@common/types/money';
import { trackMcpToolUsed } from '@js/utils/posthog';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { editBudget } from '@services/budgets/edit-budget';
import { z } from 'zod';

import { getUserId, jsonContent, requireScope } from './helpers';

const inputSchema = {
  budgetId: recordId().describe('ID of the tracker to update'),
  name: z.string().optional().describe('New tracker name'),
  startDate: z.string().optional().describe('New start date (ISO 8601)'),
  endDate: z.string().optional().describe('New end date (ISO 8601)'),
  limitAmount: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe(
      "New spending limit as a decimal amount in the user's base currency (e.g. 500.00). Pass null to remove the limit",
    ),
  autoInclude: z.boolean().optional().describe('Whether to auto-include transactions in the date range'),
  categoryIds: z
    .array(recordId())
    .optional()
    .describe('Replace the linked category IDs (only applies to category-type trackers)'),
};

export function registerUpdateBudget(server: McpServer) {
  server.registerTool(
    'update_budget',
    {
      description:
        'Update the name, date range, spending limit, or linked categories of an existing tracker (a "budget" in tool and field names). Only passed fields change; limitAmount null removes the limit. Lines are managed with create_budget_line, update_budget_line and delete_budget_line. Returns the updated tracker record.',
      inputSchema,
    },
    async (args, extra) => {
      const userId = getUserId({ extra });
      requireScope({ extra, scope: 'finance:write' });
      trackMcpToolUsed({ userId, tool: 'update_budget', clientId: extra.authInfo?.clientId });

      const budget = await editBudget({
        id: args.budgetId,
        userId,
        name: args.name,
        startDate: args.startDate,
        endDate: args.endDate,
        limitAmount: args.limitAmount == null ? args.limitAmount : Money.fromDecimal(args.limitAmount),
        autoInclude: args.autoInclude,
        categoryIds: args.categoryIds,
      });

      return jsonContent({ data: budget });
    },
  );
}

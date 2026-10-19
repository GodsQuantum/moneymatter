import { QueryInterface, QueryTypes, Transaction } from 'sequelize';

const TABLE_RENAMES: [string, string][] = [
  ['Budgets', 'Trackers'],
  ['BudgetCategories', 'TrackerCategories'],
  ['BudgetTransactions', 'TrackerTransactions'],
];

const TRACKER_FK_TABLES = ['TrackerCategories', 'TrackerTransactions', 'TrackerLines', 'TrackerSuggestions'];
const TRACKER_TABLES = ['Trackers', ...TRACKER_FK_TABLES];

// Constraint/index/enum names differ between fresh and long-lived DBs, so they are
// introspected and rewritten token by token rather than listed by name.
const NAME_TOKEN_RENAMES: [string, string][] = [
  ['BudgetCategories', 'TrackerCategories'],
  ['BudgetTransactions', 'TrackerTransactions'],
  ['budgetTransactions', 'trackerTransactions'],
  ['Budgets', 'Trackers'],
  ['budget_categories', 'tracker_categories'],
  ['budget_transactions', 'tracker_transactions'],
  ['budgets', 'trackers'],
  ['budgetId', 'trackerId'],
  ['budget_id', 'tracker_id'],
];

const renameName = ({ name, pairs }: { name: string; pairs: [string, string][] }): string => {
  const map = new Map(pairs);
  return name.replace(new RegExp(pairs.map(([from]) => from).join('|'), 'g'), (token) => map.get(token)!);
};

const renameDbObjects = async ({
  queryInterface,
  transaction,
  pairs,
}: {
  queryInterface: QueryInterface;
  transaction: Transaction;
  pairs: [string, string][];
}): Promise<void> => {
  const { sequelize } = queryInterface;
  const replacements = { tables: TRACKER_TABLES };

  const constraints = await sequelize.query<{ tableName: string; name: string }>(
    `SELECT c.relname AS "tableName", con.conname AS name
       FROM pg_constraint con
       JOIN pg_class c ON c.oid = con.conrelid
       JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = current_schema() AND c.relname IN (:tables)`,
    { type: QueryTypes.SELECT, replacements, transaction },
  );
  for (const { tableName, name } of constraints) {
    const next = renameName({ name, pairs });
    if (next !== name) {
      await sequelize.query(`ALTER TABLE "${tableName}" RENAME CONSTRAINT "${name}" TO "${next}";`, { transaction });
    }
  }

  // Indexes backing PK/unique constraints were already renamed with their constraint.
  const indexes = await sequelize.query<{ name: string }>(
    `SELECT indexname AS name FROM pg_indexes WHERE schemaname = current_schema() AND tablename IN (:tables)`,
    { type: QueryTypes.SELECT, replacements, transaction },
  );
  for (const { name } of indexes) {
    const next = renameName({ name, pairs });
    if (next !== name) {
      await sequelize.query(`ALTER INDEX "${name}" RENAME TO "${next}";`, { transaction });
    }
  }

  const enums = await sequelize.query<{ name: string }>(
    `SELECT DISTINCT t.typname AS name
       FROM pg_attribute a
       JOIN pg_class c ON c.oid = a.attrelid
       JOIN pg_namespace n ON n.oid = c.relnamespace
       JOIN pg_type t ON t.oid = a.atttypid
      WHERE n.nspname = current_schema() AND c.relname IN (:tables)
        AND t.typtype = 'e' AND NOT a.attisdropped`,
    { type: QueryTypes.SELECT, replacements, transaction },
  );
  for (const { name } of enums) {
    const next = renameName({ name, pairs });
    if (next !== name) {
      await sequelize.query(`ALTER TYPE "${name}" RENAME TO "${next}";`, { transaction });
    }
  }
};

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const [from, to] of TABLE_RENAMES) {
        await queryInterface.sequelize.query(`ALTER TABLE "${from}" RENAME TO "${to}";`, { transaction });
      }
      for (const table of TRACKER_FK_TABLES) {
        await queryInterface.sequelize.query(`ALTER TABLE "${table}" RENAME COLUMN "budgetId" TO "trackerId";`, {
          transaction,
        });
      }
      await renameDbObjects({ queryInterface, transaction, pairs: NAME_TOKEN_RENAMES });
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await renameDbObjects({ queryInterface, transaction, pairs: NAME_TOKEN_RENAMES.map(([from, to]) => [to, from]) });
      for (const table of TRACKER_FK_TABLES) {
        await queryInterface.sequelize.query(`ALTER TABLE "${table}" RENAME COLUMN "trackerId" TO "budgetId";`, {
          transaction,
        });
      }
      for (const [from, to] of TABLE_RENAMES) {
        await queryInterface.sequelize.query(`ALTER TABLE "${to}" RENAME TO "${from}";`, { transaction });
      }
    });
  },
};

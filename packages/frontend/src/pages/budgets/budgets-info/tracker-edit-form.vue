<script setup lang="ts">
import { editBudget } from '@/api/budgets';
import { ALL_LOGO_TABS, type LogoSelection, toLogoPatch, toLogoSelection } from '@/components/common/logo-selection';
import LogoSquareField from '@/components/common/logo-square-field.vue';
import CategoryMultiSelectField from '@/components/fields/category-multi-select-field.vue';
import DateField from '@/components/fields/date-field.vue';
import InputField from '@/components/fields/input-field.vue';
import Button from '@/components/lib/ui/button/Button.vue';
import { useNotificationCenter } from '@/components/notification-center';
import { BUDGET_TYPES, type BudgetModel } from '@bt/shared/types';
import { useMutation } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TrackerLogo from '../components/tracker-logo.vue';
import { reportTrackerError, useInvalidateTracker } from '../components/use-tracker-actions';
import { parseTrackerDate } from '../tracker-time-status';
import { buildBudgetPayload } from '../build-budget-payload';

const props = defineProps<{ budget: BudgetModel }>();
const emit = defineEmits<{ saved: []; cancel: [] }>();

const { t } = useI18n();
const invalidateTracker = useInvalidateTracker();
const { addSuccessNotification } = useNotificationCenter();

const isCategoryTracker = props.budget.type === BUDGET_TYPES.category;

const form = ref({
  name: props.budget.name,
  limitAmount: props.budget.limitAmount as string | number | null,
  startDate: parseTrackerDate(props.budget.startDate),
  endDate: parseTrackerDate(props.budget.endDate),
  categoryIds: (props.budget.categories?.map((c) => c.id) ?? []) as string[],
});
const storedLogo = toLogoSelection(props.budget);
const logo = ref<LogoSelection | null>(storedLogo);

const { mutate, isPending } = useMutation({
  mutationFn: editBudget,
  onSuccess: () => {
    addSuccessNotification(t('budgets.list.updateSuccess'));
    emit('saved');
    return invalidateTracker({ budgetId: props.budget.id });
  },
  onError: (error) =>
    reportTrackerError({
      error,
      fallbackKey: 'budgets.list.updateError',
      context: { source: 'trackerEdit', budgetId: props.budget.id },
    }),
});

const categoriesTouched = ref(false);
const isCategoryMissing = computed(() => isCategoryTracker && form.value.categoryIds.length === 0);
const categoryErrorMessage = computed(() =>
  categoriesTouched.value && isCategoryMissing.value ? t('budgets.creation.categoriesRequired') : undefined,
);
const onCategoriesUpdate = (value: string[]) => {
  form.value.categoryIds = value;
  categoriesTouched.value = true;
};

const dateFields = computed(() => [
  {
    key: 'startDate' as const,
    labelKey: 'budgets.settings.startDateLabel',
    calendarOptions: { maxDate: form.value.endDate ?? undefined },
  },
  {
    key: 'endDate' as const,
    labelKey: 'budgets.settings.endDateLabel',
    calendarOptions: { minDate: form.value.startDate ?? undefined },
  },
]);

const handleSubmit = () => {
  categoriesTouched.value = true;
  if (isCategoryMissing.value) return;
  mutate({
    budgetId: props.budget.id,
    payload: {
      ...buildBudgetPayload({
        name: form.value.name,
        limitAmount: form.value.limitAmount,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        categoryIds: isCategoryTracker ? form.value.categoryIds : undefined,
      }),
      ...toLogoPatch({ selection: logo.value, stored: storedLogo }),
    },
  });
};
</script>

<template>
  <form class="grid gap-4" @submit.prevent="handleSubmit">
    <div class="flex items-start gap-3">
      <LogoSquareField
        v-model="logo"
        :name-for-search="form.name"
        :reset-label="$t('common.logo.remove')"
        :tabs="ALL_LOGO_TABS"
        :disabled="isPending"
        align="with-labeled-field"
      >
        <template #placeholder>
          <TrackerLogo class="size-10 rounded-lg" />
        </template>
      </LogoSquareField>
      <div class="min-w-0 flex-1">
        <InputField
          v-model="form.name"
          :label="$t('budgets.settings.nameLabel')"
          :placeholder="$t('budgets.settings.namePlaceholder')"
          :disabled="isPending"
        />
      </div>
    </div>

    <div v-if="isCategoryTracker" class="grid gap-1.5">
      <CategoryMultiSelectField
        :model-value="form.categoryIds"
        :label="$t('budgets.creation.categoriesLabel')"
        :placeholder="$t('budgets.lines.dialog.categoriesPlaceholder')"
        :disabled="isPending"
        :error-message="categoryErrorMessage"
        @update:model-value="onCategoriesUpdate"
      />
      <p class="text-muted-foreground text-xs">{{ $t('budgets.details.edit.categoriesHint') }}</p>
    </div>

    <div class="grid gap-1.5">
      <InputField
        v-model="form.limitAmount"
        :label="$t('budgets.settings.limitLabel')"
        :placeholder="$t('budgets.settings.limitPlaceholder')"
        type="number"
        only-positive
        :disabled="isPending"
      />
      <p class="text-muted-foreground text-xs">{{ $t('budgets.details.edit.limitHint') }}</p>
    </div>

    <div class="grid gap-1.5">
      <div class="grid grid-cols-2 gap-3">
        <DateField
          v-for="field in dateFields"
          :key="field.key"
          :model-value="form[field.key] ?? undefined"
          :calendar-options="field.calendarOptions"
          mode="date"
          :label="$t(field.labelKey)"
          :disabled="isPending"
          clearable
          @update:model-value="(v: Date | undefined) => (form[field.key] = v ?? null)"
          @clear="form[field.key] = null"
        />
      </div>
      <p v-if="!isCategoryTracker" class="text-muted-foreground text-xs">
        {{ $t('budgets.details.edit.datesHint') }}
      </p>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" :disabled="isPending" @click="emit('cancel')">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button type="submit" :disabled="isPending || !form.name || isCategoryMissing">
        {{ isPending ? $t('common.actions.saving') : $t('common.actions.saveChanges') }}
      </Button>
    </div>
  </form>
</template>

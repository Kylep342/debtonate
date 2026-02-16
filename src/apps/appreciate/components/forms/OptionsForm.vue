<script setup lang="ts">
import { computed, ref, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import GlobalOptionsFormlet from '@/apps/shared/components/forms/GlobalOptionsFormlet.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const accrualCardRef = ref(null);
const inflationCardRef = ref(null);
const yearsToContributeCardRef= ref(null);
const yearsToSpendCardRef = ref(null);
const desiredNetIncomeCardRef = ref(null);
const retirementTaxRateCardRef = ref(null);

const globalOptionsFormletRef = ref(null);

const cardRefs = computed(() => [
  accrualCardRef.value,
  inflationCardRef.value,
  yearsToContributeCardRef.value,
  yearsToSpendCardRef.value,
  desiredNetIncomeCardRef.value,
  retirementTaxRateCardRef.value,
].filter(Boolean));

const allCollapsed: Ref<boolean> = ref(false);


const toggleAllCards = (): void => {
  allCollapsed.value = !allCollapsed.value;
  const action = allCollapsed.value ? 'collapse' : 'expand';
  const childAction = allCollapsed.value ? 'collapseAll' : 'expandAll';

  cardRefs.value.forEach(card => card[action]());

  if (globalOptionsFormletRef.value) {
    globalOptionsFormletRef.value[childAction]();
  }
}

const deflationExample: ComputedRef<string> = computed(() => `When enabled this deflates all future money to current year money (CYM) at a rate of ${globalOptions.Percent(state.inflationFactor)} per year`)

const buttonStyle = (flag: boolean) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag: boolean) => (flag ? constants.BTN_ON : constants.BTN_OFF);
</script>

<template>
  <base-modal
    :body-classes="['overflow-y-auto']"
    @exit="state.exitOptionsForm"
  >
    <template #header>
      <h2 :class="['pl-4']">Options</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="state.exitOptionsForm"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div class="flex justify-between items-center">
        <h3 :class="['pl-4']">Appreciate Options</h3>
        <base-button
          :class="['btn-sm']"
          @click="toggleAllCards"
        >
          {{ allCollapsed ? '+' : '-' }}
        </base-button>
      </div>
      <br>
      <div :class="['formInputs']">
        <collapsible-card ref="accrualCardRef">
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Accrue Before Contribution
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <base-button
                :class="buttonStyle(state.accrueBeforeContribution)"
                @click="state.toggleAccrueBeforeContribution"
              >
                {{ buttonText(state.accrueBeforeContribution) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this accrues growth for a period before adding that period's contribution
              </p>
              <br>
              <p>
                When disabled this adds a contribution for a period before accruing that period's growth
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card ref="inflationCardRef">
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Inflation (%)
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <div :class="['label']">
                <span :class="['label-text']">factor:</span>
              </div>
              <input
                :id="`${constants.OPTIONS_FORM_ID}-inflation-factor`"
                v-model.number="state.inflationFactor"
                :class="['input input-bordered input-secondary w-full max-ws']"
                type="number"
                step="0.01"
                label="inflationFactor"
              >
              <base-button
                :class="buttonStyle(state.deflateAllMoney)"
                @click="state.toggleDeflateAllMoney(state.inflationFactor)"
              >
                {{ buttonText(state.deflateAllMoney) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                {{ deflationExample }}
              </p>
              <br>
              <p>
                Purchasing power analyses are always deflated to CYM
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card ref="yearsToContributeCardRef">
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Years to Contribute
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <input
                :id="`${constants.OPTIONS_FORM_ID}-years-to-contribute`"
                v-model.number="state.yearsToContribute"
                :class="['input input-bordered input-secondary w-full max-ws']"
                type="number"
                step="0.01"
                label="yearsToContribute"
              >
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                Sets the number of years to save for retirement
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card ref="yearsToSpendCardRef">
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Years to Spend
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <input
                :id="`${constants.OPTIONS_FORM_ID}-years-to-spend`"
                v-model.number="state.yearsToSpend"
                :class="['input input-bordered input-secondary w-full max-ws']"
                type="number"
                step="0.01"
                label="yearsToSpend"
              >
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                Sets the number of years to spend your savings
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card ref="desiredNetIncomeCardRef">
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Desired Net Retirement Income
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <input
                :id="`${constants.OPTIONS_FORM_ID}-desired-net-income`"
                v-model.number="state.desiredNetIncome"
                :class="['input input-bordered input-secondary w-full max-ws']"
                type="number"
                step="100"
                label="desiredNetIncome"
              >
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                Sets the desired monthly net income (after tax) during retirement
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card ref="retirementTaxRateCardRef">
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Retirement Tax Rate (%)
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <input
                :id="`${constants.OPTIONS_FORM_ID}-retirement-tax-rate`"
                v-model.number="state.retirementTaxRate"
                :class="['input input-bordered input-secondary w-full max-ws']"
                type="number"
                step="0.1"
                label="retirementTaxRate"
              >
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                Sets the expected effective tax rate on withdrawals during retirement
              </p>
            </div>
          </template>
        </collapsible-card>
        <br>
        <hr>
        <br>
        <global-options-formlet ref="globalOptionsFormletRef" />
      </div>
    </template>
  </base-modal>
</template>

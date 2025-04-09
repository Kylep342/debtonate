<script setup lang="ts">
import constants from '@/apps/appreciate/constants/constants';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import GlobalOptionsFormlet from '@/apps/shared/components/forms/GlobalOptionsFormlet.vue';

const globalOptions = useGlobalOptionsStore();
const state = useAppreciateCoreStore();

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);
</script>

<template>
  <base-modal :body-classes="['overflow-y-auto']" @exit="state.exitOptionsForm">
    <template #header>
      <h2>Options</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.exitOptionsForm">
        x
      </base-button>
    </template>
    <template #body>
      <h3>Appreciate Options</h3>
      <br>
      <hr>
      <br>
      <div :class="['formInputs']">
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Accrue Before Contribution
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <base-button :class="buttonStyle(state.accrueBeforeContribution)" @click="state.toggleAccrueBeforeContribution">
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
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Inflation
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <div :class="['label']">
                <span :class="['label-text']">factor:</span>
              </div>
              <input :id="`${constants.OPTIONS_FORM_ID}-inflation-factor`" v-model.number="state.inflationFactor"
                :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="inflationFactor">
              <base-button :class="buttonStyle(state.deflateAllMoney)"
                @click="state.toggleDeflateAllMoney(state.inflationFactor)">
                {{ buttonText(state.deflateAllMoney) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this deflates <b><i>all</i></b> future money to current year money (CYM) at a rate of {{ globalOptions.Percent(state.inflationFactor) }} per year
              </p>
              <br>
              <p>
                Purchasing power analyses are always deflated to CYM
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Years to Contribute
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <input :id="`${constants.OPTIONS_FORM_ID}-years-to-contribute`" v-model.number="state.yearsToContribute"
                :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="yearsToContribute">
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                Sets the number of years to contribute to instruments
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Years to Spend
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <input :id="`${constants.OPTIONS_FORM_ID}-years-to-spend`" v-model.number="state.yearsToSpend"
                :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="yearsToSpend">
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
        <br>
        <hr>
        <br>
        <global-options-formlet />
      </div>
    </template>
  </base-modal>
</template>

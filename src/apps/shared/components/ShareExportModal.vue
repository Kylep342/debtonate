<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue';

import constants from '@/apps/shared/constants/constants';
import elementIds from '@/apps/shared/constants/elementIds';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { buildShareUrl } from '@/apps/shared/functions/planSharing';
import { exportToJson } from '@/apps/shared/functions/export';

const props = withDefaults(
  defineProps<{
    appType: 'debtonate' | 'appreciate';
    id?: string;
  }>(),
  {
    id: constants.SHARE_EXPORT_MODAL_ID,
  }
);

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const debtonateStore = props.appType === 'debtonate' ? useDebtonateCoreStore() : null;
const appreciateStore = props.appType === 'appreciate' ? useAppreciateCoreStore() : null;

// Tab state: 'share' | 'backup'
const activeTab: Ref<'share' | 'backup'> = ref('share');

// Share link state
const shareUrl: Ref<string> = ref('');
const isCopied: Ref<boolean> = ref(false);
const copyTimeout: Ref<any> = ref(null);

const generateShareUrl = async (): Promise<void> => {
  const store = debtonateStore || appreciateStore;
  if (!store) return;
  const stateObj = store.exportState();
  shareUrl.value = await buildShareUrl(stateObj);
};

onMounted(() => {
  generateShareUrl();
});

const copyShareLink = async (): Promise<void> => {
  if (!shareUrl.value) await generateShareUrl();
  const clipboard = (typeof navigator !== 'undefined' && navigator.clipboard)
    || (typeof window !== 'undefined' && window.navigator && window.navigator.clipboard);
  if (clipboard && clipboard.writeText) {
    await clipboard.writeText(shareUrl.value);
    isCopied.value = true;
    if (copyTimeout.value) clearTimeout(copyTimeout.value);
    copyTimeout.value = setTimeout(() => {
      isCopied.value = false;
    }, 2500);
  }
};

// Plan Stats
const planStats = computed(() => {
  if (props.appType === 'debtonate' && debtonateStore) {
    return {
      entityCount: debtonateStore.loans.length,
      entityLabel: 'Debts',
      budgetCount: debtonateStore.budgets.length,
      totalMoney: globalOptions.Money(debtonateStore.totalPrincipal),
      totalMoneyLabel: 'Total Principal',
      monthlyPayment: globalOptions.Money(debtonateStore.totalMinPayment),
      monthlyPaymentLabel: 'Total Min Payment',
    };
  }
  if (props.appType === 'appreciate' && appreciateStore) {
    return {
      entityCount: appreciateStore.instruments.length,
      entityLabel: 'Accounts',
      budgetCount: appreciateStore.budgets.length + appreciateStore.withdrawalBudgets.length,
      totalMoney: globalOptions.Money(appreciateStore.totalCurrentBalance),
      totalMoneyLabel: 'Total Balance',
      monthlyPayment: globalOptions.Money(appreciateStore.totalAnnualLimit / 12),
      monthlyPaymentLabel: 'Total Monthly Limit',
    };
  }
  return null;
});

// Full Plan Backup & Restore
const restoreMessage: Ref<string> = ref('');
const fileInputRef: Ref<HTMLInputElement | null> = ref(null);

const handleDownloadPlanJson = (): void => {
  const store = debtonateStore || appreciateStore;
  if (!store) return;
  const stateObj = store.exportState();
  const filename = `${props.appType}_plan_backup_${new Date().toISOString().slice(0, 10)}`;
  exportToJson(filename, stateObj);
};

const triggerFileInput = (): void => {
  if (fileInputRef.value) fileInputRef.value.click();
};

const handleFileUpload = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      const store = debtonateStore || appreciateStore;
      if (store) {
        store.importState(parsed);
        restoreMessage.value = `Successfully restored ${file.name}!`;
        generateShareUrl();
        setTimeout(() => {
          restoreMessage.value = '';
        }, 4000);
      }
    } catch {
      restoreMessage.value = 'Failed to parse JSON file. Please check file format.';
    }
  };

  reader.readAsText(file);
  input.value = '';
};
</script>

<template>
  <base-modal
    :id="constants.SHARE_EXPORT_MODAL_ID"
    :body-classes="['overflow-y-auto', 'max-w-2xl']"
    @exit="globalOptions.closeShareExport"
  >
    <template #header>
      <div class="flex items-center gap-2 pl-4">
        <h2 class="text-lg font-bold">
          {{ constants.SHARE_EXPORT_MODAL_TITLE }}
        </h2>
      </div>
    </template>

    <template #headerActions>
      <base-button
        :id="elementIds.BTN_SHARE_EXPORT_CLOSE"
        :class="['btn btn-circle btn-ghost']"
        @click="globalOptions.closeShareExport"
      >
        x
      </base-button>
    </template>

    <template #body>
      <div class="p-2 space-y-4">
        <!-- Navigation Tabs -->
        <div class="flex flex-wrap gap-1">
          <button
            :id="elementIds.TAB_SHARE_LINK"
            type="button"
            class="btn btn-xs sm:btn-sm"
            :class="activeTab === 'share' ? 'btn-primary' : 'btn-ghost'"
            @click="activeTab = 'share'"
          >
            Share Link
          </button>
          <button
            :id="elementIds.TAB_BACKUP_RESTORE"
            type="button"
            class="btn btn-xs sm:btn-sm"
            :class="activeTab === 'backup' ? 'btn-primary' : 'btn-ghost'"
            @click="activeTab = 'backup'"
          >
            Backup & Restore
          </button>
        </div>

        <!-- Tab 1: Share Link -->
        <div
          v-if="activeTab === 'share'"
          class="space-y-4"
        >
          <div class="alert alert-info text-xs sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current shrink-0 w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Anyone with this link can load your exact financial plan. The full plan configuration is encoded directly in the URL hash—nothing is sent to a server.
            </span>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Bookmarkable / Shareable URL</span>
            </label>
            <div class="flex gap-2">
              <input
                :id="elementIds.INPUT_SHARE_URL"
                type="text"
                readonly
                :value="shareUrl"
                class="input input-bordered input-sm flex-1 font-mono text-xs select-all"
                @focus="($event.target as HTMLInputElement)?.select()"
              >
              <base-button
                :id="elementIds.BTN_COPY_SHARE_LINK"
                class="btn-sm"
                :class="isCopied ? 'btn-success' : 'btn-primary'"
                @click="copyShareLink"
              >
                {{ isCopied ? 'Copied!' : 'Copy Link' }}
              </base-button>
            </div>
          </div>

          <!-- Plan summary badges -->
          <div
            v-if="planStats"
            class="bg-base-200 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center"
          >
            <div class="bg-base-100 p-2 rounded shadow-sm">
              <div class="text-xs opacity-75">
                {{ planStats.entityLabel }}
              </div>
              <div class="text-base font-bold">
                {{ planStats.entityCount }}
              </div>
            </div>
            <div class="bg-base-100 p-2 rounded shadow-sm">
              <div class="text-xs opacity-75">
                Budgets
              </div>
              <div class="text-base font-bold">
                {{ planStats.budgetCount }}
              </div>
            </div>
            <div class="bg-base-100 p-2 rounded shadow-sm">
              <div class="text-xs opacity-75">
                {{ planStats.totalMoneyLabel }}
              </div>
              <div class="text-base font-bold truncate">
                {{ planStats.totalMoney }}
              </div>
            </div>
            <div class="bg-base-100 p-2 rounded shadow-sm">
              <div class="text-xs opacity-75">
                {{ planStats.monthlyPaymentLabel }}
              </div>
              <div class="text-base font-bold truncate">
                {{ planStats.monthlyPayment }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Backup & Restore -->
        <div
          v-if="activeTab === 'backup'"
          class="space-y-4"
        >
          <div class="text-xs opacity-80">
            Export a full JSON backup of your configured data or restore from a previously exported backup file.
          </div>

          <div
            v-if="restoreMessage"
            class="alert alert-success text-xs sm:text-sm"
          >
            <span>{{ restoreMessage }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="border border-base-300 rounded-lg p-4 flex flex-col justify-between gap-3">
              <div>
                <h4 class="text-sm font-bold">
                  Export Full Plan Backup
                </h4>
                <p class="text-xs opacity-75 mt-1">
                  Downloads a complete snapshot of all loans/accounts, budgets, and settings.
                </p>
              </div>
              <base-button
                :id="elementIds.BTN_DOWNLOAD_PLAN_JSON"
                class="btn-sm btn-outline w-full"
                @click="handleDownloadPlanJson"
              >
                Download Plan File (.json)
              </base-button>
            </div>

            <div class="border border-base-300 rounded-lg p-4 flex flex-col justify-between gap-3">
              <div>
                <h4 class="text-sm font-bold">
                  Restore Plan from File
                </h4>
                <p class="text-xs opacity-75 mt-1">
                  Load an exported plan JSON file to replace your current workspace.
                </p>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept=".json"
                class="hidden"
                @change="handleFileUpload"
              >
              <base-button
                :id="elementIds.BTN_UPLOAD_PLAN_JSON"
                class="btn-sm btn-outline w-full"
                @click="triggerFileInput"
              >
                Upload & Restore (.json)
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <base-button
        :id="elementIds.BTN_SHARE_EXPORT_DONE"
        class="btn-sm btn-primary"
        @click="globalOptions.closeShareExport"
      >
        Done
      </base-button>
    </template>
  </base-modal>
</template>

import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShareExportModal from '@/apps/shared/components/ShareExportModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import elementIds from '@/apps/shared/constants/elementIds';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import * as exportUtils from '@/apps/shared/functions/export';

describe('ShareExportModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  const globalConfig = {
    components: {
      BaseButton,
      BaseCard,
      BaseModal,
    },
  };

  it('renders modal header and tabs with direct element IDs', () => {
    const wrapper = mount(ShareExportModal, {
      props: { appType: 'debtonate' },
      global: globalConfig,
    });

    expect(wrapper.text()).toContain('Share & Export Plan');
    expect(wrapper.find(`#${elementIds.TAB_SHARE_LINK}`).exists()).toBe(true);
    expect(wrapper.find(`#${elementIds.TAB_BACKUP_RESTORE}`).exists()).toBe(true);
  });

  it('switches between tabs on click', async () => {
    const wrapper = mount(ShareExportModal, {
      props: { appType: 'debtonate' },
      global: globalConfig,
    });

    const backupTab = wrapper.find(`#${elementIds.TAB_BACKUP_RESTORE}`);
    expect(backupTab.exists()).toBe(true);
    await backupTab.trigger('click');
    expect(wrapper.text()).toContain('Export Full Plan Backup');
    expect(wrapper.text()).toContain('Restore Plan from File');

    const shareTab = wrapper.find(`#${elementIds.TAB_SHARE_LINK}`);
    expect(shareTab.exists()).toBe(true);
    await shareTab.trigger('click');
    expect(wrapper.text()).toContain('Bookmarkable / Shareable URL');
  });

  it('copies share link to clipboard on button click', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    const mockClipboard = { writeText: writeTextSpy };
    Object.defineProperty(window.navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    const wrapper = mount(ShareExportModal, {
      props: { appType: 'debtonate' },
      global: globalConfig,
    });

    await vi.waitFor(() => {
      const input = wrapper.find<HTMLInputElement>(`#${elementIds.INPUT_SHARE_URL}`);
      expect(input.element.value).toContain('http');
    });

    const copyBtn = wrapper.find(`#${elementIds.BTN_COPY_SHARE_LINK}`);
    expect(copyBtn.exists()).toBe(true);

    await copyBtn.trigger('click');
    await flushPromises();
    expect(writeTextSpy).toHaveBeenCalled();
  });

  it('triggers plan backup JSON download from backup tab', async () => {
    const jsonSpy = vi.spyOn(exportUtils, 'exportToJson').mockImplementation(() => {});

    const wrapper = mount(ShareExportModal, {
      props: { appType: 'debtonate' },
      global: globalConfig,
    });

    await wrapper.find(`#${elementIds.TAB_BACKUP_RESTORE}`).trigger('click');

    const downloadPlanBtn = wrapper.find(`#${elementIds.BTN_DOWNLOAD_PLAN_JSON}`);
    expect(downloadPlanBtn.exists()).toBe(true);
    await downloadPlanBtn.trigger('click');
    expect(jsonSpy).toHaveBeenCalled();
  });

  it('closes modal when exit button is clicked', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.openShareExport();
    expect(globalOptions.isShareExportActive).toBe(true);

    const wrapper = mount(ShareExportModal, {
      props: { appType: 'debtonate' },
      global: globalConfig,
    });

    const exitBtn = wrapper.find(`#${elementIds.BTN_SHARE_EXPORT_CLOSE}`);
    expect(exitBtn.exists()).toBe(true);
    await exitBtn.trigger('click');
    expect(globalOptions.isShareExportActive).toBe(false);
  });

  it('closes modal when Done button is clicked', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.openShareExport();
    expect(globalOptions.isShareExportActive).toBe(true);

    const wrapper = mount(ShareExportModal, {
      props: { appType: 'debtonate' },
      global: globalConfig,
    });

    const doneBtn = wrapper.find(`#${elementIds.BTN_SHARE_EXPORT_DONE}`);
    expect(doneBtn.exists()).toBe(true);
    await doneBtn.trigger('click');
    expect(globalOptions.isShareExportActive).toBe(false);
  });
});

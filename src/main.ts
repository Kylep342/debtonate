import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import router from '@/apps/router';
import BaseAlert from '@/apps/shared/components/ui/BaseAlert.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseGraph from '@/apps/shared/components/ui/BaseGraph.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import BaseTabs from '@/apps/shared/components/ui/BaseTabs.vue';
import CollapsibleCard from '@/apps/shared/components/ui/CollapsibleCard.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';

import '@/assets/main.css';
import '@/assets/built.css';

const app = createApp(App);
const pinia = createPinia();

app.component('BaseAlert', BaseAlert);
app.component('BaseButton', BaseButton);
app.component('BaseCard', BaseCard);
app.component('BaseGraph', BaseGraph);
app.component('BaseMenu', BaseMenu);
app.component('BaseModal', BaseModal);
app.component('BaseTable', BaseTable);
app.component('BaseTabs', BaseTabs);
app.component('CollapsibleCard', CollapsibleCard);
app.component('DonutGraph', DonutGraph);

app.use(pinia);
app.use(router);
app.mount('#app');

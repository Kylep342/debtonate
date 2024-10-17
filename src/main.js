import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseChart from './components/ui/BaseChart.vue';
import BaseModal from './components/ui/BaseModal.vue';
import BaseTable from './components/ui/BaseTable.vue';
import BaseTabs from './components/ui/BaseTabs.vue';

import './assets/main.css';
import './assets/built.css';

const app = createApp(App);
const pinia = createPinia(app);

app.component('base-button', BaseButton);
app.component('base-card', BaseCard);
app.component('base-chart', BaseChart);
app.component('base-modal', BaseModal);
app.component('base-table', BaseTable);
app.component('base-tabs', BaseTabs);

app.use(pinia);
app.mount('#app');

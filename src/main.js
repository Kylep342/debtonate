import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseChart from './components/ui/BaseChart.vue';
import BaseModal from './components/ui/BaseModal.vue';
import BaseTable from './components/ui/BaseTable.vue';
import BaseTabs from './components/ui/BaseTabs.vue';
import CollapsibleCard from './components/ui/CollapsibleCard.vue';

import './assets/main.css';
import './assets/built.css';

const app = createApp(App);
const pinia = createPinia(app);

app.component('BaseButton', BaseButton);
app.component('BaseCard', BaseCard);
app.component('BaseChart', BaseChart);
app.component('BaseModal', BaseModal);
app.component('BaseTable', BaseTable);
app.component('BaseTabs', BaseTabs);
app.component('CollapsibleCard', CollapsibleCard);

app.use(pinia);
app.mount('#app');

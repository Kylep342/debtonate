import { createApp } from 'vue';
import App from './App.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseChart from './components/ui/BaseChart.vue';
import BaseModal from './components/ui/BaseModal.vue';
import BaseTable from './components/ui/BaseTable.vue';

import './assets/main.css';
import './assets/built.css';

const app = createApp(App);

app.component('base-button', BaseButton);
app.component('base-card', BaseCard);
app.component('base-chart', BaseChart);
app.component('base-modal', BaseModal);
app.component('base-table', BaseTable);

app.mount('#app');

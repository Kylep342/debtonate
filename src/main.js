import { createApp } from 'vue';
import App from './App.vue';
import BaseButton from './components/ui/BaseButton.vue'
import BaseCard from './components/ui/BaseCard.vue'
import BaseModal from './components/ui/BaseModal.vue'

import './assets/main.css';

const app = createApp(App);

app.component('base-button', BaseButton)
app.component('base-card', BaseCard)
app.component('base-modal', BaseModal)

app.mount('#app');

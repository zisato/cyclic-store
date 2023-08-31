import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import routes from './routes/routes'

const app = createApp(App);

app
    .use(createRouter({
        history: createWebHistory(),
        routes,
    }))
    .use(createPinia());

app.mount('#app');

import { createApp } from 'vue';
import Vue3TouchEvents from 'vue3-touch-events';

import App from './App.vue';

import { store, storeInjectionKey } from './store';
import './helpers/eruda';

import 'normalize.css';
import './index.scss';

import "./registerServiceWorker";

createApp(App).use(store, storeInjectionKey).use(Vue3TouchEvents).mount('#app');

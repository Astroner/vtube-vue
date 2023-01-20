import { createApp } from 'vue';
import Vue3TouchEvents from 'vue3-touch-events';

import eruda from "eruda";

import App from './App.vue';

import { store, storeInjectionKey } from './store';

import 'normalize.css';
import './index.scss';

import "./registerServiceWorker";
import { env } from './env';

createApp(App).use(store, storeInjectionKey).use(Vue3TouchEvents).mount('#app');
eruda.init();

// if (env.NODE_ENV === "development") {
//     eruda.init();
// }

import { getInfo, signIn } from "@/api/main/user";
import { Module } from "vuex";
import { User, Modules } from "./modules";

export const user: Module<User, Modules> = {
  state: {
    token: null,
    info: null,
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
    },
    resetToken(state) {
      state.token = null;
      state.info = null;
    },
    setInfo(state, info: Exclude<User['info'], null>) {
      state.info = info;
    },
  },
  actions: {
    async login(store, payload: { username: string, password: string }) {
      try {
        const data = await signIn(payload.username, payload.password);
        store.commit("setToken", data.token);
        store.dispatch("fetchInfo");
        return "SUCCESS";
      } catch (e) {
        return "ERROR";
      }
    },
    async fetchInfo(store) {
      if (!store.state.token) return "ERROR";
      try {
        const data = await getInfo(store.state.token);
        store.commit("setInfo", data);
        return "OK";
      } catch (e) {
        return "ERROR";
      }
    },
  },
};

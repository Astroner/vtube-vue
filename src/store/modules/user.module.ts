import { Module } from "vuex";
import { Session } from "@dogonis/vtube-client";

import { vtube } from "@/helpers/vtube-client";

import { User, Modules } from "./modules";

export const user: Module<User, Modules> = {
  state: {
    session: null,
    info: null,
  },
  mutations: {
    setSession(state, session: Session) {
      state.session = session;
    },
    resetToken(state) {
      state.session = null;
      state.info = null;
    },
    setInfo(state, info: Exclude<User['info'], null>) {
      state.info = info;
    },
  },
  actions: {
    async login(store, payload: { username: string, password: string }) {
      try {
        const session = await vtube.user.signIn(payload.username, payload.password);
        store.commit("setSession", session);
        store.dispatch("fetchInfo");
        return "SUCCESS";
      } catch (e) {
        return "ERROR";
      }
    },
    async fetchInfo(store) {
      if (!store.state.session) return "ERROR";
      try {
        const data = await store.state.session.userInfo();
        
        store.commit("setInfo", data);
        return "OK";
      } catch (e) {
        return "ERROR";
      }
    },
  },
};

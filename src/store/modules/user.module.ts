import { Module } from "vuex";
import { User, Modules } from "./modules";

export const user: Module<User, Modules> = {
  state: {
    psid: null,
  },
  mutations: {
    login(state, psid: string) {
      state.psid = psid;
    },
    logout(state) {
      state.psid = null;
    },
  },
};

<template>
  <page name="Profile" title>
    <Transition name="fade">
      <div v-if="!isLoggedIn">
        <Input title="Name" v-model:value="username" />
        <Input title="Passphrase" v-model:value="password" password style="margin-top: 10px;"/>
        <Button @click="submit" style="margin-top: 20px">
          Sign
        </Button>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="isLoggedIn">
        <div class="signature" v-if="userInfo">
          Signed by "{{ userInfo.username }}"
        </div>
        <Button @click="reset" style="margin-top: 20px">
          Wipe
        </Button>
        <div @click="showConsole" style="margin-top: 20px; height: 80px"></div>
      </div>
    </Transition>
  </page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
} from "vue";

import Page from "@/Pages/components/Page.vue";
import { useStore } from "@/store";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import { usePages } from "@/Pages/hooks/usePages";
import { show } from "@/helpers/eruda";

export default defineComponent({
  components: { Page, Input, Button },
  setup() {
    const store = useStore();
    const pages = usePages();

    const counter = ref(0);
    const username = ref<string>("");
    const password = ref("");

    const isLoggedIn = computed(() => !!store.state.user.session);
    const userInfo = computed(() => store.state.user.info);

    return {
      isLoggedIn,
      username,
      password,
      userInfo,
      async submit() {
        const result = await store.dispatch("login", { username: username.value, password: password.value });
        if (result === "SUCCESS") {
          username.value = "";
          password.value = "";
          pages.goToPage("Music recommendations");
        }
      },
      reset() {
        store.commit("resetToken");
      },
      showConsole() {
        if (counter.value < 5) counter.value++;
        else show();
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.signature {
  font-size: 28px;
}
</style>

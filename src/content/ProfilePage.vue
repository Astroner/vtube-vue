<template>
  <page name="Profile" title>
    <h3>
      Your PSID:
    </h3>
    <form @submit="submit">
      <div class="profile__textarea__container" >
        <div>
          Print PSID
        </div>
        <textarea
          :class="{
            profile__textarea__input: true,
            'profile__textarea__input--visible': value.length > 0,
            'profile__textarea__input--hidden': value.length === 0,
            'profile__textarea__input--active': changed,
            'profile__textarea__input--default': !changed,
          }"
          :value="value"
          @input="(e) => value = e.target.value"
        />
      </div>
      <transition name="fade">
        <button v-if="changed" type="submit">
          Print
        </button>
      </transition>
    </form>
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

export default defineComponent({
  components: { Page },
  setup() {
    const store = useStore();

    const psid = computed(() => store.state.user.psid ?? "");

    const value = ref(psid.value);

    const changed = computed(() => value.value !== psid.value);

    return {
      psid,
      value,
      changed,
      submit: (e: Event) => {
        e.preventDefault();
        store.commit("login", value.value);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
h3 {
  margin: 0 0 10px;
}
button {
  width: 100%;

  border: 1px solid #000;

  background-color: #fff;

  font-size: 20px;
  line-height: 24px;

  margin-top: 10px;

  transition: background-color .3s, color .3s;

  &:active {
    background-color: #000;
    color: #fff;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.profile__ {
  &textarea__ {
    &container {
      width: 100%;
      position: relative;

      border: 1px dashed black;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 20px;
      color: #919191;

      &::after {
        content: "";
        display: block;

        padding-bottom: 50%;
      }
    }
    &input {
      position: absolute;
      top: 5px;
      left: 5px;

      width: calc(100% - 10px);
      height: calc(100% - 10px);

      background-color: #fff;

      outline: none;

      padding: 5px;

      transition: opacity .3s, border .3s, box-shadow .3s;

      resize: none;

      &:focus {
        opacity: 1;

        border: 1px solid black;

        box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
      }

      &--visible {
        opacity: 1;
      }
      &--hidden {
        opacity: 0;
      }

      &--active {
        border: 1px solid black;

        box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
      }
      &--default {
        border: 1px solid transparent;

        box-shadow: 0 0 0 rgba($color: #000000, $alpha: .3);
      }
    }
  }
}
</style>

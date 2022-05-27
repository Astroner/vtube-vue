import { computed } from "vue";

import { useStore } from "@/store";

export const useUser = () => {
  const store = useStore();

  return computed(() => store.state.user);
};

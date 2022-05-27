import { Ref, ref, watchEffect } from "vue";

export interface ComputeStatus {
  isActive: boolean
}

export const asyncComputed = <T>(caller: (status: ComputeStatus) => T | "EXIT" | Promise<T | "EXIT">): [Ref<boolean>, Ref<T | null>, Ref<null | Error>] => {
  const data: Ref<null | T> = ref<null | T>(null) as any;
  const isLoading = ref<boolean>(true);
  const error = ref<Error | null>(null);

  watchEffect((onCleanup) => {
    const status: ComputeStatus = {
      isActive: true,
    };
    onCleanup(() => {
      status.isActive = false;
    });
    const result = caller(status);
    if (result instanceof Promise) {
      isLoading.value = true;
      data.value = null;
      result
        .then((res) => {
          if (!status.isActive) return;
          if (res === "EXIT") {
            data.value = null;
          } else {
            data.value = res;
          }
          error.value = null;
        })
        .catch((e) => {
          if (!status.isActive) return;
          error.value = e;
          data.value = null;
        })
        .finally(() => {
          isLoading.value = false;
        });
    } else if (result === "EXIT") {
      data.value = null;
      isLoading.value = false;
      error.value = null;
    } else {
      data.value = result;
      isLoading.value = false;
      error.value = null;
    }
  });

  return [isLoading, data, error];
};

import { inject } from "vue";

import { PagesAPIKey, PagesAPIDefault } from "../providers/Pages.provider";

export const usePages = () => {
  const pages = inject(PagesAPIKey, PagesAPIDefault);

  return {
    goToPage: pages.goToPage,
  };
};

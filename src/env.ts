export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MAIN_API: process.env.VUE_APP_MAIN_API ?? "error",
};

Object.defineProperty(window, 'envs', {
  value: env,
});

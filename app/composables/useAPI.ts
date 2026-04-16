// composables/useMyFetch.ts
import type { UseFetchOptions } from "#app";

export const useMyFetch = <T>(
  url: string,
  loading_dialog: Boolean,
  options: UseFetchOptions<T> = {}
) => {

  const defaultOptions: UseFetchOptions<T> = {
    retry: 0,
    cache: 'default',

    // onRequest({ request, options }) {
    //   // kalo multiple api get
    //   if (pageStore.loadingCount === 0 && loading_dialog === true) {
    //     pageStore.incrementLoading();
    //   }
    // },

    onResponse({ request, response, options }) {
    //   setTimeout(() => {
    //     pageStore.decrementLoading();
    //   }, 300);
    },

    onResponseError({ request, response, options, error }) {
    //   setTimeout(() => {
    //     pageStore.decrementLoading();
    //   }, 300);
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };
  return useFetch(url, mergedOptions);
};

// plugins/api.ts
import { $fetch, type $Fetch } from "ofetch";
import repositoryFactory, { type ApiRepositories } from "~/repositories";

export default defineNuxtPlugin((nuxtApp) => {
  const apiFetcher: $Fetch = $fetch.create({
    baseURL: "https://script.google.com/macros/s/AKfycbwwCOGh8Bqkd_KyNhDdENElZEy4MXOM81Vrb2woBylgWCbjEh6HglR7pLacTN6cirdNJw/exec",
    // headers: {
    //   Accept: "application/json",
    // },
      headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  });

  const repositories: ApiRepositories = {
    alats: new repositoryFactory.alats(apiFetcher),
  };

  return {
    provide: {
      api: repositories,
    },
  };
});

// plugins/api.ts
import { $fetch, type $Fetch } from "ofetch";
import repositoryFactory, { type ApiRepositories } from "~/repositories";

export default defineNuxtPlugin((nuxtApp) => {
  const apiFetcher: $Fetch = $fetch.create({
    baseURL: "https://script.google.com/macros/s/AKfycbwz0o9rqLtTmqXH02Udr4LgNcNS6yS3zHR4mOuWbDYXcQOijviX6TGMRG0zJEwkC37XmQ/exec",
    headers: {
      Accept: "application/json",
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

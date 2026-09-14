// src/lib/app-params.js

export const appParams = {
  get: (key) => {
    if (typeof window === "undefined") return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  },
  getAll: () => {
    if (typeof window === "undefined") return {};
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    return params;
  },
};

export default appParams;

// src/util/APIUtils.js
import { API_BASE_URL, ACCESS_TOKEN } from "../constants";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    headers.append("Authorization", "Bearer " + token);
  }

  return fetch(options.url, {
    ...options,
    headers: headers,
  }).then(async (response) => {
    const json = await response.json();
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  });
};

// Call profile
export function getCurrentUserProfile() {
  return request({
    url: `${API_BASE_URL}/auth/oauth2/profile`,
    method: "GET",
  });
}

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_ENV } from "../env";

export const createBaseQuery = (endpoint: string) => {
    return fetchBaseQuery({
        baseUrl: `${APP_ENV.API_BASE_URL}/api/${endpoint}`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
        paramsSerializer: (params) => {
          const usp = new URLSearchParams();

          Object.entries(params || {}).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((val) => usp.append(key, val));
            } else if (value !== undefined && value !== null) {
              usp.set(key, String(value));
            }
          });

          return usp.toString();
        },
    });
};

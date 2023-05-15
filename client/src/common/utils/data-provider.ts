import {
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  fetchUtils,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  UpdateManyParams,
  UpdateParams
} from "react-admin";
import { stringify } from "query-string";
import { AuthResponse, localStorageKey, rejectAuth } from "./auth-provider";

const apiUrl = "http://localhost:3000/api";
const httpClient = fetchUtils.fetchJson;

function getAuthHeader() {
  const payload = localStorage.getItem(localStorageKey);
  if (payload) {
    const identity: AuthResponse = JSON.parse(payload);
    if (identity.access_token) return {
      Authorization: `Bearer ${identity.access_token}`
    };
  }
  return null;
}

const convertFileToBase64 = (file: { rawFile: Blob; }) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file.rawFile);
  });

async function imagesPayload(params: CreateParams<any>) {
  const unfilteredPayload = await Promise.all(params.data.images.map(
    async (image: { rawFile: any; src: string; title: string; _id: string | undefined }) => {
      if (image._id) return image;
      if (!(image.rawFile instanceof File)) return null;
      try {
        const src = await convertFileToBase64(image);
        return {
          src: src,
          title: image.title
        };
      } catch (e) {
        console.log(e)
      }
    }));
  return unfilteredPayload.filter((image: { src: string; title: string } | null) => !!image)
  }

export default {
  getList: async (resource: string, params: GetListParams) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      range: JSON.stringify([(page - 1) * perPage, perPage]),
      filter: JSON.stringify(params.filter)
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    const authHeader = getAuthHeader();
    if (authHeader) {
      try {
        const { json } = await httpClient(url,
          {
            credentials: "include" as RequestCredentials,
            mode: "cors" as RequestMode,
            headers: new Headers(authHeader)
          }
        );
        return json;
      } catch (e) {
        console.log(e);
      }
    }
    return rejectAuth();
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`,
        {
          credentials: "include",
          headers: new Headers(authHeader)
        }
      );
      return {
        data: json
      };
    }
    return rejectAuth();
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const query = {
      filter: JSON.stringify({ ids: params.ids })
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(url, {
        credentials: "include",
        headers: new Headers(authHeader)
      });
      return { data: json };
    }
    return rejectAuth();
  },

  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        // target: params.target,
        // id: params.id,
        [params.target]: params.id
      })
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(url, {
        credentials: "include",
        headers: new Headers(authHeader)
      });
      return json;
    }
    return rejectAuth();
    //   {
    //   data: json,
    //   total: parseInt(headers.get("content-range").split("/").pop(), 10)
    // }
    // ));
  },

  create: async (resource: string, params: CreateParams) => {
    if (params.data.images && params.data.images.length > 0) {
      const b64Images = await imagesPayload(params);
      if (b64Images && b64Images.length > 0) params.data.images = b64Images;
      else delete params.data.images;
    }

    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
        credentials: "include",
        headers: new Headers(authHeader)
      });
      return {
        data: { ...params.data, id: json.id }
      };
    }
    return rejectAuth();
  },

  update: async (resource: string, params: UpdateParams) => {
    if (params.data.images && params.data.images.length > 0) {
      const b64Images = await imagesPayload(params);
      if (b64Images && b64Images.length > 0) params.data.images = b64Images;
      else delete params.data.images;
    }

    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(params.data),
        credentials: "include",
        headers: new Headers(authHeader)
      });
      return { data: json };
    }
    return rejectAuth();
  },

  updateMany: async (resource: string, params: UpdateManyParams) => {
    const query = {
      filter: JSON.stringify({ ids: params.ids })
    };
    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
        method: "PATCH",
        body: JSON.stringify(params.data),
        credentials: "include",
        headers: new Headers(authHeader)
      });
      return { data: json };
    }
    return rejectAuth();
  },

  delete: async (resource: string, params: DeleteParams) => {
    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: new Headers(authHeader)
      });
      return { data: json };
    }
    return rejectAuth();
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    const query = {
      filter: JSON.stringify({ ids: params.ids })
    };
    const authHeader = getAuthHeader();
    if (authHeader) {
      const { json } = await httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
        method: "DELETE",
        credentials: "include",
        headers: new Headers(authHeader)
        // body: JSON.stringify(params.data)
      });
      return { data: json };
    }
    return rejectAuth();
  }
};

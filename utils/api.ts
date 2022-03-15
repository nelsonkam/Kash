import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import store from './store';
import authSlice from '../slices/auth';

export const BASE_URL = store.getState().prefs.env === 'beta'
  ? 'https://beta.mykash.africa/'
  : 'https://prod.mykash.africa/';

const api = axios.create({
  baseURL: BASE_URL,
});


const refreshAuthLogic = async (failedRequest: any) => {
  const state = store.getState();
  const { refresh } = state.auth;
  const resp = await api
    .post(
      '/token/refresh',
      { refresh },
      { headers: { Authorization: 'Bearer ' + refresh } },
    )
    .catch(async err => {
      console.log(err.response.status)
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 400)
      ) {
        store.dispatch(authSlice.actions.logout(null));
      }
    });
  if (resp) {
    store.dispatch(
      authSlice.actions.setTokens({
        access: resp.data.access,
        refresh: resp.data.refresh,
      }),
    );
    failedRequest.response.config.headers['Authorization'] =
      'Bearer ' + resp.data.access;
    return Promise.resolve();
  }
};

createAuthRefreshInterceptor(api, refreshAuthLogic);

api.interceptors.request.use(async config => {
  const state = store.getState();
  const { access } = state.auth;
  const { env } = state.prefs;
  config.baseURL = env === 'beta' ? 'https://beta.mykash.africa/'
    : 'https://prod.mykash.africa/';

  if (access) config.headers['Authorization'] = 'Bearer ' + access;
  return config;
});

export function fetcher(url: string) {
  return api.get(url).then(res => {
    return res.data;
  });
}

export function fetcherInfinite(url: string) {
  return api.get(url).then(res => {
    return res.data.results;
  });
}

export function uploadFile(data: any) {
  return api.post('/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function saveImage(path: any) {
  const data = new FormData();
  const arr = path.split('/');
  const extension = path.split('.')[path.split('.').length - 1];
  data.append('image', {
    uri: path,
    name: arr[arr.length - 1],
    type: extension,
  });
  const res = await uploadFile(data);
  return res.data.url;
}

export default api;

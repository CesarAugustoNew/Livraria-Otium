import type { Banner } from '../types';
import { api } from './api';

export const bannerService = {
  list: (signal?: AbortSignal) => api<Banner[]>('/banners', { signal }),
};

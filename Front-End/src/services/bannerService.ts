import { mockBanners } from '../mocks/data';
import type { Banner } from '../types';
import { api, USE_MOCKS } from './api';

export const bannerService = {
  async list(signal?: AbortSignal): Promise<Banner[]> {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockBanners;
    }
    return api<Banner[]>('/banners', { signal });
  },
};

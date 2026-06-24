import { create } from 'zustand';
import { db, TrendingGem, VIPService, StaffMember, ExploreItem, Announcement } from '../db/indexedDb';

interface CMSState {
  trendingGems: TrendingGem[];
  vipServices: VIPService[];
  staff: StaffMember[];
  exploreItems: ExploreItem[];
  announcements: Announcement[];
  initialized: boolean;
  loading: boolean;
  
  init: () => Promise<void>;
  
  addTrendingGem: (gem: TrendingGem) => Promise<void>;
  updateTrendingGem: (gem: TrendingGem) => Promise<void>;
  deleteTrendingGem: (id: string) => Promise<void>;
  toggleTrending: (id: string) => Promise<void>;
  
  addVIPService: (service: VIPService) => Promise<void>;
  updateVIPService: (service: VIPService) => Promise<void>;
  deleteVIPService: (id: string) => Promise<void>;
  getServicesByProvider: (providerId: string) => VIPService[];
  
  addStaff: (staff: StaffMember) => Promise<void>;
  updateStaff: (staff: StaffMember) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  getStaffByProvider: (providerId: string) => StaffMember[];
  
  addExploreItem: (item: ExploreItem) => Promise<void>;
  updateExploreItem: (item: ExploreItem) => Promise<void>;
  deleteExploreItem: (id: string) => Promise<void>;
  
  addAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

export const useCMSStore = create<CMSState>((set, get) => ({
  trendingGems: [],
  vipServices: [],
  staff: [],
  exploreItems: [],
  announcements: [],
  initialized: false,
  loading: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    
    try {
      await db.init();
      
      const [trendingGems, vipServices, staff, exploreItems, announcements] = await Promise.all([
        db.getAll<TrendingGem>('trendingGems'),
        db.getAll<VIPService>('vipServices'),
        db.getAll<StaffMember>('staff'),
        db.getAll<ExploreItem>('exploreItems'),
        db.getAll<Announcement>('announcements'),
      ]);
      
      set({ trendingGems, vipServices, staff, exploreItems, announcements, initialized: true, loading: false });
    } catch (error) {
      console.error('CMS init error:', error);
      set({ loading: false });
    }
  },

  addTrendingGem: async (gem) => {
    await db.add('trendingGems', gem);
    set((state) => ({ trendingGems: [...state.trendingGems, gem] }));
  },

  updateTrendingGem: async (gem) => {
    await db.update('trendingGems', gem);
    set((state) => ({
      trendingGems: state.trendingGems.map((g) => (g.id === gem.id ? gem : g)),
    }));
  },

  deleteTrendingGem: async (id) => {
    await db.delete('trendingGems', id);
    set((state) => ({ trendingGems: state.trendingGems.filter((g) => g.id !== id) }));
  },

  toggleTrending: async (id) => {
    const gem = get().trendingGems.find((g) => g.id === id);
    if (gem) {
      const updated = { ...gem, isTrending: !gem.isTrending, updatedAt: new Date().toISOString() };
      await get().updateTrendingGem(updated);
    }
  },

  addVIPService: async (service) => {
    await db.add('vipServices', service);
    set((state) => ({ vipServices: [...state.vipServices, service] }));
  },

  updateVIPService: async (service) => {
    await db.update('vipServices', service);
    set((state) => ({
      vipServices: state.vipServices.map((s) => (s.id === service.id ? service : s)),
    }));
  },

  deleteVIPService: async (id) => {
    await db.delete('vipServices', id);
    set((state) => ({ vipServices: state.vipServices.filter((s) => s.id !== id) }));
  },

  getServicesByProvider: (providerId) => {
    return get().vipServices.filter((s) => s.providerId === providerId);
  },

  addStaff: async (staff) => {
    await db.add('staff', staff);
    set((state) => ({ staff: [...state.staff, staff] }));
  },

  updateStaff: async (staff) => {
    await db.update('staff', staff);
    set((state) => ({
      staff: state.staff.map((s) => (s.id === staff.id ? staff : s)),
    }));
  },

  deleteStaff: async (id) => {
    await db.delete('staff', id);
    set((state) => ({ staff: state.staff.filter((s) => s.id !== id) }));
  },

  getStaffByProvider: (providerId) => {
    return get().staff.filter((s) => s.providerId === providerId);
  },

  addExploreItem: async (item) => {
    await db.add('exploreItems', item);
    set((state) => ({ exploreItems: [...state.exploreItems, item] }));
  },

  updateExploreItem: async (item) => {
    await db.update('exploreItems', item);
    set((state) => ({
      exploreItems: state.exploreItems.map((i) => (i.id === item.id ? item : i)),
    }));
  },

  deleteExploreItem: async (id) => {
    await db.delete('exploreItems', id);
    set((state) => ({ exploreItems: state.exploreItems.filter((i) => i.id !== id) }));
  },

  addAnnouncement: async (announcement) => {
    await db.add('announcements', announcement);
    set((state) => ({ announcements: [...state.announcements, announcement] }));
  },

  deleteAnnouncement: async (id) => {
    await db.delete('announcements', id);
    set((state) => ({ announcements: state.announcements.filter((a) => a.id !== id) }));
  },
}));

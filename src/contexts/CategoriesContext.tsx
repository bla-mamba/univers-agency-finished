import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Waves, Landmark, Map, Compass, Mountain, Users, HeartHandshake, Sparkles, Star, Sun, Umbrella, Camera, Globe, Plane, Ship, Brain as Train, Car, Bike, Trees, Flower, Leaf, Snowflake, Sunset, Wind, Coffee, Music, Video as LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  icon: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Waves, Landmark, Map, Compass, Mountain, Users, HeartHandshake, Sparkles,
  Star, Sun, Umbrella, Camera, Globe, Plane, Ship, Train, Car, Bike,
  Trees, Flower, Leaf, Snowflake, Sunset, Wind, Coffee, Music,
};

export function resolveIcon(iconName: string): LucideIcon | null {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
}

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  reload: () => void;
}

const CategoriesContext = createContext<CategoriesContextValue>({
  categories: [],
  loading: true,
  reload: () => {},
});

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug, description, sort_order, icon')
      .order('sort_order', { ascending: true });
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, reload: load }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}

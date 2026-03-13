import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface HeroMedia {
  media_type: 'image' | 'video';
  url: string;
  overlay_opacity: number;
}

export function useHeroMedia(pageKey: string, fallback: HeroMedia): HeroMedia {
  const [hero, setHero] = useState<HeroMedia>(fallback);

  useEffect(() => {
    supabase
      .from('hero_media')
      .select('media_type, url, overlay_opacity')
      .eq('page_key', pageKey)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setHero({
            media_type: data.media_type as 'image' | 'video',
            url: data.url,
            overlay_opacity: data.overlay_opacity,
          });
        }
      });
  }, [pageKey]);

  return hero;
}

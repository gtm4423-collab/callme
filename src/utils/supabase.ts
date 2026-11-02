import { createClient } from '@supabase/supabase-js';
import { ReviewItem } from '../types';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://ovibhkmtxotdbkhjxhog.supabase.co';
export const SUPABASE_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eg9keX-30bCJige8FajvqA_HZCcIFo0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Track CPA Link clicks (Button Clicks, Device, Timestamp)
export async function trackClickEvent(buttonName: string, destinationUrl: string) {
  try {
    const payload = {
      button_name: buttonName,
      destination_url: destinationUrl,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      referrer: document.referrer || 'direct',
      created_at: new Date().toISOString()
    };

    // Attempt to store in 'clicks' or 'cpa_clicks' table
    const { error } = await supabase.from('clicks').insert([payload]);
    if (error) {
      // If table doesn't exist or RLS blocks, log quietly without breaking UI
      console.info('Supabase click event tracking note:', error.message);
    }
  } catch (err) {
    console.info('Supabase click tracking fallback:', err);
  }
}

// Fetch dynamic reviews from Supabase
export async function fetchSupabaseReviews(): Promise<ReviewItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data) {
      return null;
    }

    return data.map(item => ({
      id: String(item.id),
      author: item.author || 'Anonymous Fan',
      avatar: item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      rating: item.rating || 5,
      date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent',
      comment: item.comment || '',
      likes: item.likes || 0,
      isVerifiedFan: true
    }));
  } catch {
    return null;
  }
}

// Add a new review to Supabase
export async function addSupabaseReview(review: Omit<ReviewItem, 'id'>): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').insert([{
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      likes: review.likes,
      created_at: new Date().toISOString()
    }]);

    return !error;
  } catch {
    return false;
  }
}

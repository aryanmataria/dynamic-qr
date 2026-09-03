import { supabase } from '../../../lib/supabase';
import { isAdmin } from '../../../lib/checkAdmin';

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();

  const { slug, business_name, destination_url } = req.body || {};
  if (!slug) return res.status(400).json({ error: 'slug is required' });

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({ slug, business_name, destination_url: destination_url || null })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ code: data });
}

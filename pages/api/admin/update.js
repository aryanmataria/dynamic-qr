import { supabase } from '../../../lib/supabase';
import { isAdmin } from '../../../lib/checkAdmin';

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();

  const { slug, destination_url, business_name } = req.body || {};
  if (!slug) return res.status(400).json({ error: 'slug is required' });

  const updates = {};
  if (destination_url !== undefined) updates.destination_url = destination_url;
  if (business_name !== undefined) updates.business_name = business_name;

  const { data, error } = await supabase
    .from('qr_codes')
    .update(updates)
    .eq('slug', slug)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ code: data });
}

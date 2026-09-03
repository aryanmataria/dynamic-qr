import { supabase } from '../../../lib/supabase';

// This is the URL every printed QR code actually points to:
//   https://yourdomain.com/q/<slug>
// It looks up the slug, logs the scan, and 302-redirects to the
// real destination — which you can change anytime without touching
// the printed QR code.
export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send('Missing code');
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .select('id, destination_url, scan_count')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return res.status(404).send('This QR code is not set up yet.');
  }

  // Fire-and-forget scan tracking — don't make the visitor wait on it.
  supabase
    .from('qr_codes')
    .update({
      scan_count: (data.scan_count || 0) + 1,
      last_scanned_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .then(() => {});

  // If you haven't coded this client's destination yet, send them
  // to a friendly holding page instead of a broken redirect.
  if (!data.destination_url) {
    res.writeHead(302, { Location: '/coming-soon' });
    return res.end();
  }

  res.writeHead(302, { Location: data.destination_url });
  res.end();
}

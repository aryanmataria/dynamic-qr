/**
 * Usage:
 *   node scripts/generate-qr.js "Joe's Cafe" joes-cafe https://joescafe.com
 *   node scripts/generate-qr.js "Joe's Cafe" joes-cafe
 *     (destination omitted -> visitors see the "coming soon" page until
 *      you set the real link later from the admin page)
 *
 * This inserts a row in Supabase AND writes a printable PNG to ./output/<slug>.png
 * The PNG encodes:  <NEXT_PUBLIC_BASE_URL>/q/<slug>
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const [, , businessName, slugArg, destinationUrl] = process.argv;

if (!businessName || !slugArg) {
  console.error(
    'Usage: node scripts/generate-qr.js "<Business Name>" <slug> [destination_url]'
  );
  process.exit(1);
}

// Turn "Joe's Cafe" into a safe url slug if a raw slug wasn't given cleanly
const slug = slugArg.toLowerCase().replace(/[^a-z0-9-]/g, '-');

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if (!baseUrl) {
  console.error('Set NEXT_PUBLIC_BASE_URL in .env.local first (e.g. https://yourdomain.com)');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function main() {
  const { error } = await supabase
    .from('qr_codes')
    .insert({
      slug,
      business_name: businessName,
      destination_url: destinationUrl || null,
    });

  if (error) {
    console.error('Failed to create database entry:', error.message);
    process.exit(1);
  }

  const redirectUrl = `${baseUrl.replace(/\/$/, '')}/q/${slug}`;

  const outDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, `${slug}.png`);

  await QRCode.toFile(outPath, redirectUrl, {
    width: 1000, // high-res, good for print
    margin: 2,
  });

  console.log('Done!');
  console.log('  Business:     ', businessName);
  console.log('  Slug:         ', slug);
  console.log('  QR points to: ', redirectUrl);
  console.log('  PNG saved to: ', outPath);
  console.log(
    destinationUrl
      ? '  Destination is live.'
      : '  No destination set yet — scanning shows the "coming soon" page until you set one in /admin.'
  );
}

main();


import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest){
  const body = await req.json();
  // Lazy import to avoid bundling in edge
  const archiver = (await import('archiver')).default;
  const { Readable } = await import('stream');
  const { PassThrough } = await import('stream');
  const { createGzip } = await import('zlib');

  // Build zip in-memory
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  archive.on('warning', (err:any)=> console.warn('archiver warn', err));
  archive.on('error', (err:any)=> { throw err; });

  archive.append(JSON.stringify(body.journal ?? {}, null, 2), { name: 'journal.json' });
  archive.append(JSON.stringify(body.presets ?? {}, null, 2), { name: 'presets.json' });
  archive.append(JSON.stringify(body.env ?? {}, null, 2), { name: 'env.json' });

  archive.finalize();

  archive.on('data', (d:any)=> chunks.push(Buffer.from(d)));
  await new Promise<void>((resolve)=> archive.on('end', ()=> resolve()));

  const zip = Buffer.concat(chunks);
  return new Response(zip, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="trade-composer-pack.zip"'
    }
  });
}

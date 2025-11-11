
import type { NextRequest } from 'next/server'

function toCSV(rows: any[], headers: string[]): string {
  const esc = (v:any)=>{
    if(v==null) return '';
    const s = String(v);
    if(s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  };
  const head = headers.join(',');
  const lines = rows.map(r => headers.map(h => esc(r[h])).join(','));
  return [head, ...lines].join('\n');
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const archiver = (await import('archiver')).default;
  const { PassThrough } = await import('stream');

  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: Buffer[] = [];
  archive.on('data', (d:any)=> chunks.push(Buffer.from(d)));
  archive.on('error', (err:any)=> { throw err; });

  // JSONs
  archive.append(JSON.stringify(body.journal ?? {}, null, 2), { name: 'journal.json' });
  archive.append(JSON.stringify(body.presets ?? {}, null, 2), { name: 'presets.json' });
  archive.append(JSON.stringify(body.env ?? {}, null, 2), { name: 'env.json' });
  archive.append(JSON.stringify(body.scope ?? {}, null, 2), { name: 'scope.json' });
  archive.append(JSON.stringify(body.risk ?? {}, null, 2), { name: 'risk.json' });
  archive.append(JSON.stringify(body.plan ?? {}, null, 2), { name: 'plan.json' });
  archive.append(JSON.stringify(body.queue ?? {}, null, 2), { name: 'queue.json' });
  archive.append(JSON.stringify(body.sim ?? {}, null, 2), { name: 'sim.json' });

  // CSVs
  const frames = Array.isArray(body.frames)? body.frames: [];
  const ladder = body.ladder || { bids:[], asks:[], mid:null };
  const reasons = Array.isArray(body.reasons)? body.reasons: [];

  const framesCsv = toCSV(frames, ['index','ts','r','confidence','expected_last','real_last']);
  archive.append(framesCsv, { name: 'frames.csv' });

  const ladderRows = [
    ...((ladder.bids||[]).map((row:any)=>({side:'bid', price: row[0], qty: row[1]}))),
    ...((ladder.asks||[]).map((row:any)=>({side:'ask', price: row[0], qty: row[1]})))
  ];
  const ladderCsv = toCSV(ladderRows, ['side','price','qty']);
  archive.append(ladderCsv, { name: 'ladder.csv' });

  const reasonsCsv = toCSV(reasons, ['ts','mode','symbol','reason','hash']);
  archive.append(reasonsCsv, { name: 'reasons.csv' });

  await archive.finalize();
  await new Promise<void>((resolve)=> archive.on('end', ()=> resolve()));
  const zip = Buffer.concat(chunks);

  return new Response(zip, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="trade-composer-pack.zip"'
    }
  });
}

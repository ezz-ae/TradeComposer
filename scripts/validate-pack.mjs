
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const file = process.argv[2];
if(!file){ console.error('Usage: node scripts/validate-pack.mjs <pack.zip>'); process.exit(2); }
if(!fs.existsSync(file)){ console.error('pack not found:', file); process.exit(2); }

const zip = new AdmZip(file);
const entries = zip.getEntries().map(e => e.entryName);

function mustHave(name){
  if(!entries.includes(name)){
    console.error('missing:', name);
    process.exit(1);
  }
}

mustHave('env.json');
mustHave('frames.csv');
mustHave('ladder.csv');
mustHave('reasons.csv');

// env.json checks
const envJson = JSON.parse(zip.readAsText('env.json'));
['orgGate','userGate','sessionGate'].forEach(k => {
  if(!(k in envJson)){
    console.error('env.json missing key:', k);
    process.exit(1);
  }
});

console.log('OK: pack looks valid.');

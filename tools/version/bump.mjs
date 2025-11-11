
import fs from 'fs';

// Usage: node tools/version/bump.mjs 3.1.1
const next = process.argv[2];
if(!next){ console.error('Usage: node tools/version/bump.mjs <semver>'); process.exit(1); }

function patchPackageJson(p){
  const txt = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(txt);
  j.version = next;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}

['package.json'].forEach(p => {
  if(fs.existsSync(p)) patchPackageJson(p);
});

console.log('Version bumped to', next);

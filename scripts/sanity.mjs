
import { execSync } from 'node:child_process';

function sh(cmd){
  try { return execSync(cmd, { stdio: 'inherit' }); }
  catch(e){ process.exitCode = 1; }
}
console.log('> Sanity: node', process.version);
sh('pnpm -v');
// verify web exists and next version
try {
  const pkg = JSON.parse(await (await import('node:fs/promises')).readFile('apps/web/package.json', 'utf8'));
  console.log('> apps/web next:', pkg.dependencies?.next || pkg.devDependencies?.next);
} catch (e) {
  console.warn('apps/web/package.json not readable');
}

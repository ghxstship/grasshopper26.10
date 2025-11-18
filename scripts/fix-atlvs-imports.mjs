import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function* walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory()) {
      yield* walk(path);
    } else if (file.name === 'page.tsx') {
      yield path;
    }
  }
}

const atlvsDir = '/Users/julianclarkson/Documents/Grasshopper26.10/gvteway-atlvs/src/app/atlvs';
let count = 0;

for await (const file of walk(atlvsDir)) {
  const content = await readFile(file, 'utf8');
  const updated = content.replace(
    /@\/components\/atlvs\/shared\/AtlvsLayout/g,
    '@/components/templates/AtlvsLayout'
  );
  if (content !== updated) {
    await writeFile(file, updated, 'utf8');
    count++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nTotal files fixed: ${count}`);

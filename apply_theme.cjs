const fs = require('fs');
const path = require('path');

const replacements = {
  // Lavender to Tredence Teal
  '#7c6cf0': '#0F3D4C',
  '#6354d4': '#0A2B36',
  '#f5f3fe': '#F2F6F8',
  '#ece9fd': '#E5EDF0',
  '#d4cef8': '#C5D9E0',
  
  // Border Radii tightening
  'rounded-2xl': 'rounded-lg',
  'rounded-xl': 'rounded-md',
  'rounded-lg': 'rounded-md',
};

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.tsx') || filepath.endsWith('.ts') || filepath.endsWith('.css'))) {
      callback(filepath);
    }
  });
}

walkSync('./src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  
  for (const [search, replace] of Object.entries(replacements)) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated: ${filepath}`);
  }
});

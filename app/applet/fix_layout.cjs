const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('index.tsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(pagesDir);

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix wrapper: min-h-screen -> h-full
    content = content.replace(/className="([^"]*)\bmin-h-screen\b([^"]*)"/g, 'className="$1h-full$2"');
    
    // Fix Header: remove mb-6, mb-8, py-4, change gap-6 to gap-4
    content = content.replace(/<header className="([^"]*)\s\bmb-6\b([^"]*)"/g, '<header className="$1$2"');
    content = content.replace(/<header className="([^"]*)\s\bmb-8\b([^"]*)"/g, '<header className="$1$2"');
    content = content.replace(/<header className="([^"]*)\s\bpy-4\b([^"]*)"/g, '<header className="$1$2"');
    content = content.replace(/<header className="([^"]*)\s\bgap-6\b([^"]*)"/g, '<header className="$1 gap-4$2"');

    // Fix inner main: remove px-8 pb-10
    content = content.replace(/<main className="([^"]*)\s\bpx-8\b([^"]*)"/g, '<main className="$1$2"');
    content = content.replace(/<main className="([^"]*)\s\bpb-10\b([^"]*)"/g, '<main className="$1$2"');
    
    // Clean up multiple spaces
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
        return `className="${classes.replace(/\s+/g, ' ').trim()}"`;
    });

    fs.writeFileSync(file, content);
});

console.log('Fixed pages.');

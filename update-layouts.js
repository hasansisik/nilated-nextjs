const fs = require('fs');
const path = require('path');

const loggedOutDir = path.join(__dirname, 'app', '(logged-out)');

// Find all page.tsx files in the logged-out directory (excluding the main page.tsx)
const findPageFiles = (dir) => {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip the main page.tsx
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        files.push(...findPageFiles(fullPath));
      }
    } else if (entry.name === 'page.tsx' && dir !== loggedOutDir) {
      files.push(fullPath);
    }
  }
  
  return files;
};

// Process each file
const processFile = (filePath) => {
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the Layout import
    content = content.replace(/import Layout from ["']@\/components\/layout\/Layout["'];?\n/g, '');
    
    // Remove the Layout component wrapper
    content = content.replace(/<Layout[^>]*>\s*([\s\S]*?)\s*<\/Layout>/g, '$1');
    
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Find and process all files
const pageFiles = findPageFiles(loggedOutDir);
pageFiles.forEach(processFile);


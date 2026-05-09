const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let brokenLinks = [];

function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getHtmlFiles(rootDir);
const hrefRegex = /href=["']([^"']+)["']/g;

for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        const link = match[1];
        if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('#') || link.startsWith('javascript:')) {
            continue;
        }
        
        // Remove query params or hashes
        const cleanLink = link.split('?')[0].split('#')[0];
        if (!cleanLink) continue; // It was just a hash

        const targetPath = path.resolve(path.dirname(file), cleanLink);
        
        if (!fs.existsSync(targetPath)) {
            brokenLinks.push({ file: path.relative(rootDir, file), link, resolvedPath: path.relative(rootDir, targetPath) });
        }
    }
}

if (brokenLinks.length > 0) {
    console.log(`Found ${brokenLinks.length} broken links:`);
    const byFile = {};
    for (const b of brokenLinks) {
        if (!byFile[b.file]) byFile[b.file] = [];
        byFile[b.file].push(b);
    }
    for (const file in byFile) {
        console.log(`\nIn ${file}:`);
        for (const b of byFile[file]) {
            console.log(`  - ${b.link} (Resolves to: ${b.resolvedPath})`);
        }
    }
} else {
    console.log('No broken links found!');
}

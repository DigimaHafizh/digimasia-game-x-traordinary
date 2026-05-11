const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // Fix the broken syntax from previous replace
            if (content.includes('getBackendUrl()/')) {
                content = content.replace(/getBackendUrl\(\)\//g, '`${getBackendUrl()}/');
                updated = true;
            }
            if (content.includes('getBackendUrl()?"')) {
                content = content.replace(/getBackendUrl\(\)\?/g, '`${getBackendUrl()}?');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed syntax in: ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Done fixing syntax.');

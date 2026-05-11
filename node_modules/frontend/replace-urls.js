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

            // Simple replace logic
            const toReplace1 = "`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}`";
            const toReplace2 = "${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}";
            const toReplace3 = `process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'`;

            if (content.includes(toReplace1) || content.includes(toReplace2) || content.includes(toReplace3)) {
                // Determine import path relative to fullPath
                const srcPath = path.join(__dirname, 'src');
                let relParts = path.relative(path.dirname(fullPath), path.join(__dirname, 'src/lib/config.ts')).replace(/\\/g, '/');
                if (!relParts.startsWith('.')) relParts = './' + relParts;
                // remove extension
                relParts = relParts.replace('.ts', '');

                // Usually we can just use absolute import alias if configured, e.g., '@/lib/config'
                const importStr = `import { getBackendUrl } from '@/lib/config';\n`;

                if (!content.includes('getBackendUrl')) {
                    // Add import below last import or at top
                    const importIndex = content.lastIndexOf('import ');
                    let insertPos = 0;
                    if (importIndex !== -1) {
                        insertPos = content.indexOf('\n', importIndex) + 1;
                    }
                    content = content.slice(0, insertPos) + importStr + content.slice(insertPos);
                }

                // Replace properly
                content = content.replace(/`?\${process\.env\.NEXT_PUBLIC_BACKEND_URL \|\| 'http:\/\/localhost:3001'}`?/g, 'getBackendUrl()');
                content = content.replace(/process\.env\.NEXT_PUBLIC_BACKEND_URL \|\| 'http:\/\/localhost:3001'/g, 'getBackendUrl()');

                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Done replacement.');

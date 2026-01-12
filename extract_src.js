const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const yamlPath = path.join(__dirname, 'pages/home/components/moduleContainer.yml');
const outputDir = path.join(__dirname, 'extracted-app');

console.log(`Reading YAML from: ${yamlPath}`);

try {
    if (!fs.existsSync(yamlPath)) {
        console.error(`File not found: ${yamlPath}`);
        process.exit(1);
    }

    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    // Handle potential YAML parsing issues if file is very large or has specific types, 
    // but js-yaml should handle standard schemas.
    const doc = yaml.load(fileContents);

    const fileSystem = doc.properties?.fileSystem;

    if (!fileSystem) {
        console.error('No fileSystem found in YAML');
        if (doc) {
            console.log('Root keys:', Object.keys(doc));
            if (doc.properties) {
                console.log('Properties keys:', Object.keys(doc.properties));
            }
        }
        process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    let count = 0;
    for (const [filePath, content] of Object.entries(fileSystem)) {
        const fullPath = path.join(outputDir, filePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // content might be null/undefined if empty?
        fs.writeFileSync(fullPath, content || '');
        count++;
    }

    console.log(`Extraction complete. Extracted ${count} files to ${outputDir}`);

} catch (e) {
    console.error('Error during extraction:', e);
    process.exit(1);
}

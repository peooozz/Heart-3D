const fs = require('fs');
const code = fs.readFileSync('src/components/heartData.ts', 'utf8');

const regex = /position:\s*\[([^\]]+)\]/g;
const newCode = code.replace(regex, (match, p1) => {
    const coords = p1.split(',').map(n => parseFloat(n.trim()));
    const nx = coords[0] * 0.9;
    const ny = coords[1] * 0.9 - 0.1;
    const nz = coords[2] * 0.9;
    return `position: [${nx.toFixed(3)}, ${ny.toFixed(3)}, ${nz.toFixed(3)}]`;
});

fs.writeFileSync('src/components/heartData.ts', newCode);
console.log('Done!');

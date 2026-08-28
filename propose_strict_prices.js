const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const crypto = require('crypto');

const CLEAN_PRICES = [
    1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 
    1700, 1750, 1800, 1850, 1900, 1950, 2000, 2100, 2150, 2200, 
    2250, 2300, 2350, 2400, 2450, 2500, 2600, 2700, 2800, 2900, 3000
];

function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function getDiverseCleanPrice(oldPrice, id) {
    let candidates = CLEAN_PRICES.filter(p => p >= oldPrice * 0.8 && p <= oldPrice * 1.25);
    if (candidates.length === 0) {
        let closest = CLEAN_PRICES[0];
        let minDiff = Math.abs(oldPrice - closest);
        for (const p of CLEAN_PRICES) {
            const diff = Math.abs(oldPrice - p);
            if (diff < minDiff) {
                closest = p;
                minDiff = diff;
            }
        }
        return closest;
    }
    const hash = stringHash(id);
    return candidates[hash % candidates.length];
}

async function main() {
    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });
    
    let md = `# Proposed Product Price Changes\n\n`;
    md += `> [!IMPORTANT]\n> Please review the proposed price changes for **ALL** products below. STRICT RULE: ONLY the \`price\` field will be modified. \`originalPrice\` and \`discountPercent\` will remain exactly unchanged.\n\n`;
    md += `## Complete Pricing Review (${products.length} Products)\n\n`;
    md += `| Product Name | Current Price | Proposed Price | Current Original Price | Current Discount % |\n`;
    md += `|---|---|---|---|---|\n`;

    const changes = [];

    for (const p of products) {
        const oldPrice = p.price;
        const newPrice = getDiverseCleanPrice(oldPrice, p.id);

        changes.push({
            id: p.id,
            name: p.name,
            oldPrice,
            newPrice
        });
        
        const origStr = p.originalPrice ? `₹${p.originalPrice}` : '-';
        const discStr = p.discountPercent ? `${p.discountPercent}%` : '-';
        
        md += `| ${p.name} | ₹${oldPrice} | **₹${newPrice}** | ${origStr} | ${discStr} |\n`;
    }

    fs.writeFileSync('proposed_prices.json', JSON.stringify(changes, null, 2));
    
    md += `\n**Total products reviewed:** ${products.length}\n\n`;
    md += `## Verification Plan\n`;
    md += `- Only the \`price\` field will be modified in the database.\n`;
    md += `- A custom Prisma update script will be used to ensure strict compliance with not modifying any other field.\n`;
    md += `- No files or codebase configuration will be altered.\n`;
    
    fs.writeFileSync('implementation_plan.md', md);
    console.log('Done generating strict plan and json');
}

main().catch(console.error).finally(() => prisma.$disconnect());

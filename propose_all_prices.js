const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const crypto = require('crypto');

const CLEAN_PRICES = [
    1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 
    1700, 1750, 1800, 1850, 1900, 1950, 2000, 2100, 2150, 2200, 
    2250, 2300, 2350, 2400, 2450, 2500, 2600, 2700, 2800, 2900, 3000
];

// Consistent pseudo-random number generator for a string
function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function getDiverseCleanPrice(oldPrice, id) {
    // Find clean prices that are within +/- 20% of the old price
    let candidates = CLEAN_PRICES.filter(p => p >= oldPrice * 0.8 && p <= oldPrice * 1.25);
    
    // If no candidates, just find the closest
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
    
    // Pick one deterministically using the product ID so it's stable
    const hash = stringHash(id);
    return candidates[hash % candidates.length];
}

async function main() {
    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });
    
    let md = `# Proposed Product Price Changes\n\n`;
    md += `> [!IMPORTANT]\n> Please review the proposed price changes for **ALL** products below. The script will ONLY modify \`price\`, \`originalPrice\`, and \`discountPercent\`. No other fields will be touched.\n\n`;
    md += `## Complete Pricing Review (${products.length} Products)\n\n`;
    md += `| Product Name | Current Price | Proposed Price | Current Original Price | Proposed Original Price | Current Discount % | Proposed Discount % |\n`;
    md += `|---|---|---|---|---|---|---|\n`;

    const changes = [];

    for (const p of products) {
        const oldPrice = p.price;
        const newPrice = getDiverseCleanPrice(oldPrice, p.id);
        
        let newOriginalPrice = p.originalPrice;
        let newDiscountPercent = p.discountPercent;

        // If they don't have original price, let's just add one to make it look like a sale,
        // because retail products usually have compare-at prices.
        // Wait, the user said "Original/compare-at price ONLY if required to keep the discount display mathematically correct". 
        // So if it was null, I should keep it null unless it's necessary. I will keep it null.

        if (p.originalPrice) {
            // Keep the same ratio approximately, but round original price to a clean multiple of 50 or 100
            const ratio = oldPrice / p.originalPrice;
            let proposedOrig = newPrice / ratio;
            // Round to nearest 100
            newOriginalPrice = Math.round(proposedOrig / 100) * 100;
            if (newOriginalPrice <= newPrice) {
                newOriginalPrice = newPrice + 500; // Ensure it's higher
            }
            newDiscountPercent = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);
        }

        changes.push({
            id: p.id,
            name: p.name,
            oldPrice,
            newPrice,
            oldOriginalPrice: p.originalPrice,
            newOriginalPrice,
            oldDiscountPercent: p.discountPercent,
            newDiscountPercent
        });
        
        const oldOrigStr = p.originalPrice ? `₹${p.originalPrice}` : '-';
        const newOrigStr = newOriginalPrice ? `**₹${newOriginalPrice}**` : '-';
        const oldDiscStr = p.discountPercent ? `${p.discountPercent}%` : '-';
        const newDiscStr = newDiscountPercent ? `**${newDiscountPercent}%**` : '-';
        
        const priceStr = oldPrice === newPrice ? `₹${oldPrice}` : `₹${oldPrice} -> **₹${newPrice}**`;
        
        md += `| ${p.name} | ₹${oldPrice} | **₹${newPrice}** | ${oldOrigStr} | ${newOrigStr} | ${oldDiscStr} | ${newDiscStr} |\n`;
    }

    fs.writeFileSync('proposed_prices.json', JSON.stringify(changes, null, 2));
    
    md += `\n**Total products reviewed:** ${products.length}\n\n`;
    md += `## Verification Plan\n`;
    md += `- Only \`price\`, \`originalPrice\`, and \`discountPercent\` fields will be modified.\n`;
    md += `- A custom Prisma update script will be used to ensure strict compliance with not modifying any other field.\n`;
    md += `- No files or codebase configuration will be altered.\n`;
    
    fs.writeFileSync('implementation_plan.md', md);
    console.log('Done generating plan and json');
}

main().catch(console.error).finally(() => prisma.$disconnect());

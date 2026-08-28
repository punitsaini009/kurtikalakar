const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const CLEAN_PRICES = [1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 2000, 2100, 2200, 2350, 2500];

function getClosestCleanPrice(oldPrice) {
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

async function main() {
    const products = await prisma.product.findMany();
    const changes = [];

    for (const p of products) {
        const oldPrice = p.price;
        const newPrice = getClosestCleanPrice(oldPrice);
        
        let newOriginalPrice = p.originalPrice;
        let newDiscountPercent = p.discountPercent;

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
    }

    fs.writeFileSync('proposed_prices.json', JSON.stringify(changes, null, 2));
    console.log('Saved to proposed_prices.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());

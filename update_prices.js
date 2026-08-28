const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const changes = JSON.parse(fs.readFileSync('proposed_prices.json', 'utf-8'));
    console.log(`Starting price update for ${changes.length} products...`);
    
    let updatedCount = 0;
    
    for (const item of changes) {
        if (item.oldPrice !== item.newPrice) {
            await prisma.product.update({
                where: { id: item.id },
                data: {
                    price: item.newPrice,
                    // STRICT: Not touching originalPrice or discountPercent!
                }
            });
            updatedCount++;
        }
    }
    
    console.log(`Successfully updated ${updatedCount} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

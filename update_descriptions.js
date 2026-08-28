const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const changes = JSON.parse(fs.readFileSync('proposed_details.json', 'utf-8'));
    console.log(`Starting description update for ${changes.length} products...`);
    
    let updatedCount = 0;
    
    for (const item of changes) {
        if (item.oldDesc !== item.newDesc) {
            await prisma.product.update({
                where: { id: item.id },
                data: {
                    description: item.newDesc
                }
            });
            updatedCount++;
        }
    }
    
    console.log(`Successfully updated ${updatedCount} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

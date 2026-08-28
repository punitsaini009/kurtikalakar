const fs = require('fs');
const path = require('path');

const changes = JSON.parse(fs.readFileSync('proposed_prices.json', 'utf-8'));

let md = `# Proposed Product Price Changes\n\n`;
md += `> [!IMPORTANT]\n> Please review the proposed price changes below. Only the \`price\`, \`originalPrice\`, and \`discountPercent\` fields will be modified in the database. No other product data (images, names, stock, etc.) will be affected.\n\n`;
md += `## Database Records to be Modified\n\n`;
md += `| Product Name | Current Price | Proposed Price | Current Original Price | Proposed Original Price | Current Discount % | Proposed Discount % |\n`;
md += `|---|---|---|---|---|---|---|\n`;

let totalChanges = 0;
for (const c of changes) {
    if (c.oldPrice !== c.newPrice || c.oldOriginalPrice !== c.newOriginalPrice || c.oldDiscountPercent !== c.newDiscountPercent) {
        md += `| ${c.name} | ₹${c.oldPrice} | **₹${c.newPrice}** | ${c.oldOriginalPrice ? `₹${c.oldOriginalPrice}` : '-'} | ${c.newOriginalPrice ? `**₹${c.newOriginalPrice}**` : '-'} | ${c.oldDiscountPercent ? `${c.oldDiscountPercent}%` : '-'} | ${c.newDiscountPercent ? `**${c.newDiscountPercent}%**` : '-'} |\n`;
        totalChanges++;
    }
}

if (totalChanges === 0) {
    md += `| No changes needed | | | | | | |\n`;
}

md += `\n**Total products to be updated:** ${totalChanges}\n\n`;
md += `## Verification Plan\n`;
md += `- Read the changes to verify they only affect the intended pricing fields.\n`;
md += `- Apply the changes using a Prisma update script.\n`;
md += `- Perform a diff before and after applying to ensure no unrelated fields (images, sizes, etc.) were modified.\n`;

// Write to the artifacts directory
const artifactsDir = process.env.APPDATA ? path.join(process.env.APPDATA, '..', 'Local', 'Temp') : '/tmp'; // Fallback
fs.writeFileSync('implementation_plan.md', md);
console.log('Done generating plan');

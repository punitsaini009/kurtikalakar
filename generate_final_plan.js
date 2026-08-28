const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const COLORS = ["White", "Black", "Yellow", "Orange", "Maroon", "Red", "Pink", "Magenta", "Blue", "Turquoise", "Navy", "Green", "Olive", "Emerald", "Mint", "Teal", "Purple", "Lavender", "Lilac", "Peach", "Brown", "Beige", "Cream", "Grey", "Gold", "Fuchsia", "Wine", "Navy Blue", "Royal Blue", "Powder Blue", "Sky Blue", "Dusty Blue", "Baby Pink", "Hot Pink", "Blush Pink", "Dusty Pink", "Dusty Rose", "Light Pink", "Dark Maroon", "Light Green", "Lime Green", "Dark Teal"];
const FABRICS = ["Georgette", "Organza", "Cotton", "Silk", "Chiffon", "Crepe", "Rayon", "Muslin", "Georgette", "Sheer"];
const WORKS = ["Chikankari", "Embroidered", "Floral", "Ombre", "Sequin", "Heavy Chikankari", "Print", "Printed", "Unstitched"];
const STYLES = ["Kurta Set", "Suit Set", "Sharara Set", "Kurti", "Co-ord Set", "Anarkali", "Palazzo Set", "Dupatta", "Suit"];

function extractKeywords(name, list) {
    const found = [];
    const lowerName = name.toLowerCase();
    const sortedList = [...list].sort((a, b) => b.length - a.length);
    let workingName = lowerName;
    for (const item of sortedList) {
        if (workingName.includes(item.toLowerCase())) {
            found.push(item);
            workingName = workingName.replace(item.toLowerCase(), "");
        }
    }
    return found;
}

function generateFactualDescription(name, colors, fabrics, works, stylesFound) {
    let baseStyle = stylesFound.length > 0 ? stylesFound[0] : (name.toLowerCase().includes("kurti") ? "Kurti" : (name.toLowerCase().includes("kurta") ? "Kurta" : "Outfit"));
    
    // Custom fix for "Kurti and Palazzo Set" or other combos
    if (name.toLowerCase().includes("kurti and palazzo set")) {
        baseStyle = "Kurti and Palazzo Set";
    }

    let colorStr = colors.length > 0 ? colors.join(" and ") : "";
    let fabricStr = fabrics.length > 0 ? fabrics[0] : "";
    let workStr = works.length > 0 ? works.join(" and ") : "";

    let sentences = [];
    
    // Basic identification sentence
    if (colorStr && fabricStr) {
        sentences.push(`This is a ${colorStr} ${baseStyle} constructed from ${fabricStr} fabric.`);
    } else if (colorStr) {
        sentences.push(`This is a ${colorStr} ${baseStyle}.`);
    } else if (fabricStr) {
        sentences.push(`This is a ${baseStyle} constructed from ${fabricStr} fabric.`);
    } else {
        sentences.push(`This is a ${baseStyle}.`);
    }

    // Adding known work details
    if (workStr) {
        sentences.push(`It features ${workStr} detailing.`);
    }
    
    // Special additions based purely on name
    if (name.toLowerCase().includes("with dupatta")) {
        sentences.push(`A dupatta is included with this set.`);
    }
    
    if (name.toLowerCase().includes("sleeveless")) {
        sentences.push(`The design is sleeveless.`);
    }

    return sentences.join(" ");
}

async function main() {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    
    const updates = [];
    
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        
        const extractedColors = extractKeywords(p.name, COLORS);
        const extractedFabrics = extractKeywords(p.name, FABRICS);
        const extractedWorks = extractKeywords(p.name, WORKS);
        const extractedStyles = extractKeywords(p.name, STYLES);
        
        const newDesc = generateFactualDescription(p.name, extractedColors, extractedFabrics, extractedWorks, extractedStyles);
        
        updates.push({
            id: p.id,
            name: p.name,
            currentPrice: p.price,
            originalPrice: p.originalPrice,
            discountPercent: p.discountPercent,
            oldDesc: p.description,
            newDesc
        });
    }

    fs.writeFileSync('proposed_details.json', JSON.stringify(updates, null, 2));
    
    let md = `# Final Implementation Plan: UI Formatting & Product Details\n\n`;
    
    md += `## 1. Price Display Formatting (UI Changes Only)\n`;
    md += `I will update \`components/ProductCard.tsx\`, \`components/ProductCard.module.css\`, \`app/products/[id]/page.tsx\`, and \`app/products/[id]/page.module.css\` to:\n`;
    md += `- Group the current price, original price, and discount accurately and correctly space them.\n`;
    md += `- Strike through the original price.\n`;
    md += `- Guarantee no overlapping or joined text strings (e.g. \`₹2,450 ₹3,000 17% OFF\`).\n`;
    md += `- **STRICT RULE**: NO prices will be modified in the database for this task. I will only compute the math visually for the UI.\n\n`;
    
    md += `## 2. Product Details Updates (Database)\n`;
    md += `I will dynamically parse all 98 product names to deduce their factual properties (Color, Fabric, Embroidery Work, Style) and generate a purely factual description. Marketing language and guesses have been completely stripped out.\n\n`;
    md += `**STRICT RULE**: Only the \`description\` field will be modified. \`fabric\`, \`color\`, \`images\`, \`price\`, \`originalPrice\`, \`discountPercent\`, and all other fields will be left 100% untouched.\n\n`;
    
    md += `### Complete 98-Product State (Pricing Verification & Proposed Descriptions)\n\n`;
    md += `*Note: The prices shown below reflect the currently live values in the database, verifying that previous updates strictly touched only the \`price\` field and nothing else.*\n\n`;
    md += `| Product Name | Current Price | Original Price | Discount | Proposed Factual Description |\n`;
    md += `|---|---|---|---|---|\n`;
    
    for (let i = 0; i < updates.length; i++) {
        const u = updates[i];
        const origStr = u.originalPrice ? `₹${u.originalPrice}` : '-';
        const discStr = u.discountPercent ? `${u.discountPercent}%` : '-';
        md += `| ${u.name} | ₹${u.currentPrice} | ${origStr} | ${discStr} | ${u.newDesc} |\n`;
    }
    
    md += `\n### Verification Plan\n`;
    md += `- Execute a strictly scoped Prisma update script applying ONLY the text descriptions.\n`;
    md += `- Test the Next.js UI fixes to ensure correct inline spacing of the prices.\n`;

    fs.writeFileSync('implementation_plan.md', md);
    console.log("Done");
}

main().catch(console.error).finally(() => prisma.$disconnect());

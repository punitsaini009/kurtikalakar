const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const nameMapping = {
  "/uploads/product_036.jpg": "Pink Sleeveless Kurti",
  "/uploads/product_043.jpg": "Navy Blue Chikankari Kurti",
  "/uploads/product_044.jpg": "Olive Green Chikankari Kurti",
  "/uploads/product_045.jpg": "Dusty Pink Folded Kurti",
  "/uploads/product_046.jpg": "Wine Red Chikankari Kurti",
  "/uploads/product_047.jpg": "Maroon Chikankari Kurti",
  "/uploads/product_048.jpg": "Yellow Floral Print Kurti Set",
  "/uploads/product_049.jpg": "Purple Chikankari Kurti",
  "/uploads/product_051.jpg": "Light Pink Chikankari Kurti",
  "/uploads/product_052.jpg": "Light Blue Chikankari Kurti",
  "/uploads/product_053.jpg": "Yellow Folded Kurti",
  "/uploads/product_054.jpg": "Dusty Rose Chikankari Kurti",
  "/uploads/product_055.jpg": "White Chikankari Kurti",
  "/uploads/product_056.jpg": "Red Chikankari Kurti",
  "/uploads/product_057.jpg": "Dark Purple Sleeveless Kurti",
  "/uploads/product_058.jpg": "Light Green Chikankari Kurti",
  "/uploads/product_059.jpg": "Lemon Yellow Chikankari Kurti",
  "/uploads/product_060.jpg": "QR Code Image",
  "/uploads/product_061.jpg": "Peach Sheer Dupatta",
  "/uploads/product_035.jpg": "Light Pink Sleeveless Kurti Set",
  "/uploads/product_037.jpg": "Dark Brown Sleeveless Kurti",
  "/uploads/product_038.jpg": "Lime Green Chikankari Kurti",
  "/uploads/product_039.jpg": "Royal Blue Sleeveless Kurti",
  "/uploads/product_040.jpg": "Mauve Chikankari Kurti",
  "/uploads/product_041.jpg": "Dark Maroon Sleeveless Kurti",
  "/uploads/product_050.jpg": "Royal Blue Chikankari Kurti",
  "/uploads/product_064.png": "Beige Sheer Kurti Set",
  "/uploads/product_065.png": "Bright Yellow Chikankari Kurti",
  "/uploads/product_066.png": "Light Pink Kurti Set with Dupatta",
  "/uploads/product_067.png": "Lavender Kurti Set",
  "/uploads/product_068.png": "Beige Kurti and Palazzo Set",
  "/uploads/product_069.png": "Lilac Kurti Set",
  "/uploads/product_070.png": "Deep Purple Kurti Set",
  "/uploads/product_071.png": "Dusty Rose Kurti Set with Dupatta",
  "/uploads/product_072.png": "Magenta Kurti Set with Dupatta",
  "/uploads/product_073.png": "Yellow Chikankari Kurti Fabric",
  "/uploads/product_074.png": "Lavender Kurti Set with Dupatta",
  "/uploads/product_075.png": "White Kurti Set with Dupatta",
  "/uploads/product_076.png": "Pink Chikankari Dupatta",
  "/uploads/product_077.png": "Mint Green Kurti Set",
  "/uploads/product_078.png": "White and Purple Floral Unstitched Suit",
  "/uploads/product_079.png": "Brown Ombre Kurti Set",
  "/uploads/product_080.png": "White Floral Embroidered Kurti Set",
  "/uploads/product_081.png": "Multicolor Floral Co-ord Set",
  "/uploads/product_082.png": "Light Green Kurti Set",
  "/uploads/product_083.png": "White and Yellow Floral Unstitched Suit",
  "/uploads/product_084.png": "Olive Green Kurti Set",
  "/uploads/product_085.jpg": "Black Kurti Set",
  "/uploads/product_086.jpg": "White Long Anarkali Set",
  "/uploads/product_087.jpg": "Teal Green Kurti Set",
  "/uploads/product_088.jpg": "Pink Floral Kurti Set with Organza Dupatta",
  "/uploads/product_089.jpg": "Maroon Suit Set with Sequin Dupatta",
  "/uploads/product_090.jpg": "Yellow and White Floral Print Suit Set",
  "/uploads/product_091.jpg": "Hot Pink Chikankari Suit Set",
  "/uploads/product_092.jpg": "Black Kurti with Red Floral Embroidery",
  "/uploads/product_093.jpg": "Dark Teal Kurti Set",
  "/uploads/product_094.jpg": "Cream Suit Set with Yellow Dupatta",
  "/uploads/product_095.jpg": "Beige Anarkali Suit Set with Maroon Dupatta",
  "/uploads/product_096.jpg": "Olive Green Chikankari Kurti Set",
  "/uploads/product_097.jpg": "White Chikankari Kurti and Palazzo Set",
  "/uploads/product_098.jpg": "Olive Green Embroidered Co-ord Set",
  "/uploads/product_063.png": "Light Blue Kurti Set with Dupatta",
  "/uploads/product_062.png": "Lavender Kurti Set with Dupatta"
};

async function main() {
  const products = await prisma.product.findMany({
    where: { 
      name: { 
        in: ['NAME_REQUIRED', 'product_001', 'Elegant Floral', 'Premium Collection', 'Product 001', 'New Arrival 001'] 
      } 
    }
  });

  let count = 0;
  for (const product of products) {
    try {
      const imagesArr = JSON.parse(product.images);
      const mainImage = imagesArr[0];
      if (mainImage && nameMapping[mainImage]) {
        await prisma.product.update({
          where: { id: product.id },
          data: { name: nameMapping[mainImage] }
        });
        count++;
        console.log(`Updated ${mainImage} -> ${nameMapping[mainImage]}`);
      }
    } catch (e) {
      console.error(`Error parsing image for product ${product.id}`, e);
    }
  }
  console.log(`Successfully updated ${count} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

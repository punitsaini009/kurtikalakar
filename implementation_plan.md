# Final Implementation Plan: UI Formatting & Product Details

## 1. Price Display Formatting (UI Changes Only)
I will update `components/ProductCard.tsx`, `components/ProductCard.module.css`, `app/products/[id]/page.tsx`, and `app/products/[id]/page.module.css` to:
- Group the current price, original price, and discount accurately and correctly space them.
- Strike through the original price.
- Guarantee no overlapping or joined text strings (e.g. `₹2,450 ₹3,000 17% OFF`).
- **STRICT RULE**: NO prices will be modified in the database for this task. I will only compute the math visually for the UI.

## 2. Product Details Updates (Database)
I will dynamically parse all 98 product names to deduce their factual properties (Color, Fabric, Embroidery Work, Style) and generate a purely factual description. Marketing language and guesses have been completely stripped out.

**STRICT RULE**: Only the `description` field will be modified. `fabric`, `color`, `images`, `price`, `originalPrice`, `discountPercent`, and all other fields will be left 100% untouched.

### Complete 98-Product State (Pricing Verification & Proposed Descriptions)

*Note: The prices shown below reflect the currently live values in the database, verifying that previous updates strictly touched only the `price` field and nothing else.*

| Product Name | Current Price | Original Price | Discount | Proposed Factual Description |
|---|---|---|---|---|
| Baby Pink Chikankari Suit Set | ₹1650 | - | - | This is a Baby Pink Suit Set. It features Chikankari detailing. |
| Beige Anarkali Suit Set with Maroon Dupatta | ₹1500 | ₹1700 | 29% | This is a Maroon and Beige Suit Set. |
| Beige Kurti and Palazzo Set | ₹2250 | ₹3000 | 17% | This is a Beige Kurti and Palazzo Set. |
| Beige Sheer Kurti Set | ₹2200 | ₹3000 | 17% | This is a Beige Kurti constructed from Sheer fabric. |
| Black Embroidered Georgette Suit Set | ₹1600 | - | - | This is a Black and Red Suit Set constructed from Georgette fabric. It features Embroidered detailing. |
| Black Heavy Chikankari Suit Set | ₹1650 | - | - | This is a Black Suit Set. It features Heavy Chikankari detailing. |
| Black Kurti Set | ₹1450 | ₹2000 | 25% | This is a Black Kurti. |
| Black Kurti with Red Floral Embroidery | ₹2350 | ₹3000 | 17% | This is a Black and Red Kurti. It features Floral detailing. |
| Black & White Chikankari Kurta Set | ₹1800 | - | - | This is a White and Black Kurta Set. It features Chikankari detailing. |
| Blue Ombre Chikankari Suit Set | ₹1500 | - | - | This is a Blue Suit Set. It features Chikankari and Ombre detailing. |
| Blush Pink Chikankari Kurta Set | ₹1800 | - | - | This is a Blush Pink Kurta Set. It features Chikankari detailing. |
| Bright Yellow Chikankari Kurti | ₹1750 | ₹2000 | 25% | This is a Yellow Kurti. It features Chikankari detailing. |
| Brown Ombre Kurti Set | ₹1250 | ₹1700 | 29% | This is a Brown Kurti. It features Ombre detailing. |
| Cream Suit Set with Yellow Dupatta | ₹2250 | ₹2300 | 22% | This is a Yellow and Cream Suit Set. |
| Dark Brown Sleeveless Kurti | ₹1400 | ₹2000 | 25% | This is a Brown Kurti. The design is sleeveless. |
| Dark Maroon Sleeveless Kurti | ₹1600 | ₹2000 | 25% | This is a Dark Maroon Kurti. The design is sleeveless. |
| Dark Purple Sleeveless Kurti | ₹1300 | ₹2000 | 25% | This is a Purple Kurti. The design is sleeveless. |
| Dark Teal Kurti Set | ₹1550 | ₹2000 | 25% | This is a Dark Teal Kurti. |
| Deep Purple Kurti Set | ₹2250 | ₹2300 | 22% | This is a Purple Kurti. |
| Dusty Blue Chikankari Kurta Set | ₹1350 | - | - | This is a Dusty Blue Kurta Set. It features Chikankari detailing. |
| Dusty Pink Folded Kurti | ₹1400 | ₹2000 | 25% | This is a Dusty Pink Kurti. |
| Dusty Rose Chikankari Kurti | ₹1900 | ₹2300 | 22% | This is a Dusty Rose Kurti. It features Chikankari detailing. |
| Dusty Rose Kurti Set with Dupatta | ₹1250 | ₹1700 | 29% | This is a Dusty Rose Dupatta. A dupatta is included with this set. |
| Emerald Green Chikankari Suit Set | ₹1300 | - | - | This is a Emerald and Green Suit Set. It features Chikankari detailing. |
| Fuchsia Pink Chikankari Suit Set | ₹1200 | - | - | This is a Fuchsia and Pink Suit Set. It features Chikankari detailing. |
| Hot Pink Chikankari Kurti | ₹1550 | ₹2300 | 22% | This is a Hot Pink Kurti. It features Chikankari detailing. |
| Hot Pink Chikankari Suit Set | ₹1400 | ₹1700 | 29% | This is a Hot Pink Suit Set. It features Chikankari detailing. |
| Lavender Chikankari Kurta Set | ₹1350 | - | - | This is a Lavender Kurta Set. It features Chikankari detailing. |
| Lavender Kurti Set | ₹1250 | ₹1700 | 29% | This is a Lavender Kurti. |
| Lavender Kurti Set with Dupatta | ₹2100 | ₹2300 | 22% | This is a Lavender Dupatta. A dupatta is included with this set. |
| Lavender Kurti Set with Dupatta | ₹1900 | ₹2300 | 22% | This is a Lavender Dupatta. A dupatta is included with this set. |
| Lemon Yellow Chikankari Kurti | ₹1250 | ₹1700 | 29% | This is a Yellow Kurti. It features Chikankari detailing. |
| Light Blue Chikankari Kurti | ₹2450 | ₹3000 | 17% | This is a Blue Kurti. It features Chikankari detailing. |
| Light Blue Kurti Set with Dupatta | ₹1450 | ₹1700 | 29% | This is a Blue Dupatta. A dupatta is included with this set. |
| Light Green Chikankari Kurti | ₹1550 | ₹2300 | 22% | This is a Light Green Kurti. It features Chikankari detailing. |
| Light Green Kurti Set | ₹1600 | ₹2300 | 22% | This is a Light Green Kurti. |
| Light Pink Chikankari Kurti | ₹1200 | ₹1700 | 29% | This is a Light Pink Kurti. It features Chikankari detailing. |
| Light Pink Kurti Set with Dupatta | ₹1700 | ₹2300 | 22% | This is a Light Pink Dupatta. A dupatta is included with this set. |
| Light Pink Sleeveless Kurti Set | ₹1200 | ₹1700 | 29% | This is a Light Pink Kurti. The design is sleeveless. |
| Lilac Kurti Set | ₹1250 | ₹2000 | 25% | This is a Lilac Kurti. |
| Lilac Pink Chikankari Kurta Set | ₹1350 | - | - | This is a Lilac and Pink Kurta Set. It features Chikankari detailing. |
| Lime Green Chikankari Kurti | ₹1450 | ₹2300 | 22% | This is a Lime Green Kurti. It features Chikankari detailing. |
| Magenta Chikankari Sharara Set | ₹1450 | - | - | This is a Magenta Sharara Set. It features Chikankari detailing. |
| Magenta Chikankari Sharara Set | ₹1800 | - | - | This is a Magenta Sharara Set. It features Chikankari detailing. |
| Magenta Heavy Chikankari Sharara Set | ₹2000 | - | - | This is a Magenta Sharara Set. It features Heavy Chikankari detailing. |
| Magenta Kurti Set with Dupatta | ₹2500 | ₹3000 | 17% | This is a Magenta Dupatta. A dupatta is included with this set. |
| Maroon Chikankari Kurti | ₹1200 | ₹1700 | 29% | This is a Maroon Kurti. It features Chikankari detailing. |
| Maroon Heavy Chikankari Sharara Set | ₹1500 | - | - | This is a Maroon Sharara Set. It features Heavy Chikankari detailing. |
| Maroon Suit Set with Sequin Dupatta | ₹1850 | ₹2000 | 25% | This is a Maroon Suit Set. It features Sequin detailing. |
| Mauve Chikankari Kurti | ₹2000 | ₹3000 | 17% | This is a Kurti. It features Chikankari detailing. |
| Mint Green Kurti Set | ₹1800 | ₹2000 | 25% | This is a Green and Mint Kurti. |
| Multicolor Floral Co-ord Set | ₹1400 | ₹2000 | 25% | This is a Co-ord Set. It features Floral detailing. |
| Navy Blue Chikankari Kurti | ₹1400 | ₹1700 | 29% | This is a Navy Blue Kurti. It features Chikankari detailing. |
| Olive Green Chikankari Kurti | ₹3000 | ₹3000 | 17% | This is a Green and Olive Kurti. It features Chikankari detailing. |
| Olive Green Chikankari Kurti Set | ₹2250 | ₹3000 | 17% | This is a Green and Olive Kurti. It features Chikankari detailing. |
| Olive Green Chikankari Suit Set | ₹1350 | - | - | This is a Green and Olive Suit Set. It features Chikankari detailing. |
| Olive Green Embroidered Co-ord Set | ₹1450 | ₹2300 | 22% | This is a Green and Olive and Red Co-ord Set. It features Embroidered detailing. |
| Olive Green Kurti Set | ₹2400 | ₹3000 | 17% | This is a Green and Olive Kurti. |
| Orange Chikankari Kurta Set | ₹1950 | - | - | This is a Orange Kurta Set. It features Chikankari detailing. |
| Peach Ombre Chikankari Kurta | ₹1500 | - | - | This is a Peach Kurta. It features Chikankari and Ombre detailing. |
| Peach Ombre Chikankari Sharara Set | ₹1450 | - | - | This is a Peach Sharara Set. It features Chikankari and Ombre detailing. |
| Peach Ombre Chikankari Sharara Set | ₹2000 | - | - | This is a Peach Sharara Set. It features Chikankari and Ombre detailing. |
| Peach Sheer Dupatta | ₹1700 | ₹2000 | 25% | This is a Peach Dupatta constructed from Sheer fabric. |
| Pink Chikankari Dupatta | ₹2100 | ₹3000 | 17% | This is a Pink Dupatta. It features Chikankari detailing. |
| Pink Floral Kurti Set with Organza Dupatta | ₹2300 | ₹3000 | 17% | This is a Pink Dupatta constructed from Organza fabric. It features Floral detailing. |
| Pink Sleeveless Kurti | ₹2700 | ₹3000 | 17% | This is a Pink Kurti. The design is sleeveless. |
| Powder Blue Chikankari Kurta Set | ₹2000 | - | - | This is a Powder Blue Kurta Set. It features Chikankari detailing. |
| Powder Blue Chikankari Suit Set | ₹2150 | - | - | This is a Powder Blue Suit Set. It features Chikankari detailing. |
| Purple Chikankari Kurti | ₹1800 | ₹2000 | 25% | This is a Purple Kurti. It features Chikankari detailing. |
| QR Code Image | ₹2350 | ₹3000 | 17% | This is a Outfit. |
| Red Chikankari Kurti | ₹2250 | ₹3000 | 17% | This is a Red Kurti. It features Chikankari detailing. |
| Royal Blue Chikankari Kurti | ₹2150 | ₹2300 | 22% | This is a Royal Blue Kurti. It features Chikankari detailing. |
| Royal Blue Sleeveless Kurti | ₹1200 | ₹1700 | 29% | This is a Royal Blue Kurti. The design is sleeveless. |
| Sky Blue Chikankari Kurta Set | ₹1400 | - | - | This is a Sky Blue Kurta Set. It features Chikankari detailing. |
| Teal Green Kurti Set | ₹1200 | ₹1700 | 29% | This is a Green and Teal Kurti. |
| Turquoise Blue Chikankari Kurta Set | ₹1300 | - | - | This is a Turquoise and Blue Kurta Set. It features Chikankari detailing. |
| White and Purple Floral Unstitched Suit | ₹1500 | ₹2300 | 22% | This is a Purple and White Suit. It features Unstitched and Floral detailing. |
| White and Yellow Floral Unstitched Suit | ₹1450 | ₹1700 | 29% | This is a Yellow and White Suit. It features Unstitched and Floral detailing. |
| White Chikankari Kurta Set | ₹2200 | - | - | This is a White Kurta Set. It features Chikankari detailing. |
| White Chikankari Kurti | ₹1250 | ₹1700 | 29% | This is a White Kurti. It features Chikankari detailing. |
| White Chikankari Kurti and Palazzo Set | ₹1450 | ₹2000 | 25% | This is a White Kurti and Palazzo Set. It features Chikankari detailing. |
| White Floral Embroidered Kurti Set | ₹2200 | ₹3000 | 17% | This is a White and Red Kurti. It features Embroidered and Floral detailing. |
| White Heavy Chikankari Kurta Set | ₹1450 | - | - | This is a White Kurta Set. It features Heavy Chikankari detailing. |
| White Kurti Set with Dupatta | ₹1300 | ₹1700 | 29% | This is a White Dupatta. A dupatta is included with this set. |
| White Long Anarkali Set | ₹1550 | ₹2300 | 22% | This is a White Anarkali. |
| White & Orange Floral Chikankari Kurta Set | ₹1300 | - | - | This is a Orange and White Kurta Set. It features Chikankari and Floral detailing. |
| White & Peach Floral Chikankari Kurta Set | ₹1750 | - | - | This is a White and Peach Kurta Set. It features Chikankari and Floral detailing. |
| White & Pink Floral Chikankari Kurta Set | ₹2150 | - | - | This is a White and Pink Kurta Set. It features Chikankari and Floral detailing. |
| White & Yellow Floral Chikankari Kurta Set | ₹1250 | - | - | This is a Yellow and White Kurta Set. It features Chikankari and Floral detailing. |
| White & Yellow Floral Chikankari Kurta Set | ₹1250 | - | - | This is a Yellow and White Kurta Set. It features Chikankari and Floral detailing. |
| Wine Red Chikankari Kurta Set | ₹1750 | - | - | This is a Wine and Red Kurta Set. It features Chikankari detailing. |
| Wine Red Chikankari Kurti | ₹1550 | ₹2300 | 22% | This is a Wine and Red Kurti. It features Chikankari detailing. |
| Yellow and White Floral Print Suit Set | ₹1600 | ₹2300 | 22% | This is a Yellow and White Suit Set. It features Floral and Print detailing. |
| Yellow Chikankari Kurta Set | ₹1200 | - | - | This is a Yellow Kurta Set. It features Chikankari detailing. |
| Yellow Chikankari Kurti Fabric | ₹1550 | ₹2000 | 25% | This is a Yellow Kurti. It features Chikankari detailing. |
| Yellow Floral Print Kurti Set | ₹2200 | ₹3000 | 17% | This is a Yellow Kurti. It features Floral and Print detailing. |
| Yellow Folded Kurti | ₹1800 | ₹2000 | 25% | This is a Yellow Kurti. |
| Yellow Ombre Chikankari Kurta | ₹1650 | - | - | This is a Yellow Kurta. It features Chikankari and Ombre detailing. |

### Verification Plan
- Execute a strictly scoped Prisma update script applying ONLY the text descriptions.
- Test the Next.js UI fixes to ensure correct inline spacing of the prices.

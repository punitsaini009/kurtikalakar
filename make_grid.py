import os
import math
# pyrefly: ignore [missing-import]
from PIL import Image, ImageDraw, ImageFont

images_list = [
  "product_036.jpg", "product_043.jpg", "product_044.jpg", "product_045.jpg", "product_046.jpg",
  "product_047.jpg", "product_048.jpg", "product_049.jpg", "product_051.jpg", "product_052.jpg",
  "product_053.jpg", "product_054.jpg", "product_055.jpg", "product_056.jpg", "product_057.jpg",
  "product_058.jpg", "product_059.jpg", "product_060.jpg", "product_061.jpg", "product_035.jpg",
  "product_037.jpg", "product_038.jpg", "product_039.jpg", "product_040.jpg", "product_041.jpg",
  "product_042.jpg", "product_050.jpg", "product_064.png", "product_065.png", "product_066.png",
  "product_067.png", "product_068.png", "product_069.png", "product_070.png", "product_071.png",
  "product_072.png", "product_073.png", "product_074.png", "product_075.png", "product_076.png",
  "product_077.png", "product_078.png", "product_079.png", "product_080.png", "product_081.png",
  "product_082.png", "product_083.png", "product_084.png", "product_085.jpg", "product_086.jpg",
  "product_087.jpg", "product_088.jpg", "product_089.jpg", "product_090.jpg", "product_091.jpg",
  "product_092.jpg", "product_093.jpg", "product_094.jpg", "product_095.jpg", "product_096.jpg",
  "product_097.jpg", "product_098.jpg", "product_063.png", "product_062.png"
]

base_dir = r"c:\Users\user\Desktop\AI PROJECT\public\uploads"

def create_grid(image_subset, grid_filename):
    thumb_w, thumb_h = 300, 400
    cols = 5
    rows = math.ceil(len(image_subset) / cols)
    
    grid = Image.new('RGB', (cols * thumb_w, rows * thumb_h), (255, 255, 255))
    draw = ImageDraw.Draw(grid)
    
    for idx, img_name in enumerate(image_subset):
        col = idx % cols
        row = idx // cols
        
        path = os.path.join(base_dir, img_name)
        if os.path.exists(path):
            try:
                img = Image.open(path)
                img.thumbnail((thumb_w, thumb_h - 30))
                
                # Center horizontally
                x_offset = col * thumb_w + (thumb_w - img.width) // 2
                y_offset = row * thumb_h + (thumb_h - 30 - img.height) // 2
                
                grid.paste(img, (x_offset, y_offset))
                
                # Draw text at bottom of cell
                text_x = col * thumb_w + 10
                text_y = row * thumb_h + thumb_h - 25
                draw.text((text_x, text_y), img_name, fill=(0, 0, 0))
            except Exception as e:
                print(f"Error processing {img_name}: {e}")
        else:
            print(f"Missing: {path}")
            
    grid.save(grid_filename)
    print(f"Saved {grid_filename}")

create_grid(images_list[0:25], "grid1.jpg")
create_grid(images_list[25:50], "grid2.jpg")
create_grid(images_list[50:], "grid3.jpg")

from PIL import Image
from collections import Counter

def get_dominant_colors(image_path, num_colors=5):
    try:
        image = Image.open(image_path)
        image = image.convert('RGB')
        image = image.resize((150, 150))      # Resize for faster processing
        
        pixels = list(image.getdata())
        counts = Counter(pixels)
        common = counts.most_common(num_colors)
        
        print(f"Dominant colors in {image_path}:")
        filtered_colors = []
        for color, count in counts.most_common(100):
            # Ignore near black and near white
            if sum(color) < 30 or sum(color) > 700:
                continue
            filtered_colors.append(color)
            if len(filtered_colors) >= 5:
                break
        
        if not filtered_colors:
            print("No non-grayscale colors found.")
            # Fallback to top colors
            filtered_colors = [c[0] for c in common]

        for color in filtered_colors:
            hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
            print(f"{hex_color} (RGB: {color})")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_dominant_colors("/Users/herrnyembo/nyembo_tech/public/assets/images/logo/logo-colors.png")

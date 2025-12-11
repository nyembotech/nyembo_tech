from PIL import Image
from collections import Counter

def get_dominant_colors(image_path, k=4):
    try:
        image = Image.open(image_path)
        image = image.convert("RGB")
        # Resize to speed up processing
        image = image.resize((100, 100))
        pixels = list(image.getdata())
        
        # Simple frequency count (not k-means, but good enough for distinct dots)
        counts = Counter(pixels)
        common = counts.most_common(10) # Get top 10 to filter out background
        
        hex_colors = []
        for color, count in common:
            hex_colors.append("#{:02x}{:02x}{:02x}".format(color[0], color[1], color[2]))
            
        return hex_colors
    except Exception as e:
        print(f"Error: {e}")
        return []

image_path = "/Users/herrnyembo/.gemini/antigravity/brain/145692c3-ca19-4ff3-802f-d573e2f65876/uploaded_image_1764499696244.png"
colors = get_dominant_colors(image_path)
print("Extracted Colors:", colors)

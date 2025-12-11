import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter

def get_dominant_colors(image_path, k=4):
    try:
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = image.reshape((image.shape[0] * image.shape[1], 3))
        
        clt = KMeans(n_clusters=k)
        clt.fit(image)
        
        counts = Counter(clt.labels_)
        center_colors = clt.cluster_centers_
        
        ordered_colors = [center_colors[i] for i in counts.keys()]
        hex_colors = [
            "#{:02x}{:02x}{:02x}".format(int(c[0]), int(c[1]), int(c[2])) 
            for c in ordered_colors
        ]
        return hex_colors
    except Exception as e:
        print(f"Error: {e}")
        return []

image_path = "/Users/herrnyembo/.gemini/antigravity/brain/145692c3-ca19-4ff3-802f-d573e2f65876/uploaded_image_1764499696244.png"
colors = get_dominant_colors(image_path, k=5) # k=5 to capture the 4 dots + background
print("Extracted Colors:", colors)

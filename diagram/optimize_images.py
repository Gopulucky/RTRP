
import os
from PIL import Image

def optimize_images(directory):
    print("Optimization started...")
    for filename in os.listdir(directory):
        if filename.lower().endswith(".png"):
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    # Get dimensions
                    width, height = img.size
                    
                    # Convert to WebP
                    webp_filename = os.path.splitext(filename)[0] + ".webp"
                    webp_filepath = os.path.join(directory, webp_filename)
                    
                    img.save(webp_filepath, "WEBP", quality=80)
                    
                    # Calculate savings
                    original_size = os.path.getsize(filepath)
                    new_size = os.path.getsize(webp_filepath)
                    savings = original_size - new_size
                    
                    print(f"Processed: {filename}")
                    print(f"  Dimensions: width={width} height={height}")
                    print(f"  Size: {original_size/1024:.2f}KB -> {new_size/1024:.2f}KB (Saved {savings/1024:.2f}KB)")
                    print("-" * 40)
                    
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    optimize_images(".")

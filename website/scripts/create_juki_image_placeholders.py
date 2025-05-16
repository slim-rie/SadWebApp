import os
from PIL import Image, ImageDraw, ImageFont

# Directory for images
img_dir = os.path.join(os.path.dirname(__file__), '../static/pictures')
img_dir = os.path.abspath(img_dir)

# List of required Juki product image filenames
filenames = [
    'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine.jpg',
    'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine.jpg',
    'Juki W562-02BB – Piping Machine.jpg',
    'Juki LU-1508N – Walking Foot Lockstitch Machine.jpg',
    'Juki LK-1900S – Computer-Controlled Bartacking Machine.jpg',
]

for fname in filenames:
    path = os.path.join(img_dir, fname)
    if not os.path.exists(path):
        # Create a simple placeholder image
        img = Image.new('RGB', (400, 300), color=(200, 200, 200))
        d = ImageDraw.Draw(img)
        text = os.path.splitext(fname)[0][:30] + '...'
        d.text((10, 140), text, fill=(0, 0, 0))
        img.save(path)
        print(f'Created placeholder: {path}')
    else:
        print(f'Exists: {path}') 
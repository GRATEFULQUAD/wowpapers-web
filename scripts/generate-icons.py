#!/usr/bin/env python3
"""
Generates the neon WOW PAPERS PWA icon set into public/icons/.

Binary PNG files aren't committed directly to this repo (to avoid corruption
risk over certain commit paths) -- run this once after cloning to populate
public/icons/ before building/deploying.

Usage:
    pip install Pillow
    python scripts/generate-icons.py
"""

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "icons")


def make_icon(size, path, maskable=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # Dark navy gradient background
    bg = Image.new("RGBA", (size, size), (8, 6, 20, 255))
    bdraw = ImageDraw.Draw(bg)
    for y in range(size):
        t = y / size
        r = int(8 + (20 - 8) * t)
        g = int(6 + (10 - 6) * t)
        b = int(20 + (40 - 20) * t)
        bdraw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Rounded corners (skip rounding for maskable variant -- OS applies its own mask)
    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    radius = int(size * (0.22 if not maskable else 0))
    mdraw.rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
    bg.putalpha(mask)
    img = Image.alpha_composite(img, bg)

    # Cyan + magenta ambient glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    cx, cy = size * 0.5, size * 0.5
    r1 = size * 0.34
    gdraw.ellipse([cx - r1, cy - r1 * 0.6 - size * 0.05, cx + r1 * 0.2, cy + r1 * 0.6 - size * 0.05], fill=(0, 229, 255, 140))
    gdraw.ellipse([cx - r1 * 0.2, cy - r1 * 0.6 + size * 0.08, cx + r1, cy + r1 * 0.6 + size * 0.08], fill=(255, 0, 200, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.06))
    img = Image.alpha_composite(img, glow)

    # "W" mark with a soft neon stroke
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.46))
    except Exception:
        font = ImageFont.load_default()
    text = "W"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx, ty = (size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]
    for _ in range(int(size * 0.02) // 2 or 1):
        draw.text((tx, ty), text, font=font, fill=(0, 229, 255, 40))
    draw.text((tx, ty), text, font=font, fill=(240, 250, 255, 255))

    img.convert("RGBA").save(path, "PNG")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    make_icon(192, os.path.join(OUT_DIR, "icon-192.png"))
    make_icon(512, os.path.join(OUT_DIR, "icon-512.png"))
    make_icon(512, os.path.join(OUT_DIR, "maskable-512.png"), maskable=True)
    make_icon(180, os.path.join(OUT_DIR, "apple-touch-icon.png"))
    print("Icons written to", OUT_DIR)


if __name__ == "__main__":
    main()

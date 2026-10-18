"""Build labeled technical contact sheets without changing source captures."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("docs/screenshots/recovery")
OUTPUT = ROOT / "comparisons"
OUTPUT.mkdir(parents=True, exist_ok=True)
font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
font = ImageFont.truetype(str(font_path), 17) if font_path.exists() else ImageFont.load_default()
small_font = ImageFont.truetype(str(font_path), 13) if font_path.exists() else ImageFont.load_default()
files = []

for width in [360, 390, 768, 1280, 1440]:
    for view in ["fold", "full"]:
        name = f"home-fold-{width}.jpg" if view == "fold" else f"home-{width}.jpg"
        source_paths = [ROOT / phase / name for phase in ["before", "after"]]
        images = [Image.open(path).convert("RGB") for path in source_paths]
        panel_width = min(width, 560)
        resized = [image.resize((panel_width, round(image.height * panel_width / image.width)), Image.Resampling.LANCZOS) for image in images]
        padding, gap, heading = 18, 18, 78
        sheet = Image.new("RGB", (panel_width * 2 + padding * 2 + gap, max(image.height for image in resized) + heading + padding), "#17151a")
        draw = ImageDraw.Draw(sheet)
        for index, (image, phase) in enumerate(zip(resized, ["before", "after"])):
            x = padding + index * (panel_width + gap)
            draw.text((x, 15), "Evidence-first foundation" if phase == "before" else "Recovery follow-up", font=font, fill="#f2ede6")
            draw.text((x, 42), f"{width}px viewport · {view} · fresh production", font=small_font, fill="#bcb3bd")
            sheet.paste(image, (x, heading))
        target = OUTPUT / f"home-{width}-{view}.jpg"
        sheet.save(target, quality=88, optimize=True)
        files.append({"file": target.name, "sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "sources": [str(path) for path in source_paths]})

(OUTPUT / "manifest.json").write_text(json.dumps({"methodology": "Labeled side-by-side technical contact sheets of unaltered before/after production captures. Equal visual scale within each pair; full-page captures retain natural proportional height. Padding added below the shorter page. No source screenshot modified.", "files": files}, indent=2) + "\n")
print(f"Saved {len(files)} first-fold/full-page comparison sheets in {OUTPUT}")

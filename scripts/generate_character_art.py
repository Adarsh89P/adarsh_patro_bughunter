#!/usr/bin/env python3
"""
Generate the illustrated pose art for the Bug Hunter portfolio.

The site cross-fades between poses rather than rigging limbs, so the whole set
has to look like one character drawn repeatedly: same face, same outfit, same
scale, same baseline. Two things enforce that here:

  1. A shared STYLE block is prepended to every prompt.
  2. Pose-to-pose chaining - the first accepted image (the anchor) is passed
     back to the model as a reference for every later pose, so the model is
     restyling a character it can see rather than inventing one from words.

Usage:
    export GEMINI_API_KEY=...            # required
    python scripts/generate_character_art.py                  # everything
    python scripts/generate_character_art.py --only run shoot # redo two poses
    python scripts/generate_character_art.py --pro            # higher-fidelity model

Output lands in public/art/{character,bug,boss}/<pose>.png. When the set looks
right, flip CHARACTER_ART_READY (or BUG_ART_READY) to true in lib/characterArt.ts.
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    sys.exit("Missing dependency. Install it with: pip install google-genai")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
FLASH = "gemini-2.5-flash-image"
PRO = "gemini-3-pro-image-preview"

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "art"

# The character bible. Every prompt inherits this, so drift between poses comes
# down to the pose sentence alone.
STYLE = (
    "3D-rendered cartoon character illustration, Pixar-like stylised proportions with a "
    "slightly oversized head, soft global illumination, gentle rim light, smooth matte "
    "surfaces, subtle depth of field. Full body, head to feet, entire figure inside the "
    "frame with generous margin. Centred. Feet resting on the exact horizontal centre-"
    "bottom of the canvas. Fully transparent background, no ground, no shadow on the "
    "ground, no scenery, no text, no logos, no border, no frame."
)

CHARACTER = (
    "A friendly young South Asian man in his mid-twenties, short tousled black hair, "
    "warm light-brown skin, large expressive dark eyes, small confident smile. He wears a "
    "fitted charcoal-black archer tunic with a dark leather belt and a diagonal chest "
    "strap, black trousers and dark boots. He carries a wooden recurve bow and a quiver of "
    "arrows with purple fletching on his back. Accent colour is vivid purple (#7C3AED)."
)

BUG = (
    "A cartoon software-bug monster: a round dark-purple beetle-like creature with a "
    "glossy carapace, six thin springy legs, two big googly cartoon eyes, a wide toothy "
    "grin, and small antennae. Mischievous rather than frightening. Accent colour vivid "
    "purple (#7C3AED)."
)

BOSS = (
    "A large cartoon boss monster version of a software bug: a hulking dark-purple armoured "
    "beetle creature with jagged spikes along its shell, glowing red eyes, heavy clawed "
    "legs, and a small golden crown perched on its head. Imposing but still cartoonish. "
    "Accent colour vivid purple (#7C3AED)."
)

# pose key -> the sentence describing that beat
CHARACTER_POSES = {
    "idle": "Standing relaxed and upright, facing the viewer, bow held loosely at his side, calm confident expression.",
    "wave": "Standing facing the viewer, waving hello with his right hand raised beside his head, bright welcoming smile.",
    "look": "Standing, turning his head to look off to his left, curious raised eyebrow, bow lowered.",
    "alert": "Standing alert and startled, eyes wide, eyebrows raised, body leaning back slightly, gripping the bow with both hands.",
    "run": "Running hard to his left in profile, mid-stride with both feet off the ground, bow in one hand, hair and clothing swept back by the motion, determined expression.",
    "stop": "Skidding to a sudden stop in profile, leaning back, one foot planted forward, arms out for balance.",
    "aim": "Standing in profile, side-on archery stance, bow raised and arrow nocked, string not yet drawn, eyes narrowed and focused down the arrow.",
    "pull": "Standing in profile, side-on archery stance, bow raised with the string drawn fully back to his cheek, arms taut, intensely focused.",
    "shoot": "Standing in profile at the instant of release, bowstring snapping forward, drawing hand flung open behind his ear, body recoiling slightly, triumphant expression.",
    "celebrate": "Standing facing the viewer, cheering with the bow raised overhead in one fist, other arm punching the air, wide joyful grin.",
}

BUG_POSES = {
    "crawl": "Scuttling along on all six legs, viewed from the side, casual expression.",
    "taunt": "Hovering upright, leaning back and sticking its tongue out, taunting and cocky.",
    "flee": "Fleeing at speed in profile, legs blurred with motion, panicked wide eyes looking back over its shell.",
    "panic": "Cowering and shaking, legs braced, eyes enormous with terror, sweat droplets flying off it.",
    "hit": "Struck and defeated, tumbling backwards with X-shaped cartoon eyes, legs splayed, small impact sparks around it.",
}

BOSS_POSES = {
    "idle": "Standing four-square and menacing, facing the viewer, eyes glowing steadily.",
    "alert": "Rearing up and roaring, front legs raised, eyes blazing brighter, spikes flared.",
}

TARGETS = [
    ("character", CHARACTER, CHARACTER_POSES),
    ("bug", BUG, BUG_POSES),
    ("boss", BOSS, BOSS_POSES),
]


def extract_image(response):
    """Pull the first inline image out of a Gemini response, or None."""
    candidates = getattr(response, "candidates", None)
    if not candidates:
        return None
    for part in candidates[0].content.parts:
        inline = getattr(part, "inline_data", None)
        if inline and inline.mime_type.startswith("image/"):
            return inline.data
    return None


def generate(client, model, prompt, anchor):
    """One image. anchor is prior art passed back in for visual consistency."""
    if anchor:
        contents = [
            types.Part.from_bytes(data=anchor, mime_type="image/png"),
            "Redraw the exact same character shown in the reference image - identical face, "
            "hair, outfit, colours, proportions and art style - in a new pose. " + prompt,
        ]
    else:
        contents = [prompt]

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            image_config=types.ImageConfig(aspect_ratio="1:1"),
        ),
    )
    return extract_image(response)


def main():
    parser = argparse.ArgumentParser(description="Generate Bug Hunter pose art")
    parser.add_argument("--only", nargs="*", help="Regenerate just these pose names")
    parser.add_argument("--pro", action="store_true", help="Use the higher-fidelity Pro model")
    parser.add_argument("--force", action="store_true", help="Overwrite poses that already exist")
    args = parser.parse_args()

    if not GEMINI_API_KEY:
        sys.exit("GEMINI_API_KEY is not set. Export it and re-run.")

    client = genai.Client(api_key=GEMINI_API_KEY)
    model = PRO if args.pro else FLASH
    only = set(args.only) if args.only else None

    for kind, subject, poses in TARGETS:
        out_dir = ART / kind
        out_dir.mkdir(parents=True, exist_ok=True)

        # The anchor is this subject's own first pose, so each of the three
        # subjects stays internally consistent across its own set.
        anchor = None
        anchor_path = out_dir / (next(iter(poses)) + ".png")
        if anchor_path.exists():
            anchor = anchor_path.read_bytes()

        for pose, description in poses.items():
            if only and pose not in only:
                continue
            path = out_dir / (pose + ".png")
            if path.exists() and not args.force and not only:
                print("  skip " + kind + "/" + pose + " (exists)")
                if anchor is None:
                    anchor = path.read_bytes()
                continue

            prompt = subject + " " + description + " " + STYLE
            print("  generating " + kind + "/" + pose + " ...")
            data = generate(client, model, prompt, anchor)
            if not data:
                print("  !! " + kind + "/" + pose + " produced no image; re-run with --only " + pose)
                continue

            path.write_bytes(data)
            print("  wrote " + str(path.relative_to(ROOT)))
            if anchor is None:
                anchor = data

    print("")
    print("Done. Review the set, then set CHARACTER_ART_READY = true in lib/characterArt.ts")


if __name__ == "__main__":
    main()

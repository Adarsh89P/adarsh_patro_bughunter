# Bug Hunter — pose art prompt pack

Paste these into whatever image tool made the storyboard (Gemini / ChatGPT / Midjourney).
One prompt per file. Save the results into the paths given below, then flip
`ART_READY` to `true` in `lib/characterArt.ts`.

## Rules that matter

The site cross-fades between poses instead of rigging limbs, so the set has to
look like one character photographed repeatedly:

1. **Generate `idle` first.** Then attach that image to every later prompt and say
   *"same character as the reference image, new pose."* Without this the face and
   outfit drift between poses and the cross-fade reads as a different person.
2. **Same baseline and scale in every file.** Feet at the same height, figure the
   same fraction of the canvas. Otherwise the character visibly jumps between beats.
3. **Square canvas, 1024×1024, transparent background.** No ground, no cast shadow,
   no scenery, no text, no UI.

## Style block — prepend to every prompt

> 3D-rendered cartoon character illustration, Pixar-like stylised proportions with a
> slightly oversized head, soft global illumination, gentle rim light, smooth matte
> surfaces, subtle depth of field. Full body, head to feet, entire figure inside the
> frame with generous margin. Centred. Feet resting on the exact horizontal
> centre-bottom of the canvas. Fully transparent background, no ground, no shadow on
> the ground, no scenery, no text, no logos, no border, no frame.

## Character — subject block

> A friendly young South Asian man in his mid-twenties, short tousled black hair,
> warm light-brown skin, large expressive dark eyes, small confident smile. He wears
> a fitted charcoal-black archer tunic with a dark leather belt and a diagonal chest
> strap, black trousers and dark boots. He carries a wooden recurve bow and a quiver
> of arrows with purple fletching on his back. Accent colour is vivid purple (#7C3AED).

Save to `public/art/character/<name>.png`:

| File | Pose sentence |
| --- | --- |
| `idle.png` | Standing relaxed and upright, facing the viewer, bow held loosely at his side, calm confident expression. |
| `wave.png` | Standing facing the viewer, waving hello with his right hand raised beside his head, bright welcoming smile. |
| `look.png` | Standing, turning his head to look off to his left, curious raised eyebrow, bow lowered. |
| `alert.png` | Standing alert and startled, eyes wide, eyebrows raised, body leaning back slightly, gripping the bow with both hands. |
| `run.png` | Running hard to his left in profile, mid-stride with both feet off the ground, bow in one hand, hair and clothing swept back by the motion, determined expression. |
| `stop.png` | Skidding to a sudden stop in profile, leaning back, one foot planted forward, arms out for balance. |
| `aim.png` | Standing in profile, side-on archery stance, bow raised and arrow nocked, string not yet drawn, eyes narrowed and focused down the arrow. |
| `pull.png` | Standing in profile, side-on archery stance, bow raised with the string drawn fully back to his cheek, arms taut, intensely focused. |
| `shoot.png` | Standing in profile at the instant of release, bowstring snapping forward, drawing hand flung open behind his ear, body recoiling slightly, triumphant expression. |
| `celebrate.png` | Standing facing the viewer, cheering with the bow raised overhead in one fist, other arm punching the air, wide joyful grin. |

## Bug — subject block

> A cartoon software-bug monster: a round dark-purple beetle-like creature with a
> glossy carapace, six thin springy legs, two big googly cartoon eyes, a wide toothy
> grin, and small antennae. Mischievous rather than frightening. Accent colour vivid
> purple (#7C3AED).

Save to `public/art/bug/<name>.png`:

| File | Pose sentence |
| --- | --- |
| `crawl.png` | Scuttling along on all six legs, viewed from the side, casual expression. |
| `taunt.png` | Hovering upright, leaning back and sticking its tongue out, taunting and cocky. |
| `flee.png` | Fleeing at speed in profile, legs blurred with motion, panicked wide eyes looking back over its shell. |
| `panic.png` | Cowering and shaking, legs braced, eyes enormous with terror, sweat droplets flying off it. |
| `hit.png` | Struck and defeated, tumbling backwards with X-shaped cartoon eyes, legs splayed, small impact sparks around it. |

## Boss — subject block

> A large cartoon boss monster version of a software bug: a hulking dark-purple
> armoured beetle creature with jagged spikes along its shell, glowing red eyes,
> heavy clawed legs, and a small golden crown perched on its head. Imposing but still
> cartoonish. Accent colour vivid purple (#7C3AED).

Save to `public/art/boss/<name>.png`:

| File | Pose sentence |
| --- | --- |
| `idle.png` | Standing four-square and menacing, facing the viewer, eyes glowing steadily. |
| `alert.png` | Rearing up and roaring, front legs raised, eyes blazing brighter, spikes flared. |

## Checking a pose before you commit to the set

Open the PNG on a dark background. If you see a white fringe around the hair or
bow, the background was flattened rather than transparent — regenerate rather than
trying to key it out, since the outfit is nearly black and keying eats its edges.

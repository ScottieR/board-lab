# Board Lab Design Codex

The rules the Studio's AI designer follows, and that every game in this repo is reviewed against. They're
distilled from `docs/research/FUN_RESEARCH.md` (MDA, Lazzaro, Koster, Meier, Swink, Toca Boca, Apple Design
Award winners, cozy builders) and from building the first three games. The bar: **something that could win an
Apple Design Award for Delight and Fun — made with and for our kids.**

---

## 1. Start from feelings, not mechanics

1. **Name 2–3 target feelings first** (from Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery,
   Expression, Submission). Every mechanic has to earn its place against them. Cut anything that doesn't.
2. **People fun is mandatory.** Every game must create moments that happen *between* the players: crossing
   beams, "it's over here!", a shared gasp at the reveal.
3. **One verb a 5-year-old gets in 5 seconds** sits at the center of the game. The depth comes from combining it,
   not from adding more verbs. Fizz Lab is "twist to pour"; Peek Park is "slide to look"; Night Lights is "turn to
   shine."
4. **Discovery beats instruction.** Players find secrets and combinations, and a visible collection (a Lab Book,
   found critters glowing) records what they've found.

## 2. Make it a Board game

5. **Use a physical superpower:** place, lift, turn, hold (hand on or off), slide, or several hands together. If
   the game plays the same with a mouse, redesign it.
6. **Rotation should matter.** It's the most underused input. Use it to aim, sweep, dial, pour, steer, or set "which
   way is up" for a player.
7. **The table has four sides.** Personal text faces its seat. Shared text appears twice, once facing each long
   side. Nothing important sits only in the middle under people's arms.
8. **The middle of the table is for play, the edges are for information.** Cards, scores and the Lab Book live on
   the edges. Celebrations pop up near each player's side, not over the action.
9. **Pieces are characters.** Name them, give them a facing "nose," and draw a halo or rim around them so the
   piece and its digital self read as one thing.
10. **The screen referees and reveals; people decide and persuade.** Automate the bookkeeping and leave the
    talking to the humans.

## 3. Everyone at the table plays, all ages

11. **The youngest player contributes something the team needs, without reading:** a finger glow for shy owls, the
    bell that delivers orders, the big reveal button.
12. **Teach by doing within 30 seconds.** No rules screen. The empty table shows one pulsing hint, and the first
    action is the tutorial.
13. **Players set difficulty through play, not menus:** a bigger lens, warm/cold hints, shy creatures that need two
    lights.
14. **Catch-up is invisible.** Raise the stakes in the last round, give the leader a harder target, and make busts
    soft. Never single out the leader visibly.
15. **No elimination, and nobody waits more than about 30 seconds.** Prefer simultaneous play.
16. **Failure is funny and quick to recover from.** A fizzle and a puff of smoke beat a buzzer. No game-over
    screens for under-8s.
17. **Every game has a toy mode:** the same world with no goal.
18. **Prevent quarterbacking in co-op** with private info, real time pressure, or role-locked powers.

## 4. Feel: juice with restraint

19. **Every touch, lift, slide and turn gets a visible and audible response within 100 ms.** Silence reads as
    broken.
20. **Polish the most-repeated action the most.** In Fizz Lab, the stir arc fills, the ticks rise in pitch, and the
    pour bursts.
21. **Things come alive:** idle bob, a tremble when you're close, pop-in with overshoot, settle with ease-out. Never
    teleport, never sit perfectly still.
22. **Scale the juice to the mood.** Party games get shakes and confetti. Cozy games get soft glows and chimes.
    Remove any effect that competes with the thing you just did.
23. **Sound is musical.** All effects are tuned to the style's root note, so stacking them sounds like a melody, not
    noise. Keep it soft and short, with no harsh buzzers.

## 5. Look: taste rules for every pixel

24. **One style card per game:** a small palette (ground, ground-2, two accents, glow, ink), one light source and
    glow color, and one rounded type voice. Never use default blue on white, pure black, or rainbow soup.
25. **Light is a material.** Decide where it comes from. Glows, beams, rim lights and soft shadows do more than
    detail does.
26. **Top-down, readable from any side.** Characters and props must look right when rotated. Lenses and cards turn
    content upright for whoever is looking.
27. **Every frame should be worth framing.** Leave negative space, give each screen one focal point, and keep
    background detail quieter than foreground.
28. **Consistency beats fidelity.** A simple, coherent style (flat shapes, gouache, chunky 3D) beats mixed
    high-detail assets. Generated images always include the style card's `artPrompt` and a reference image of an
    approved asset.
29. **Text is rare, big and rounded.** About 8 words at most on screen at once. Prefer icons and pictures, and
    narration for the youngest.
30. **Avoid AI tells:** purple-blue gradients by default, emoji used as the *final* art for hero characters,
    centered walls of text, inconsistent outline weights, stock "glassmorphism," and generic sparkle on everything.
    Emoji are fine as placeholders and particles; hero characters get real art (code-drawn or generated in style).
31. **Show a before-and-after.** Worlds should visibly transform: a dark garden full of glowing friends, an empty
    Lab Book now full, barren land now in bloom. Replay it at the end.

## 6. Structure: sessions that end well

32. **Sessions run 5–20 minutes with a natural ending** (a full Lab Book, all critters found, the journey's end).
33. **Each round adds a twist before mastery turns to boredom:** a bigger crowd, decoys, a shy creature, a moving
    target, a new rule.
34. **Keepsakes carry over:** discoveries, a saved island, trail diaries, named characters. Use `Board.save`.
35. **No dark patterns:** no streak pressure, no loot boxes, no purchase prompts. Ever.

## 7. Kid-designed games: Studio rules

36. **The kid's idea is the design brief.** Keep their names, their silly twist and their drawings, even when a
    "better" design exists. Suggest improvements as options, one at a time.
37. **Use their own content:** their drawings as sprites, their recorded voices as sound effects, family names and
    inside jokes.
38. **Guarantee it plays.** Every change passes the check loop below before a kid sees it. If a change fails, the
    kid sees the last working version and a friendly "the gremlins are fixing it" moment.
39. **Ask one good question at a time,** like a game designer would. Offer picture choices to non-readers.
40. **After each playtest, suggest one "make it more fun" change** grounded in what happened ("nobody found the
    owl — make it glow a little?").

---

## The fun audit (run on every generated or edited game)

**Automated, in the headless simulator:**

- [ ] Typechecks, builds, and runs 60 s of scripted play with zero errors. Frame time stays under 16 ms on a mid
      laptop, as a stand-in for the device.
- [ ] Every input in the scripted playtest (place, lift, turn, hold, tap) changes the frame within 100 ms. This is
      checked by diffing screenshots.
- [ ] The empty table shows a prompt. The first goal is reachable by a scripted "naive player" within 60 s.
- [ ] Shared HUD text renders for both long sides. Nothing important sits in the middle 40% of the table for longer
      than 4 s.
- [ ] The palette uses only style-card colors (sampled from screenshots), and text stays under the word budget.

**Claude review, from screenshots and a short gameplay GIF, against this codex:**

- [ ] Can I say the target feelings and the one core verb? Does a physical superpower matter?
- [ ] What does the youngest player do? Is there a toy mode, and a twist per round?
- [ ] Is it frame-worthy: one focal point, coherent style, light used well?
- [ ] Is failure funny? Does it end naturally? Does anything feel like an AI tell?

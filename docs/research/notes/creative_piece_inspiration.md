# Creative Physical Game-Piece and Toy-Controller Inspiration for the Board Console

Scope note: research pass of about 25 tool calls. Primary-source claims are cited. The idea catalog (last section) is design inference built on these findings. Products named in the brief that I could not verify in this pass are listed under Gaps rather than described from memory.

## What the Board platform can sense (the constraint every idea must map onto)

### Takeaway
Board pieces are passive and capacitive. Each one carries a conductive "Glyph" pattern on its base that on-device ML identifies. The table reports a piece's identity, position, rotation (about 1 degree) and whether a hand is touching it (for pieces with a conductive body). Any custom piece idea has to express itself through those signals: which glyph, where, what angle, touched or not, and when contact began or ended.

### Cited Findings
- Board detects pieces "purely through capacitive interaction with the display". Pieces have no batteries, sensors or electronics. A conductive Glyph pattern on the base is identified by on-device ML — [Board dev docs: Pieces](https://docs.dev.board.fun/learn/pieces)
- Per-contact data: stable contact ID, position at near-pixel resolution (1920x1080), orientation to about 1 degree, Glyph ID within the active Piece Set, Touched State (held vs resting, only for pieces with a conductive body), and Phase (began/moved/stationary/ended/canceled) — [Board dev docs: Pieces](https://docs.dev.board.fun/learn/pieces)
- Pieces are grouped into Piece Sets that are trained together. Only one set can be active at a time, and each needs a matching Piece Set Model in the SDK input config — [Board dev docs: Pieces](https://docs.dev.board.fun/learn/pieces)
- A reviewer describes the official pieces as "chunky spaceships", "neon kitchen utensils" and "mini Tetris-style blocks", "sized for kids' hands, yet chunky enough for adults". Strata's 3D blocks feel "satisfyingly heavy". The magnetic frame's raised edge helps keep pieces on the table — [Co-Optimus Board review 2026](https://www.co-optimus.com/blog/article-poster/3279/board-review-2026-does-the-tabletop-console-deliver-on-its-social-play-promise.html)

### Inferences
- The "Phase" lifecycle means lift, put back and lift-and-stamp are all usable inputs. A piece that is lifted and set down somewhere else reads as a "stamp" or "teleport" event, not a drag.
- Touched State is the closest thing to a button. "Hold to activate" (squeeze the lab beaker, cup the flashlight) is possible only if the topper keeps a conductive path from the hand to the base glyph. A non-conductive printed shell (PLA/PETG) over the official base may break touch sensing unless the shell leaves the official piece's conductive body exposed to the fingers, or adds a conductive path (conductive filament, copper tape or a metal insert).
- Because only one Piece Set is active at a time, toppers that ride on a single official set (for example, every candy-factory machine built on the same set's bases) keep identity reliable. Each topper's meaning comes from which base it sits on.

### Gaps
- Exact base diameters, minimum spacing between pieces, and whether stacking or an elevated piece breaks detection were not on the Pieces page. The [Board hardware page](https://docs.dev.board.fun/learn/) is referenced but was not fetched.
- Whether third parties can train custom glyph sets was not confirmed.

## Hybrid physical-digital toys: what the physical object does and why it delights

### Takeaway
The best hybrids keep the physical object simple and legible (cardboard, wood, plastic) and put the magic in a single read signal: a reflective dot, a conductive pad pattern, or an NFC tag. Delight comes from building or customizing the object, from seeing a physical action cause an on-screen effect right away, and from a physical state (a zone, a slot, a card) that changes what the software does.

### Cited Findings
- **Nintendo Labo**: Toy-Cons are passive cardboard. Reflective tape acts as a marker that the Joy-Con's IR camera tracks, so motion is read "without extra electronic components" — [Nintendo Labo developer interview Part 2](https://www.nintendo.com/au/news-and-articles/nintendo-labo-developer-interview-part-2-prototyping-and-development/)
- Labo prototypes included a giant "Big-Con" where pressing large buttons moved a reflective marker inside a box, and foot pedals with reflective balls under them. The team made 10 to 20 prototypes in about three weeks at "prototype parties" — [Nintendo Labo interview Part 2](https://www.nintendo.com/au/news-and-articles/nintendo-labo-developer-interview-part-2-prototyping-and-development/)
- A spinning-stripe "music box" prototype was judged unfun because players could not see how it worked. The lesson: the mechanism should be visible and understandable — [Nintendo Labo interview Part 2](https://www.nintendo.com/au/news-and-articles/nintendo-labo-developer-interview-part-2-prototyping-and-development/)
- Labo chose cardboard partly because it invites building, repair, modification and decoration. The logo's open corner signals "open it up and see how it works". Kids around 6 and up managed with some help, and kids 10 and up usually worked alone — [Nintendo Labo interview Part 2](https://www.nintendo.com/au/news-and-articles/nintendo-labo-developer-interview-part-2-prototyping-and-development/)
- **Labo Piano**: reflective stickers on each cardboard key tell the IR sensor which key is pressed, and cardboard spring tabs return the keys. A lever shifts the octave, and knobs set volume, envelope and reverb. Cards slotted on top change the waveform — [AV Club on Labo Piano](https://www.avclub.com/what-ive-learned-about-the-nintendo-labo-piano)
- **Osmo**: a red reflector mirror redirects the tablet camera to the table area in front of it ("Reflective AI"), so ordinary physical tiles are read by vision — [Osmo support: How does Osmo work](https://tangibleplay.freshdesk.com/support/solutions/articles/68000000587-how-does-osmo-work-)
- **Hasbro zAPPed (2012)**: capacitive plastic pads under each piece are "arranged in unique patterns" so the app knows which piece it is. Each Battleship ship has a different pad layout. In Monopoly zAPPed, a player's debit card is swiped across the iPhone screen to add or subtract money — [Engadget zAPPed hands-on](https://www.engadget.com/2012-02-12-zapped-board-games-hands-on.html)
- **Marbotic Smart Letters/Numbers**: wooden letters and numbers with conductive plastic that uses the body's charge (no batteries or pairing). Soft pads on the bottom are the contact points. Kids hold a metal handle and stamp the piece onto the iPad. Pieces are sometimes misread when held upside down — [Macworld Marbotic review](https://www.macworld.com/article/229501/marbotic-smart-letters-and-smart-numbers-review-toys-tablets-educational-fun.html)
- **PlayShifu Tacto**: real figurines drive on-screen play across sets: Classics (Ludo, Checkers), Laser (reflecting and splitting light into colors), Coding, Chess, Electronics (a circuit lab with 50+ gadgets and 500+ circuits on a digital breadboard) and Dino. The article does not say how figurines are sensed — [eSchool News on Tacto](https://www.eschoolnews.com/2021/06/01/family-game-nights-come-alive-with-tacto/)
- **LEGO Dimensions Toy Pad**: three RGB-lit zones give hints and introduce puzzle mechanics. Moving a figure onto a special section triggers SCALE mode (shrink to ant size or grow to skyscraper size). Other modes include colored portals and SHIFT — [Co-Optimus on Toy Pad](https://co-optimus.com/article/13275/lego-dimensions-toy-pad-includes-multiple-features.html)
- **Sony toio**: two small robots with a cartridge port and "toio ring" controllers (accelerometer, gyro, buttons). Titles include *Papercraft Creatures – Gesundroid*, so papercraft toppers go on the robots — [Wikipedia: Toio](https://en.wikipedia.org/wiki/Toio). toio robots read absolute position from a special printed mat — [toio spec: position ID](https://toio.github.io/toio-spec/en/docs/hardware_position_id) (search-result page title only, not fetched).

### Inferences
- Labo's "visible mechanism" lesson applies directly. A printed topper whose moving part changes the contact pattern should let kids see the part move (clear windows, colored flags). Otherwise it feels broken, not magic.
- zAPPed's swipe card and Marbotic's stamp are proof that "lift, stamp, swipe" gestures with passive conductive objects work for young kids. They suit the circuit-maker's stamped components and the doctor clinic's stamped "stickers".
- LEGO Dimensions' "zone changes what the figure is" maps onto screen regions: drag a piece into a drawn zone (shrink ray, portal, candy-press) and the on-screen object transforms.
- Tacto Laser and Tacto Electronics are close analogues to the circuit-maker and to flashlight/mirror puzzles. Physical mirror and prism pieces whose rotation steers an on-screen beam are proven.

### Gaps
- Not verified in this pass (no source fetched): Skylanders/Disney Infinity/Amiibo NFC portal details, LEGO Hidden Side AR, Tamagotchi/Bandai touch toys, Tiny Tap, Sphero, Tilt Five, Monopoly zAPPed beyond the card, Mr. Potato Head app, Kano, Cubetto, Plugo, Merge Cube, Plato. Treat any description of these as general knowledge that needs checking.
- No Osmo patent or engineering blog was reached, so details of how Osmo recognizes Pizza Co./Coding Jam tiles are unconfirmed.

## Board and table games with inventive components

### Takeaway
The most-loved components work in one of three ways. They turn a dull rule action into a physical ritual (gear turning, dice towers, a dice-release pyramid). They hide state on the piece itself (HeroClix dials, flip-tokens). Or they are dexterity objects whose failure is funny (Junk Art, Rhino Hero, Terror in Meeple City). Tactile qualities people praise: heft, click and clatter sounds, squishiness, and shapes that show direction.

### Cited Findings
- **Tzolk'in**: the central gear is turned each round to advance the other gears, "a satisfying ritual". Fans custom-paint the gears — [Meeple Mountain: Irresistibly Touchable Games](https://www.meeplemountain.com/top-six/top-6-irresistibly-touchable-games/); [AV Club: 10 Coolest Components](https://www.avclub.com/the-10-coolest-boardgame-components)
- **Wingspan birdfeeder**: a dice tower that turns rolling into "feeding birds". New players gravitate to it — [Meeple Mountain: Components We Love](https://www.meeplemountain.com/top-six/top-6-components-we-love/)
- **Camel Up 2e pyramid**: you shake it and press a button to open a chute that releases one die. "The sound of each shake builds tension" — [Meeple Mountain: Components We Love](https://www.meeplemountain.com/top-six/top-6-components-we-love/)
- **Everdell squishy berry**: players squeeze it "with an expectation of juice". The designers kept it in the kids' version, My Lil' Everdell — [Meeple Mountain: Components We Love](https://www.meeplemountain.com/top-six/top-6-components-we-love/)
- **Victorian Masterminds agent cogs**: chunky discs placed face-down and flipped when a stack reaches three. Players constantly fiddle with them — [Meeple Mountain: Components We Love](https://www.meeplemountain.com/top-six/top-6-components-we-love/)
- **Splendor** chips: heft plus a satisfying stacking clatter. **Gizmos**: marble dispenser, the "clink" of returning marbles, spinning marbles in the ring while waiting. **Squadro**: tapered pieces that show direction. **Azul**: smooth tiles that click in the bag — [Meeple Mountain: Irresistibly Touchable](https://www.meeplemountain.com/top-six/top-6-irresistibly-touchable-games/)
- **Forbidden Desert**: a toy airship you rebuild by finding parts. **Takenoko**: stackable bamboo plus a panda that eats it. **Steam Park**: 3D cardboard rides with meeples on them. **Terror in Meeple City**: wooden monsters dropped on buildings. **Pandemic: On the Brink**: petri dishes. **Ca$h and Guns**: foam pistols pointed simultaneously. **Shogun**: a cube tower — [AV Club: 10 Coolest Components](https://www.avclub.com/the-10-coolest-boardgame-components)
- **Sheepy Time**: a 3D picket fence that players "jump over" marks tension — [Meeple Mountain: Components We Love](https://www.meeplemountain.com/top-six/top-6-components-we-love/)
- **HeroClix combat dial**: the base is a rotating stat wheel. Taking damage turns it clockwise a set number of clicks, "revealing altered stats". Some figures get stronger when wounded, and turning can reveal new abilities. Colored rings marked experience level — [Wikipedia: HeroClix](https://en.wikipedia.org/wiki/HeroClix)
- **Mice and Mystics**: a cheese-wheel clock where completing a section spawns enemies. A grandfather-clock initiative track. Double-sided tiles that flip to move between levels — [Polyhedron Collider review](https://www.polyhedroncollider.com/2018/03/mice-and-mystics-review.html)
- **EXIT: The Game**: a decoder wheel takes your answer and points to an answer card. Components are cut, torn and destroyed as you play — [Board Game Quest EXIT review](https://www.boardgamequest.com/exit-the-game-review/)
- **Junk Art**: awkward plastic shapes stacked into sculptures. Seeing it fall is "even better", and cascading failures make the whole table laugh — [Meeple Like Us: Junk Art](https://www.meeplelikeus.co.uk/junk-art-2016/)
- **Rhino Hero: Super Battle**: a 3D skyscraper-stacking game rated "from 5" and recommended by the Spiel des Jahres jury (the 2018 year is inferred from the logo filename) — [Spiel des Jahres page](https://www.spiel-des-jahres.de/en/games/rhino-hero-super-battle/)

### Inferences
- A HeroClix-style clicking dial collar on a Board base is a natural fit. The table already reads rotation to about 1 degree, so a detented collar with visible stat windows gives the dial physical feedback (clicks) and the game exact state.
- Gear and dice-tower rituals translate into "turn the crank" toppers whose rotation advances the game clock (the Oregon Trail wagon wheel, the candy-factory crank).
- Squishy, clicky and weighty objects are what people describe as irresistible. Even when the table cannot sense squish, a TPU squish element on a topper adds fidget value.

### Gaps
- Not fetched: Flick 'em Up, Ghost Stories, Mysterium, Unlock!, Pandemic Legacy, Magic Maze, Kitchen Rush, Catan 3D, BGG component threads, Kinderspiel des Jahres jury writeups.

## Tangible user interface research for kids

### Takeaway
Research tangibles show that familiar physical objects with shape-encoded syntax (jigsaw edges) invite participation, prevent errors and support group play better than screens alone. Rotating pucks (reacTable) are the canonical "knob on a table" pattern.

### Cited Findings
- **Tern tangible programming (Boston Museum of Science, Robot Park)**: about 78–79% of visitors who noticed the exhibit tried it, with girls at 85.7–92.9%. Blocks were wooden train-track pieces with printed faceplates (about $1–3 each). The jigsaw shape conveys the syntax, making a syntax error "impossible". Groups averaged about 2.4 people with fluid active and passive roles, which the authors credit to multiple access points — [Horn et al., IDC 2008](https://tidal.northwestern.edu/media/files/pubs/idc08.pdf)
- Robot Park opened in October 2007 and drew about 20,000 visitors in its first year — [Tufts HCI: Robot Park](https://hci.cs.tufts.edu/tern/robotpark.html)
- reacTable used fiducial-tracked pucks on a tabletop (reacTIVision) — [Bencina et al., CVPR 2005 workshop](https://mlanthology.org/cvpr/2005/bencina2005cvpr-improved) (search-result page title only, not fetched)

### Inferences
- Jigsaw-edged toppers make sequence-building legible for the 5-year-old: circuit components that only connect polarity-correct, or ant-machine parts (leaf ramp, twig lever) that key together.
- Group-access design: make pieces graspable from any side and readable from any seat, because all the kids are around one table.

### Gaps
- Topobo (MIT, kinetic memory) and Bee-Bot pages failed to fetch or were not searched. The reacTable puck semantics (rotation = parameter, proximity = connection) are from general knowledge and not verified here.

## Design principles for kid-irresistible pieces, and safety

### Takeaway
Across sources the recurring drivers are: chunky, hand-sized pieces with heft. Sound (clicks, clatter, rattles). Squish and fidget (spin, flip, click). A visible mechanism. Things you build or customize yourself. Shapes that show function (direction, connection). Funny failure. For safety, pieces for kids 3 and older are not banned for small parts, but anything that fits the 1.25" x 2.25" cylinder triggers choking-hazard labeling for ages 3–6. Keeping every detachable part larger than that cylinder is the simple rule when a toddler may be around.

### Cited Findings
- Heft and stacking clatter (Splendor), clinks (Gizmos), squeeze (Everdell berry) and fiddle-flipping (agent cogs) are cited as what makes components touchable — [Meeple Mountain: Irresistibly Touchable](https://www.meeplemountain.com/top-six/top-6-irresistibly-touchable-games/); [Meeple Mountain: Components We Love](https://www.meeplemountain.com/top-six/top-6-components-we-love/)
- Visible mechanism and the build/repair/decorate loop drive Labo's delight. Durability tests repeated motions thousands of times, replacement materials were sold from launch, and repair (rubber bands, masking tape) was taught as part of play — [Nintendo Labo interview Part 2](https://www.nintendo.com/au/news-and-articles/nintendo-labo-developer-interview-part-2-prototyping-and-development/)
- The CPSC small-parts ban applies to products for children under 3. A small part is anything that "fits, without compressing and in any orientation, entirely into the small parts cylinder" (16 CFR 1501.4) — [CPSC Small Parts guidance](https://cpsc.gov/Business--Manufacturing/Business-Education/Business-Guidance/Small-Parts-for-Toys-and-Childrens-Products)
- The cylinder is 2.25" long by 1.25" wide, roughly a child's expanded throat. 16 CFR 1500.19 requires "WARNING: CHOKING HAZARD" labeling for toys for ages 3–6 that are or contain small parts. Small balls and marbles carry warnings for ages 3–8 — [ComplianceGate small parts overview](https://www.compliancegate.com/small-parts-regulations-warnings-united-states/) (note: this source's headings say both 3–6 and 3–8 for small parts. The 3–8 range applies to balls and marbles.)
- Marbotic pieces were misread when held upside down, a reminder that kids will grip and place pieces in unexpected orientations — [Macworld Marbotic review](https://www.macworld.com/article/229501/marbotic-smart-letters-and-smart-numbers-review-toys-tablets-educational-fun.html)

### Inferences
- The youngest player is about 5, so small parts are a labeling issue, not a ban. But siblings, guests and pets argue for keeping any detachable bit (fairy figurines, candy tokens, component stamps) bigger than 1.25" in every dimension, or captive (on a hinge, tether or snap that can't come off).
- Durability for FDM prints: hinges and detents fatigue. Use print-in-place hinges with generous clearances, TPU for flex parts, and walls of 2mm or more. Avoid thin cantilevers that a 5-year-old will snap. Labo's "repair is part of play" framing suggests designing replaceable clip-on parts.
- Never put loose magnets or button batteries in toppers. (This is a general safety norm and was not separately sourced here.)

### Gaps
- No CHI/IDC paper on ideal piece size, weight or texture for ages 5–7 was retrieved. The small-ball diameter threshold (1.75") is from general knowledge, not verified in this pass.

## How these translate to passive Board pieces: idea catalog by mechanism (40+ ideas)

### Takeaway
Each idea below names its inspiration (source cited above unless marked GK, meaning general knowledge not verified here), what the physical piece does, and how Board would sense it. The richest levers are a rotation dial with detents, the lift/stamp lifecycle, touched-vs-resting, relative position between two pieces, and toppers whose moving part shifts or exposes the conductive contact.

### Cited Findings
- Sensing primitives: identity, position, rotation to about 1 degree, touched state, contact phase — [Board dev docs: Pieces](https://docs.dev.board.fun/learn/pieces)

### Inferences

**A. Rotation as a dial or crank**
1. *Clicking stat collar* (HeroClix dial): a detented ring on the doctor-clinic patient that turns to "temperature" or "mood" with a window showing the current face. Rotation sets the value, and the clicks give tactile feedback.
2. *Crank handle* (Tzolk'in gear ritual): an Oregon Trail wagon-wheel topper. Turning it advances days and miles, and each full turn is one day.
3. *Candy-factory taffy puller*: a crank topper. Rotation speed sets taffy stretch on screen, and turning backwards rewinds.
4. *Safe-dial/combination lock* (EXIT decoder wheel): a mad-scientist vault piece. Rotate to the right numbers in sequence, read from angle.
5. *Oven knob* (Labo Piano knobs): a cooking stove knob sets heat. Leaving it on "high" too long burns the on-screen pancake.
6. *Spirit-board planchette* (Ouija): rotation and position together. The window ring over a letter selects it, and touched state means "spirit is moving" (both players' fingers on it).
7. *Compass rose*: in the flashlight hide-and-seek game, rotating a flashlight topper aims a beam cone on screen (Tacto Laser analog).
8. *Mirror/prism pieces* (Tacto Laser): rotate printed mirrors to bounce a light beam to the sleeping fairy, or to reroute current in the circuit-maker.

**B. Lift, stamp and swipe (contact phase)**
9. *Rubber-stamp components* (Marbotic stamp): circuit-maker resistor, LED and battery stamps. Lifting and pressing places a part where you stamp.
10. *Sticker stamp*: the doctor-clinic "brave sticker" or bandage stamp. Each stamp is a reward ritual.
11. *Swipe card* (Monopoly zAPPed debit card): a candy-factory "golden ticket" slid across the table to unlock a room, or an Oregon Trail general-store card.
12. *Cookie cutter*: a cooking topper. Pressing it on the rolled-out on-screen dough cuts that shape.
13. *Seed dibber*: in the fairy garden, poking a seed piece plants a flower where you press. Different glyphs give different seeds.
14. *Soldering iron* (circuit-maker): a pen-shaped topper. Held (touched) and pressed briefly on a joint, it "solders". Holding it too long burns the joint.

**C. Hold or touch to activate (touched state)**
15. *Cupped flashlight*: the beam is on only while held. Set it down and the beam turns off, so hiding players can move.
16. *Magnifying glass* (Where's Waldo): only while held does the lens area reveal the zoomed hidden layer under the piece's clear window.
17. *Stethoscope chest piece*: while held over the patient's on-screen body, heartbeat audio plays faster near the problem.
18. *Fairy lure jar*: hold it still in one spot for N seconds to attract a fairy (patience mechanic for the 5-year-old).
19. *Two-hand planchette*: requires touch from players on both sides of the table, as cooperative "spirit" energy.

**D. Windows, lenses and screen-through-the-piece**
20. *Clear lens topper* (Osmo/Labo "visible"): a printed clear-resin or transparent-PETG lens. The screen draws content inside the piece's footprint, so the piece appears to contain a moving thing (a bubbling beaker, a fairy inside a jar).
21. *Decoder-window ring* (EXIT decoder): a red-filter ring that reveals hidden text drawn in red-on-red under it (Where's Waldo clue reveal).
22. *Periscope/aperture shutter*: a rotating iris. More open means a bigger reveal radius in hide-and-seek.
23. *Portal ring* (LEGO Dimensions colored portals): a hollow ring. Drop a character inside to warp it to the matching colored ring elsewhere.

**E. Zones, combining and adjacency (relative position)**
24. *Shrink-ray pad* (LEGO Dimensions SCALE): place the ant inventor near a mad-lab "shrink" piece and it shrinks on screen to enter the twig machine.
25. *Recipe adjacency* (Pizza Co. GK): put ingredient pieces next to a mixing-bowl piece. The set of nearby IDs is the recipe.
26. *Jigsaw-keyed circuit blocks* (Tern IDC 2008): toppers with puzzle edges so only valid connections physically fit, and the table reads the chain from adjacency.
27. *Machine-chain parts* (Bug's Life inventor): leaf ramp, twig lever and acorn wheel. Arrange them in a line and the on-screen marble runs through them in order.
28. *Fairy-garden attractors*: flowers placed near each other in specific arrangements (ring, triangle) attract rarer fairies, a collection mechanic.
29. *Mahjong/domino "meld" tiles*: physical tiles that the table scores when laid adjacent and aligned by rotation. Phones hold the private hand.
30. *Patient + tool pairing*: the thermometer near the mouth, the otoscope near the ear. The position relative to the patient piece triggers the exam.

**F. Mechanical part that changes the contact pattern**
31. *Flip token* (Victorian Masterminds cogs): a two-sided topper whose base glyph differs per side, for day/night, healthy/sick, or alive/ghost.
32. *Plunger piece* (Labo Big-Con): pressing the top pushes an extra conductive foot down, changing the glyph or contact count. The press is readable as a button. Feasibility depends on whether Board's ML reads a modified glyph; see Gaps.
33. *Slide-switch topper*: a slider that moves a conductive pad to a new position under the piece, as an ON/OFF circuit switch.
34. *Swap-in cartridge* (Labo Piano cards): a slot in the topper takes small inserts that alter the piece's contact (or just its meaning), for flavor cartridges in the candy machine.
35. *Wind-up/spring return* (Labo piano keys): a sprung lever that returns, for a "pump" in the lab that must be pumped repeatedly.

**G. Stacking, building and dexterity**
36. *Stackable candy layers* (Takenoko bamboo): rings stack onto a base piece. Height is not sensed, but on-screen counting (each add is a lift/replace event) tracks the layers.
37. *Junk-Art tower on a sensed base*: wobble play on top of a Board piece. If the tower falls, the knocked base moves or rotates and the table "sees" the collapse.
38. *Rhino-Hero-style climber*: a figure carried up a stack of cards. The base piece is where it started, and its move is read on landing.
39. *Flick piece* (Flick 'em Up GK): flick a disc, and the table reads where it stopped, for a curling-style lab experiment or a candy-cart race.
40. *Dice tower/chute* (Wingspan, Camel Up): a printed chute that drops a sensed token onto the table at a semi-random spot, for "which fairy shows up" or the Oregon Trail event draw.

**H. Sound, squish and fidget (delight without sensing)**
41. *Rattle chamber*: a captive bead inside the potion bottle (bead larger than the small-parts cylinder or fully enclosed). It sounds when shaken, and lifting is detected as a "shake potion" phase event.
42. *Squishy TPU berry/candy* (Everdell berry): a squeezable gummy topper. Not sensed, but pure delight for the 5-year-old.
43. *Clicker spinner*: a fidget spinner ring on a magnifier handle that keeps hands busy while waiting.
44. *Ratchet click on a crank*: a printed pawl gives the "clack-clack" that makes Tzolk'in-style turning satisfying.

**I. Build, customize and transform**
45. *Customizable fairy shells* (Labo decorate/repair): kids paint their own printed fairy or ant shell, and the base identity stays constant.
46. *Transforming robot*: a hinge-fold topper that shows two looks (doctor coat vs. superhero cape) but sits on the same base. The software decides which mode it's in from a flip or rotation gesture.
47. *Papercraft over printed frame* (toio Papercraft Creatures): a 3D-printed skeleton with paper skins kids design, which is cheap to iterate.
48. *Destroy-to-reveal* (EXIT): a one-time sealed "mystery egg" topper. Crack its snap-cap to reveal the inner figure (collectible fairy).

**J. Physical state on the piece**
49. *Experience ring colors* (HeroClix rings): color rings that snap onto a base to show level. Software tracks level, and the ring is a physical reminder.
50. *Cheese-wheel clock* (Mice and Mystics): a wedge timer piece rotated by a wedge each round. Rotation tells the table the round.

### Gaps
- Glyph changes caused by mechanical parts (ideas 31–35) depend on whether Board's ML tolerates or can be retrained for modified glyphs. Undocumented, and needs testing.
- Clear-lens toppers (20–23) need a hollow footprint that does not cover the screen. How much of the official base occludes the screen is unknown.
- Whether conductive filament gives a reliable touch path through a topper is untested here.

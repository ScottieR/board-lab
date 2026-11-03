# Capacitive tangibles: design and DIY fabrication for Board custom pieces

Context reminder: Board (23.8", 1920x1080 capacitive table) recognizes official pieces with an on-device ML model per Piece Set. It reads a conductive "Glyph" on the base and reports Glyph ID, position (near pixel resolution), orientation (about 1 degree), and Touched State. Pieces are "a blend of plastic and conductive material". Some have a conductive body wired to the Glyph, so a hand changes the signal (this is `isTouched`). Only one Piece Set model is active at a time. Contact types documented in the concepts page: Finger and Glyph. "Blob" is not on that page; the Board project notes mention a `Blob` type from the SDK. Board automatically filters out palms, arms and elbows. — [Board docs: Pieces](https://docs.dev.board.fun/learn/pieces); [Board docs: Concepts](https://docs.dev.board.fun/learn/concepts)

---

## 1. How passive capacitive tangibles work on mutual-capacitance screens (grounding, pad size/spacing, why untouched objects vanish, keeping them detected)

### Takeaway
A passive tangible is a conductor that steers the screen's field. When a hand touches it, the hand provides the coupling to ground, so the conductor's feet look like fingertips. Untouched, the conductor is weak. The controller's adaptive baseline also absorbs a static object over time, so it "vanishes". The research fixes are: (1) bigger pads (about 10 mm) with no insulation between pad and glass, (2) electrically linking several pads into one larger conductor (PUCs), or (3) active or semi-active tricks (PERCs field sensor, TUIC pressure switch, LightTouch LDR). Pad diameter of roughly 5-10 mm and center spacing of roughly 10-17 mm are the working numbers. They depend on the device, and Board's numbers are unmeasured.

### Cited Findings
- **Grounding mechanism:** Conductive tokens have "feet" that ground when touched. This creates a capacitance change that looks like a multi-touch pattern. Minimum foot size and spacing depend on the device. — [TouchTokens (Morales González et al., CHI 2016), related work](https://www.lri.fr/~anab/teaching/evaluation/papers/touchtokens.pdf)
- **Clip-on Gadgets:** A conductor on the screen that is connected to the body or ground changes the capacitance, and the screen senses its position. Holding the metal clip connects the buttons' ground ends to the user's body, which completes the circuit. — [Clip-on Gadgets (Yu et al., UIST 2011)](https://core.ac.uk/download/357520689.pdf)
- **Minimum sizes on iPad:**
  - Clip-on Gadgets: minimum contact diameter 3 mm and minimum gap 5 mm; tacks of about 5 mm to simulate a finger; the reliably detected sensing width is about 5 mm. — [Clip-on Gadgets](https://core.ac.uk/download/357520689.pdf)
  - TUIC: minimum distance between two reported touch points is about 0.5 cm on iPad and 1.0 cm on a 3M display; maximum simultaneous touches are about 10 on iPad and 20 on the 3M display. — [Yu thesis, NTU (TUIC)](https://tdr.lib.ntu.edu.tw/bitstream/123456789/10175/1/ntu-100-1.pdf)
  - CapStones: the iPad needs at least 1.7 cm between contact centers when contacts must be resolved as separate stable touches. — [CapStones (Chan et al., CHI 2012)](https://hcie.csail.mit.edu/research/capstones/capstones.html)
- **Systematic marker study (Inventions 2018, "Evaluation of Capacitive Markers Fabricated by 3D Printing, Laser Cutting and Prototyping"):**
  - Setup: 3-point markers with 5 mm pads at 10 and 15 mm center spacing, and 10 mm pads at 15 and 21 mm spacing.
  - 10 mm pads significantly beat 5 mm pads (p<0.001), and the i.onik tablet detected no 5 mm markers at all.
  - Touched interaction worked best.
  - Untouched detection worked mainly with 10 mm markers. Untouched 3D-printed markers with no insulation were detected 100% of the time on iPad, falling to about 20% with 0.56 mm of insulation. On the i.onik the rate fell from 100% to 30% at 0.47 mm.
  - "Touched and moved" was always detected up to about 0.5 mm of insulation. Above about 0.3 mm of insulation, detection fell below chance overall.
  - If the conductive bridge between pads was thinner than 1 mm, the marker registered as a single touch.
  - Source: [MDPI Inventions 3(1):9](https://www.mdpi.com/2411-5134/3/1/9)
- **Why objects vanish:**
  - CapStones: the iPad reports only contact or no contact, so blocks are invisible until touched. Removal is inferred when all contacts vanish at once, and bumped blocks can go out of sync. — [CapStones](https://hcie.csail.mit.edu/research/capstones/capstones.html)
  - PERCs: passive tangibles are "filtered out over time by the adaptive signal filters of the touch screen". Once the user lets go, the system cannot tell release from removal. — [PERCs project page (Voelker et al., UIST 2015)](https://hci.rwth-aachen.de/percs)
  - PUCs: capacitive displays usually filter out data from passive objects. PUCs are reportedly detected reliably while untouched, are fully transparent, and need no display or driver modification. The detailed method was not retrieved. — [PUCs project page (Voelker et al., ITS 2013)](https://hci.rwth-aachen.de/pucs)
  - TouchTokens' related work: PUCs detect untouched tokens through mutual capacitance but usually need a calibration clip. — [TouchTokens](https://www.lri.fr/~anab/teaching/evaluation/papers/touchtokens.pdf)
- **Stacking adds capacitance:** Stacked CapStones merge their wires into one long wire. On an iPad, four or more stacked blocks reach the threshold and register as contact without any touch. On a less sensitive MacBook trackpad the limit was six. Enlarging the conductive mass, a "ground plane" effect, can make an object self-detecting. — [CapStones](https://hcie.csail.mit.edu/research/capstones/capstones.html)
- **Insulating plastic between conductor and glass hurts:** A PLA overlay that guided thumbs through holes failed to register presses. The author's hypothesis is PLA's permittivity (about 2 vs 1 for air). This is a blog report, not a measurement. — [Grant Trebbin blog, 2016](https://www.grant-trebbin.com/2016/02/a-3d-printed-successful-failure.html)
- **Semi-active fixes:**
  - PERCs adds a small field sensor that detects the screen's own probing signal, so the system knows the tangible is on the surface. — [PERCs](https://hci.rwth-aachen.de/percs)
  - TUIC-hybrid uses a pressure switch that turns its modulation circuit on when the object rests on the surface. — [TUIC thesis](https://tdr.lib.ntu.edu.tw/bitstream/123456789/10175/1/ntu-100-1.pdf)
  - LightTouch Gadgets use an LDR. The app changes screen brightness under the gadget to switch a path between ground and a touch point. It needs no battery and no continuous finger contact. — [LightTouch Gadgets (Ikematsu et al.)](https://sites.google.com/view/ikema2/research-project/lighttouch)

### Inferences
- Board's `isTouched` field is the same physics as above. An official piece is visible untouched, probably because its Glyph and conductive body are large and well designed and Board's controller and ML are tuned for resting objects. It reads differently when a hand adds ground coupling. Any shell over an official piece must keep a conductive path from hand to body or `isTouched` will stay false. This matches the existing project plan.
- For DIY "finger-like" blobs on Board, start with pads about 10 mm in diameter and centers at least 15-20 mm apart. Connect the pads with a thick (more than 1 mm) conductive bridge and put no plastic skin under the pad. To survive untouched, make the token's total conductive mass large: a tall conductive body, a stacked mass, or embedded foil or metal.
- Board filters palm-sized contacts, so a token that is too large or flat-bottomed may be rejected as a palm. There is a sweet spot between "too small to see untouched" and "too big, filtered as palm". This must be measured.

### Gaps
- I found no published figures for Board's sensor pitch, minimum pad size, untouched-detection threshold, or palm-filter size. These must be measured empirically. The Board Notion technology explainer would not render.
- The PUCs and PERCs full papers were not retrievable (an allowlist block), so I lack PUCs' exact untouched-detection mechanism and PERCs' marker geometry.
- I found no source quantifying how long an adaptive baseline takes to absorb a stationary passive object, and it is likely controller-specific.

---

## 2. Research literature: how identity, position, rotation and mechanical state are encoded

### Takeaway
Nearly all passive systems encode identity and pose as a spatial constellation of fingertip-like points, usually three asymmetric "registration" points plus payload points. Mechanical state is encoded either by changing which points are connected to the user (switches, rotating segments, zebra-rubber passthroughs), or by temporal patterns as a part moves over coded traces (DuoTouch). Optical (Lumino, Transporters) and magnetic (GaussBits/GaussStones, MagGetz) alternatives need sensors Board lacks. The exception is the optical light-pipe idea for display passthrough.

### Cited Findings
- **CapStones (Chan, Müller, Baudisch et al., CHI 2012):**
  - Each block has a 2x2 grid of bottom contacts. A single block shows 2 active contacts, and each stacked block activates one more, so the screen reads stack height from the count (2, 3, 4).
  - Wires link a side "user connector" (where the hand touches) to the screen contacts, and top inter-block contacts connect to the block above. Magnets enforce alignment.
  - A richer 3x3 design uses 3 contacts for position and rotation. The other 5 encode the block's color (red or green) and pass down the colors of up to two blocks above.
  - An analog prototype (Arduino self-capacitance grid, 30 MΩ resistors) allowed untouched detection and multi-level encoding, but noise limited the number of levels.
  - Source: [CapStones](https://hcie.csail.mit.edu/research/capstones/capstones.html); [HPI project page](https://hpi.de/baudisch/projects/capstones-and-zebrawidgets.html)
- **ZebraWidgets (same paper):**
  - Dials and sliders have a side user connector and 4 bottom contacts in a unique pattern. The pattern gives ID, and its orientation gives the rotation value.
  - A ring of zebra rubber (elastomeric connector with alternating conductive and insulating layers, 40 connections per cm) runs top to bottom. It passes the ID and rotation of a dial stacked above down to the screen, regardless of the lower dial's rotation. Sliders use the same idea.
  - Source: [CapStones/ZebraWidgets](https://hcie.csail.mit.edu/research/capstones/capstones.html)
- **TUIC (Yu et al., NTU, about 2010-11):**
  - TUIC-2D is passive: 3 registration points form a right triangle, plus a 3x3 payload grid in a 5x5 frame, giving 9 bits (IDs 1-511). At least one payload point is required so a three-finger gesture is not mistaken for ID 0. It is detected on placement and tracks orientation.
  - TUIC-f is active: a battery-powered MSP430 toggles one point at intervals from 15 to 45 ms, giving IDs 1-7 with up to about 450 ms startup delay.
  - TUIC-hybrid combines a frequency tag with 2 positioning points. Its "Slap-on calculator" uses switches to change the frequency.
  - Source: [Yu thesis](https://tdr.lib.ntu.edu.tw/bitstream/123456789/10175/1/ntu-100-1.pdf)
- **Clip-on Gadgets (Yu et al., UIST 2011):**
  - Unpowered buttons on a clip at the screen edge, overlapping the screen by about 3-5 mm. Each button's conductive rubber links the finger to a 5 mm tack on the screen edge, one tack per button, wired to the metal clip so the user's hand provides ground.
  - The D-pad uses different spacing ratios between contacts so each button is unique. Knob, dial and slingshot controls are proposed but not built.
  - Source: [Clip-on Gadgets](https://core.ac.uk/download/357520689.pdf)
- **TouchTokens (Morales González, Appert, Bailly, Pietriga, CHI 2016):**
  - Tokens are non-conductive (wood) and have notches that force a specific finger constellation. The 15 mm wide, 1.5 mm deep notches sit 5 mm from the edge. Recognition uses the fingers themselves: at least 3 points, centroid alignment, and template matching, with no training.
  - Accuracy was 98.7% on a tabletop and 99.3% on a tablet across 6 tokens (4-5 cm circles, squares, a rectangle and a triangle). The token is not seen once fingers lift.
  - Source: [TouchTokens](https://www.lri.fr/~anab/teaching/evaluation/papers/touchtokens.pdf)
- **CapCodes / 3D-printed capacitive markers (Schneider et al., TH Nürnberg):** 3-point markers printed with Proto-pasta in dual extrusion, laser-cut acrylic with silver varnish, or salt dough on cardboard. Results are in Q1 above. There is a related open-source recognizer repository. — [MDPI Inventions 2018](https://www.mdpi.com/2411-5134/3/1/9); [CapCodes listing](https://opus4.kobv.de/opus4-ohm/solrsearch/index/search/searchtype/authorsearch/author/Daniel+Schneider); [tangible-touch GitHub](https://github.com/informatik-mannheim/tangible-touch)
- **Capricate (Schmitz et al., UIST 2015):** 3D-printed capacitive sensors in carbon ABS. An "On-Screen" mode forwards touches via untethered electrodes onto a phone or tablet, like TUIC; their example is an on-screen D-pad. Fabrication numbers are in Q3. — [Capricate PDF](https://mschmitz.org/publications/schmitz-UIST15-capricate.pdf)
- **ExtensionSticker (Kato & Miyashita, about 2015):** Inkjet-printed strip arrays of conductive footprints on film. They transmit a touch from off-screen onto the screen for 1D scrolling, with no decoder. — [DuoTouch related work (arXiv 2602.17961)](https://arxiv.org/html/2602.17961)
- **Ohmic-Sticker:**
  - Hackster describes a flex-PCB sticker that relays touches from elsewhere onto small screen contacts. — [Hackster](https://www.hackster.io/news/ohmic-sticker-dramatically-extends-the-capabilities-of-your-touchscreens-and-touchpads-4b87dd749fe0)
  - DuoTouch describes it more specifically as a force-to-motion device that modulates impedance to ground. Per DuoTouch, it relies on non-public capacitive data, so it is not usable via public touch APIs. Its TrackPoint variant uses four footprints. — [DuoTouch](https://arxiv.org/html/2602.17961)
  - The two descriptions differ in emphasis but are not contradictory: one covers the passthrough and the other covers the force sensing.
- **DuoTouch (Ikematsu & Kato, CHI 2026):** The most directly relevant for mechanical state.
  - Only two on-screen footprints, each 8 mm square. Each feeds a trace patterned with alternating conductive and insulating segments.
  - A moving part (button, slider or knob) carries a conductive 3D-printed element that connects the finger, which is ground, to the traces as it moves.
  - "Aligned" layout: a reference trace plus a binary-coded trace give discrete commands, with non-palindromic codes for direction.
  - "Phase-shifted" layout: quadrature encoding for continuous sliders and dials. Direction comes from which footprint leads, and distance comes from counting transitions.
  - Trace widths of 1.5-3 mm were tested. Speed limit is v ≤ w·f_s, for example about 180 mm/s for 3 mm traces at 60 Hz.
  - It works through standard public touch APIs. STL libraries and a pattern-design tool are provided.
  - Conductive filament co-printed with PLA is mentioned as an alternative to PCB but was not evaluated. The authors note its higher resistivity and rougher contact.
  - Source: [DuoTouch, arXiv 2602.17961](https://arxiv.org/html/2602.17961)
- **CAPath (Kato, Ikematsu, Kawahara, PACM HCI 2020):** 3D-printed objects in a "conductive grid structure" of contact points that extend capacitive touch input. Detailed parameters are not on the project page. — [CAPath project](https://sites.google.com/view/kunihirokato/projects/capath)
- **PERCs and PUCs (Voelker et al., RWTH Aachen):** See Q1. PERCs = persistent tracking via an embedded field sensor; PUCs = transparent, passive, untouched-detectable widgets. — [PERCs](https://hci.rwth-aachen.de/percs); [PUCs](https://hci.rwth-aachen.de/pucs)
- **Transporters (Heller et al., RWTH):** Widgets with optical fibers carry the display image from base to top surface, and thin conductive wires carry touch from the top surface down to the screen. Input and output can be spatially remapped independently. — [Transporters](https://hci.rwth-aachen.de/transporter)
- **Lumino (Baudisch, Becker, Rudeck, CHI 2010):** Blocks contain fiducial markers and glass fiber bundles. Light from markers higher in a stack travels down the bundles to a camera-based (diffuse illumination) tabletop. The bundles shrink and rearrange the images so a stack's markers fit one footprint. This is optical, not capacitive. — [HPI Lumino](https://hpi.de/baudisch/projects/lumino.html)
- **GaussBits / GaussStones / MagGetz (Liang et al., NTU):**
  - GaussStones are neodymium magnets in galvanized steel shields, read by a Hall-sensor grid (GaussSense, 32x32) mounted behind the display. Identity comes from polarity, strength and field shape.
  - Knobs are made from multiple cores: ID is read from the rank of signal strengths, and orientation from the vector between centroid and strongest core. Stacks are recognized up to two layers.
  - MagGetz uses the device's built-in magnetometer, needs calibration, and requires fixed widget positions.
  - The authors suggest combining a conductive movable part with a magnetic ID part on capacitive screens, since the two do not interfere. This was untested.
  - Source: [GaussStones UIST 2014 PDF](https://graphics.cmlab.csie.ntu.edu.tw/~robin/docs/uist14.pdf)

### Inferences
- Board's Glyph-plus-ML approach is a learned version of TUIC-2D or CapCodes constellations, so we can't author new IDs. The literature's mechanical-state tricks map onto Board in two ways:
  - (a) **Finger-level encoding (works now):** A widget presents 1 to N fingertip-like pads that switch on and off or move, and our game logic decodes them, like Clip-on Gadgets or DuoTouch. Two caveats: these pads probably only register while a hand is touching the widget's conductive grip, and Board may filter or merge closely spaced pads.
  - (b) **Glyph-level state (works only by moving official parts):** A mechanism lifts, rotates or swaps which official piece or base touches the glass. Examples: a turntable that rotates an official piece (changing reported orientation, which acts as a dial for free), a drawer or carousel that drops one of several official pieces onto the glass (a selector), or a plunger that lifts an official piece off the glass (a button: Glyph present or absent). This keeps ML recognition intact because the glass only ever sees genuine Glyphs.
- **Rotation as a dial (strongest finding for Board):** Board already reports orientation to about 1 degree. A printed knob housing that holds an official piece and lets the child rotate it gives a precise analog dial with zero electronics. This is like ZebraWidgets dials, where the ID pattern's orientation is the value.
- **Stacking à la CapStones and ZebraWidgets:** Stacked conductive parts increase capacitance and pass contacts downward. On Board, a printed conductive cap on an official piece might strengthen its signal, but it might also confuse the Glyph classifier. Test before relying on it.
- Magnetic approaches (GaussBits, MagGetz) are not applicable: Board has no Hall grid, and nothing indicates a usable magnetometer.

### Gaps
- **Not found or not retrieved:** CapTUI, Rotoscope (searches returned only rotary-knob patents), Jansen et al. "tangible remote controllers" / "SLAP widgets", and the detailed TouchCode paper. I have no verified details on them.
- **Rotary knob patents** (e.g., US11853492B2 "Rotary control input device for a capacitive touch screen") exist, but I did not read them. — [Google Patents US11853492](https://patents.google.com/patent/US11853492)
- **Board-specific unknowns:** whether Board merges or filters Finger contacts closer than about 15 mm, and whether more than 10 simultaneous Finger contacts are allowed. The docs say there is no artificial limit on contacts. — [Board Concepts](https://docs.dev.board.fun/learn/concepts)

---

## 3. Mechanical dials, sliders and buttons that change the conductive pattern

### Takeaway
There are three proven passive mechanisms:
1. **Switch-to-ground:** a button connects a pad to the user's hand (Clip-on Gadgets). This gives the press as a touch at a fixed location.
2. **Moving conductor over coded traces:** a slider or dial sweeps a grounded contact across patterned traces, read as on/off sequences at 1-2 pads (DuoTouch quadrature, ExtensionSticker strip arrays).
3. **Rotating ID pattern:** a whole asymmetric pad pattern rotates, and its orientation is the value (ZebraWidgets dials). Board's own orientation output can do this with official pieces.

Spring contacts, conductive rubber, and zebra strips make the contacts.

### Cited Findings
- Clip-on Gadgets buttons use conductive rubber that links the finger to a dedicated screen tack when pressed. The D-pad distinguishes buttons by contact spacing ratios. — [Clip-on Gadgets](https://core.ac.uk/download/357520689.pdf)
- ZebraWidgets dials: the 4-contact ID pattern rotates, and the rotation is read as the value. Zebra rubber passes signals from stacked widgets through. — [CapStones/ZebraWidgets](https://hcie.csail.mit.edu/research/capstones/capstones.html)
- DuoTouch:
  - Quadrature (phase-shifted) traces under 2 footprints give direction and step count for sliders and knobs. Binary-coded traces give discrete commands.
  - One footprint pair can serve several mechanisms if only one moves at a time.
  - Resolution is Δd = L_seq/2, with speed bounded by trace width × sampling rate.
  - The moving part's conductive 3D-printed element connects the finger to the traces.
  - Source: [DuoTouch](https://arxiv.org/html/2602.17961)
- CapStones' internal wiring routes the user connector to selected contacts, and the number of active contacts encodes the stack. — [CapStones](https://hcie.csail.mit.edu/research/capstones/capstones.html)
- TUIC-hybrid uses a pressure switch to activate when the object is set down. The Slap-on calculator's switches change ID frequency, but this is powered. — [TUIC thesis](https://tdr.lib.ntu.edu.tw/bitstream/123456789/10175/1/ntu-100-1.pdf)
- LightTouch uses an LDR so the screen itself can "press" a gadget's touch point by changing brightness. This is passive but needs a component. — [LightTouch](https://sites.google.com/view/ikema2/research-project/lighttouch)
- Commercial: WWE Rumblers Apptivity figures add action buttons on top of rubber touch points. — [New Atlas](https://newatlas.com/apptivity-ipad-toys/23995/)

### Inferences (design patterns for Board)
- **A. Grounded-button pad (Finger contact):** A printed plunger with a conductive-filament or copper-tape column and a 10 mm conductive foot. A spring holds it about 1-2 mm off the glass, and pressing touches the glass while the finger contacts the conductive column. The game sees a Finger tap at a known offset from a nearby official piece. Works wherever Board accepts Finger touches. No ML involvement.
- **B. Switch that bridges hand to an always-down pad:** The pad rests on the glass, but its path to the hand is open until a button closes it with a spring contact or conductive foam. Because untouched pads tend to vanish (Q1), the "unpressed" state reads as absent and "pressed" as present. Small pads that stay down avoid lift-off scraping.
- **C. Turntable or knob around an official piece:** The shell is fixed to the official piece's base. An outer ring the child turns rotates the piece, and the game reads Glyph orientation. This gives a detented dial and keeps Glyph identity.
- **D. Selector or carousel:** A housing holds 2-4 official pieces. A lever lowers one onto the glass, and Glyph ID becomes the selected state. Costly in official pieces.
- **E. Lift-off button:** A plunger raises an official piece a few mm off the glass. The Glyph disappears, and the Ended phase becomes a button event. Latency depends on how quickly Board reports Ended. Risk: it is indistinguishable from the piece being removed, which is acceptable if game logic expects it.
- **F. DuoTouch-style slider:** Two 8-10 mm pads, a printed track with conductive and insulating segments, and a slider with a spring contact the finger touches. The game decodes the quadrature sequence from two Finger contacts toggling. This is the most complex and needs Board to report rapid touch on/off at fixed points without filtering.

### Gaps
- No source tests any of these mechanisms on Board. Patterns A-F are untested design inferences.
- DuoTouch did not evaluate conductive-filament traces, only PCB. Filament-only sliders are unproven.

---

## 4. 3D printing with conductive filament and other conductors

### Takeaway
Use Proto-pasta Conductive PLA, the default choice. It is easy to print, and its resistivity of about 30 Ω·cm printed in XY is low enough for capacitive touch (published 3-point markers worked on iPad), though it is far from copper. Electrifi (copper composite, about 0.006 Ω·cm) is much more conductive but hard to print: 140-180°C, slow, direct-drive only, not AMS-compatible. Black Magic graphene PLA is about 1 Ω·cm. Conductive TPU tested poorly (about 16 MΩ). Practical hybrid options are copper tape embedded mid-print, aluminum foil, silver or conductive paint in engraved pockets, and conductive rubber or silicone nibs for the screen-contact surface. Keep the conductor directly at the glass, since even 0.3-0.5 mm of plastic badly hurts untouched detection. Make pads about 10 mm.

### Cited Findings
- **Proto-pasta Conductive PLA:**
  - Volume resistivity: molded resin 15 Ω·cm; printed along layers (XY) 30 Ω·cm; printed across layers (Z) 115 Ω·cm.
  - 10 cm of 1.75 mm filament measures 2-3 kΩ.
  - Hot end 215-230°C, running hotter for layer adhesion; bed 50°C optional.
  - Proto-pasta explicitly suggests touchscreen interaction as a use.
  - Source: [Proto-pasta](https://proto-pasta.com/pages/conductive-pla)
  - The Inventions study reports Proto-pasta at 1×10¹-1×10² Ω/cm, used with default Cura settings on a dual-extrusion Ultimaker 3 with no post-processing. Small markers took 10-15 min. — [MDPI Inventions 2018](https://www.mdpi.com/2411-5134/3/1/9)
  - A printable stylus design recommends Proto-pasta. — [Printables palm-grip stylus](https://www.printables.com/model/247697-palm-grip-stylus)
- **Multi3D Electrifi:**
  - Volume resistivity typically 0.001-0.1 Ω·cm, with a video measurement of about 0.006 Ω·cm. Copper-polymer composite, somewhat flexible.
  - Nozzle 140-180°C; bed ≤50°C; speed 10-30 mm/s.
  - Direct drive strongly recommended. Not compatible with AMS or multi-material systems. Minimal retraction. Nozzle 0.6 mm or larger preferred.
  - Electrical performance depends on geometry and contact pressure.
  - Source: [Filament2Print Electrifi listing](https://filament2print.com/en/advanced/4451-conductive-filament-electrifi.html)
- **Black Magic 3D graphene PLA:** Volume resistivity 1 Ω·cm, printing around 170-175°C with a heated bed. Capacitive touch sensors are a cited use. — [3DPrint.com](https://3dprint.com/51502/black-magic-3d-graphene/)
- **Conductive TPU:** One Hackaday test measured about 16 MΩ, barely conductive and unusable as a flexible connector. Proto-pasta PLA worked but is rigid. Brand unnamed. — [Hackaday 2025](https://hackaday.com/2025/03/15/putting-conductive-tpu-to-the-test)
- **NinjaTek Eel:** A conductive flexible filament exists. Its resistivity figures were not retrieved. — [NinjaTek Eel](https://ninjatek.com/eel/)
- **Carbon ABS (Capricate):**
  - Resistivity about 8 Ω·mm nominal (4.4 aligned, 8.2 perpendicular, 10.0 vertical).
  - Print traces along the current direction. Keep wire resistance ≤30 kΩ, since SNR drops below 5:1 above that.
  - Traces at least 4 × 0.8 mm wide. Electrodes at least 0.2 mm thick. Flat subsurface electrodes work under overlays up to 10 mm (for their own sensing, not a touchscreen).
  - Dual extrusion: 230°C, 0.8 mm nozzle, fan off. Each tool change used retract, Z-lift, cooling the idle nozzle, and a purge tower, taking about 40 s per switch.
  - Source: [Capricate PDF](https://mschmitz.org/publications/schmitz-UIST15-capricate.pdf)
- **PrintPut (Queen's HML, INTERACT 2015):** Dual-extruded conductive ABS buttons, sliders, touchpads and bend sensors read by Arduino. — [PrintPut](https://hml.cs.ru.nl/blog/printput)
- **Embedding copper tape:** Pause the print about 3 layers in, lay copper tape, and resume. Here the copper sits about 0.6 mm below the surface, for MCU touch sensing (not a touchscreen). — [Hackaday 2025](https://hackaday.com/2025/08/20/hide-capacitive-touch-buttons-in-your-next-3d-print)
- **Laser-cut acrylic with conductive silver varnish (Kemo L 100) in engraved pads:** Worked on iPad. A thin coated layer remains. — [MDPI Inventions](https://www.mdpi.com/2411-5134/3/1/9)
- **Conductive salt dough:** Works, but dries out over days. Glycerol or oil slows this. — [MDPI Inventions](https://www.mdpi.com/2411-5134/3/1/9)
- **Conductive foam:** Blagojevic et al.'s best conductive tool design filled drilled holes with conductive foam. — [TouchTokens related work](https://www.lri.fr/~anab/teaching/evaluation/papers/touchtokens.pdf)
- **Conductive rubber:** Clip-on Gadgets used conductive rubber for buttons and foam on the clip edge. Apptivity figures have "rubber touch points" on the base. — [Clip-on Gadgets](https://core.ac.uk/download/357520689.pdf); [New Atlas](https://newatlas.com/apptivity-ipad-toys/23995/)

### Inferences
- **For a family printer:**
  - Single-extruder printers can still make good tokens. Print the shell in PLA or PETG and the contact core in Proto-pasta as a separate part, then press-fit or glue them. Or use a filament-swap pause at a layer.
  - A multi-material AMS-style printer can co-print Proto-pasta, but Electrifi is explicitly incompatible with AMS. Proto-pasta is abrasive-ish carbon-filled material, so a hardened nozzle is prudent; this is a general practice claim and was not sourced here.
- **Pad recommendations:**
  - Size: about 10 mm diameter. The 5 mm pads failed on one tablet, while Clip-on Gadgets' 5 mm tacks worked on iPad.
  - Spacing: center spacing of at least 15-20 mm for independent points.
  - Bridges: bridges between pads more than 1 mm thick and raised about 1 mm above the glass, so only the pads touch.
  - Surface: pads flush, with conductive material on the bottom face (no PLA skin). In the slicer, ensure the bottom layers of the pad region are conductive filament.
- **Durability and screen safety:**
  - Proto-pasta and PLA are hard. Their print texture may scuff glass, so first-layer smoothing or ironing helps.
  - A thin conductive fabric, conductive silicone or rubber nib (as on commercial stylus tips), or a felt pad with conductive thread can soften contact. Insulating felt or TPU must NOT sit under a conductive pad, because 0.3-0.5 mm of insulation kills untouched detection and degrades touched detection.
  - Put felt or TPU only on the non-sensing rim to protect glass and add grip.
  - These protective-material points are inferences: no source measured scratch behavior.
- **Grip continuity:** The hand must reach the pad through a low-resistance path. Proto-pasta columns (a few kΩ) are fine for touched use, given that Capricate's limit for its own sensing was 30 kΩ. Copper tape or foil running from the grip to the pad is the most reliable.

### Gaps
- No source directly tests Electrifi or Black Magic on capacitive touchscreens, or compares them against Proto-pasta for untouched detection.
- I found no screen-scratch or wear data for conductive PLA on glass.
- I did not retrieve resistivity data for conductive silicone nibs or conductive paint (Bare Conductive).

---

## 5. Commercial capacitive toy pieces

### Takeaway
The commercial wave (2011-2015) used exactly the TUIC and CapCodes approach: plastic pieces with conductive or "capacitive plastic" or rubber feet arranged in unique constellations, usually requiring a hand touch. Examples are Hasbro zAPPed, Mattel Apptivity, Disney Appmates and SnowShoe stamps. Osmo is not capacitive; it uses the camera with a reflector.

### Cited Findings
- **Hasbro zAPPed (2012, Battleship, Monopoly, Game of Life):** Pieces have capacitive plastic pads in unique patterns underneath. In Battleship each ship type has a different arrangement, and Monopoly debit cards are distinguished by pattern and swiped across the screen. Hasbro partnered with Volumique. — [Engadget hands-on](https://www.engadget.com/2012-02-12-zapped-board-games-hands-on.html); [Hasbro/Volumique press release](https://investor.hasbro.com/news-releases/news-release-details/hasbro-links-french-company-volumique-create-highly-innovative)
- **Mattel Apptivity (Hot Wheels, WWE Rumblers, Cut the Rope Om Nom):** "Rubber touch points on the base" unlock content and act like a finger as the toy is moved. Rumblers add action buttons. — [New Atlas](https://newatlas.com/apptivity-ipad-toys/23995/)
- **Disney Appmates (2011, Cars):** Car toys driven on the iPad screen. Mechanism details were not retrieved. — [Engadget](https://www.engadget.com/2011-09-27-disney-to-pair-ipad-physical-toys-with-new-games.html)
- **SnowShoe stamps (2015):** 3D-printed plastic mixing conductive and non-conductive materials, with no electronics. They appear as "a certain number of human fingertips… in a very precise configuration". Readable via web browser. — [TechCrunch](https://techcrunch.com/2015/04/22/backed-by-3-5-million-snowshoe-debuts-clever-plastic-stamps-that-unlock-content-on-mobile-phones)
- **Patents on capacitive toys exist**, e.g., "Toys with capacitive touch features" and "Children's toys with capacitive touch interactivity". — [US11182030B2](https://patents.google.com/patent/US11182030); [US10901560B2](https://patents.google.com/patent/US10901560)
- **Interactive stamp set for children (Educo "Shape Together"):** Exists. Mechanism details were not retrieved. — [Educo](https://www.educo.com/en/shape-together-l-interactive-stamp-set-l-educo/product/5445)
- **Osmo:** Uses the device camera with a reflector adapter to see pieces, not capacitive sensing. Support pages attribute detection issues to camera and reflector setup. — [Osmo support: reflector](https://tangibleplay.freshdesk.com/support/solutions/articles/68000000795-why-are-the-game-pieces-not-detected-when-i-m-using-the-osmo-reflector-adapter-); [Osmo support: camera](https://tangibleplay.freshdesk.com/support/solutions/articles/68000000530-why-does-osmo-need-access-to-the-camera-on-my-device-)

### Inferences
- SnowShoe proves that consumer-grade 3D-printed multi-material conductive stamps can carry identity via constellation on phones. On Board, a similar stamp would likely show up as several Finger or Blob contacts, not as a Glyph. Our own game code could decode the constellation geometry TouchTokens-style (centroid plus template match, about 100 lines). This is a viable "custom ID" path that bypasses the ML model, as long as Board passes Finger contacts with good positions and does not palm-filter the stamp.
- Hot Wheels/Apptivity-style "drive the car" play maps naturally onto conductive-footed shells moved by hand.

### Gaps
- I found no teardown data on Appmates, Apptivity or zAPPed foot dimensions or materials beyond "rubber" or "capacitive plastic".
- Bandai and Nintendo touch toys: no relevant sources were found in this pass.

---

## 6. Light-pipe tricks: translucent pieces that let the display shine through

### Takeaway
The prior art is Transporters (optical fibers plus conductive wires, carrying both display image and touch up through a widget), Lumino (glass fiber bundles, optical only), and PUCs (fully transparent capacitive widgets detectable untouched). For a hobbyist, clear PETG or resin "gems" or lenses over a hole in the piece let the screen color an object. If a conductive path is needed for touch, run it around the window (a ring) rather than through it.

### Cited Findings
- Transporters carry display output from base to top surface via optical fibers. Thin conductive wires carry touch from the top surface to the screen, and the two channels can be remapped independently. — [Transporters (RWTH)](https://hci.rwth-aachen.de/transporter)
- Lumino's glass fiber bundles relay and shrink images through stacked blocks to the table surface. — [Lumino (HPI)](https://hpi.de/baudisch/projects/lumino.html)
- PUCs can be "fully transparent" and are detected untouched on unmodified displays. — [PUCs](https://hci.rwth-aachen.de/pucs)
- A transparent capacitive-screen button patent exists ("Transparent button for capacitive touch screen", US 2019/0272053). I did not read it. — [Justia](https://patents.justia.com/patent/20190272053)
- LightTouch uses display light as a signal into the gadget (via an LDR), the reverse direction of a light pipe. — [LightTouch](https://sites.google.com/view/ikema2/research-project/lighttouch)

### Inferences
- **Board game ideas:**
  - A piece with a clear core shows game-driven color (team color, health, glow) at Board's 92.6 px/inch.
  - Board knows each Glyph's position and orientation, so the game can draw an image exactly under a shell's window that follows the piece.
  - The official Glyph base must remain unobstructed. A window is only possible in shell areas that overhang the screen beyond the official base, or in a printed "sidecar" next to the piece.
  - For fiber-optic effects, side-glow or end-glow PMMA fiber bundles (craft supply) could channel light up a tall topper. This is Transporters-style but optical only.
- **Printing clear parts:**
  - FDM clear PETG is translucent, not optically clear.
  - Resin (SLA) prints or cast epoxy give real lenses. A flat polished bottom face against the glass improves light coupling.
  - Clear plastic itself is invisible to touch, so it won't create phantom touches; it only affects the field if it is thick, per the Trebbin observation.
  - These are inferences, not sourced tests.

### Gaps
- I did not retrieve detailed construction or fiber specs for Transporters or PUCs.
- I found no hobbyist projects quantifying light-pipe brightness from an LCD through printed parts.

---

## Summary matrix: what works with Board's ML Glyph system vs. appears as plain touches (inference, built from findings above)

| Technique | Board sees | Identity/rotation | Mechanical state | Hobbyist practicality |
|---|---|---|---|---|
| Shell or topper over official piece, with conductive grip path | Glyph (ML) | Yes (official ID, 1° rotation) | Rotation via turntable/knob housing | High: PLA shell + Proto-pasta or copper strip |
| Housing that lifts/lowers or swaps official pieces | Glyph appears/disappears | Yes | Button (lift), selector (carousel) | Medium: needs extra official pieces |
| Conductive-filament constellation stamp (SnowShoe/TouchTokens/CapCodes style) | Multiple Finger/Blob contacts, likely only while touched | Custom ID decoded in our code, if Board passes Finger positions | Pads switched by buttons | Medium-high: dual extrusion or press-fit cores; 10 mm pads, ≥15-20 mm spacing |
| Clip-on-style grounded buttons | Finger tap at fixed point | No (location-based) | Buttons | High |
| DuoTouch-style coded slider/knob | Two Finger contacts toggling | No | Slider/dial via quadrature | Low-medium: precise contacts; filament version unproven |
| Single conductive token (coin, wall) | Blob/Finger, probably only touched | Position only | n/a | High; untouched detection uncertain |
| Light-pipe window or gem | Nothing (optical) | n/a | Display-driven visuals | High with resin; medium with FDM |
| Magnetic (GaussBits/MagGetz) | Nothing | n/a | n/a | Not applicable to Board |

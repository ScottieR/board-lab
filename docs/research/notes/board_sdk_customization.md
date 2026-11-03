# Board console developer platform: piece and control customizability (as of Nov 2, 2026)

Sources used: docs.dev.board.fun (Pieces, Hardware, Concepts, Touch System, Touch guide, Piece Interaction Design, FAQ, License, Game Submissions, Unity Setup Reference, Unity Simulator, Unity changelog, Godot Setup Reference, Godot changelog, Web API reference), the npm package @board.fun/web-sdk 1.0.0-beta.6 (AGENTS.md, types.d.ts, input.d.ts, CHANGELOG.md, LICENSE, downloaded and read directly), the live model manifest at dev.board.fun/downloads/models/manifest.json, board.fun product/create/games pages, Board help center, the HN launch thread, and press (TechCrunch, BoardGameWire, Pulse 2.0, Wargamer).

## 1. Can developers create genuinely new recognizable pieces? What do the docs say about custom pieces, glyphs, and new models?

### Takeaway
No, not today. Developers can only use Board's existing Piece Sets and their prebuilt .tflite models. There is no tool for authoring glyphs or training models. Two routes to new pieces exist: (a) propose a custom Piece Set when you submit a game, which Board would manufacture with you, and (b) "Board Studio", announced as an AI tool for making custom pieces but not shipped as of these sources. The HN thread has one informal team comment saying homemade multi-material 3D-printed pieces are possible but "pretty finicky". Even then, a homemade piece is only recognized as a Glyph if it matches a pattern in one of the existing trained models.

### Cited Findings
- FAQ, "Will I be able to make new Pieces for my game?": currently you can only use existing Pieces and models. When submitting a game for review, you can propose a custom Piece Set, which would be manufactured in collaboration with Board. Board Studio will later let users create custom Pieces using AI tools. — [Board FAQ](https://docs.dev.board.fun/faq)
- FAQ, "Can I build with any combination of the 49 Pieces?": "Not currently." Available Piece models are listed on the Developer Portal, and more will be added. — [Board FAQ](https://docs.dev.board.fun/faq)
- FAQ: Board Studio, a no-code-style creation tool for games and custom Pieces, is "planned for later this year". — [Board FAQ](https://docs.dev.board.fun/faq)
- Create page: Board Studio will let people "build their own games and custom pieces for Board" "using natural language prompts and AI-powered tools." — [board.fun/pages/create](https://board.fun/pages/create)
- Series A coverage (June 2026): Board Studio, an AI-powered platform expected later in 2026, will let users build games and "custom game pieces". Board also plans to expand into accessories and "collectible special-edition pieces". — [Pulse 2.0](https://pulse2.com/board-raises-20-million-series-a-to-build-the-future-of-face-to-face-gaming-and-creation/); [BoardGameWire, Jun 3 2026](https://boardgamewire.com/?p=6709) (says "AI platform later this year", idea to playable prototype in under an hour)
- Game Submissions: for select titles, Board "may pursue a deeper publishing partnership", which could include "game-specific Pieces, revenue share, development funding, or acquisition." — [Game Submissions](https://docs.dev.board.fun/game-submissions)
- HN, Board team member nicoles: "It's possible to make your own pieces with a multi-material 3d printer". She said early prototypes used Bambu printers and that it's "pretty finicky". She also said "we'd love to work with you to make a bespoke set of pieces to go with the game" for store games, and "The piece sets can be used as is for new games/apps, especially for prototyping!" — [HN thread mirror](https://hn.svelte.dev/item/45742456)
- HN, ryanmeasel (Board): "It is not a requirement to provide a conductive path to the person though." In other words, a piece does not need a conductive body to be detected. — [HN thread mirror](https://hn.svelte.dev/item/45742456)
- Concepts: a Model is the .tflite file "trained for its matching set and named after the game it belongs to." — [Concepts](https://docs.dev.board.fun/learn/concepts)
- Godot setup: "A Piece Set Model is a TensorFlow Lite .tflite file" used "to classify Glyph patterns." "The SDK ships none — Piece Sets are game-specific." — [Godot Setup Reference](https://docs.dev.board.fun/godot/getting-started/setup-reference)
- Web SDK AGENTS.md: the model is "obtained out of band" from the portal. "web-pack rejects a bundle with none." It is "never bundled by tooling and never fetched at runtime." — @board.fun/web-sdk 1.0.0-beta.6 AGENTS.md ([npm](https://www.npmjs.com/package/@board.fun/web-sdk))
- License: the SDK is "designed exclusively to be run on Board through the use of our existing pieces sets." It also bars reverse engineering and "create a derivative work of any part of the SDK." — [Developer Terms](https://docs.dev.board.fun/more/license)

### Inferences
- Recognition is a closed-set classifier. Each model can only output glyph IDs for the patterns it was trained on. A homemade piece only works if it copies the glyph geometry of an existing piece, so it would be a clone or replacement, not a new identity. Nothing documented lets you add a class. This inference comes from the "trained together", "classify Glyph patterns" and one-model-per-set wording.
- Whether retraining or editing a .tflite model counts as an SDK "derivative work" is not spelled out. The models are downloaded from the developer portal next to the SDK, though, and the license's "existing pieces sets" wording points against making custom models.
- The realistic routes are: (1) wrap 3D-printed toppers or shells around existing pieces (Board Bases are the official example of this pattern, see section 2), (2) pitch a custom set through submission, or (3) wait for Board Studio.

### Gaps
- No public spec for glyph geometry, conductive material or manufacturing tolerances.
- The Discord could not be searched, and no Reddit or GitHub posts on homemade glyph pieces turned up.
- Board Studio's launch status as of Nov 2026 is unconfirmed. Sources from June 2026 say "later this year".

## 2. What is "Board Bases"? Which piece sets and models exist, and how many glyph IDs does each have?

### Takeaway
Board Bases are generic glyph bases for standard 25mm miniatures. They ship 6 to a box with the Board Tabletop (Foundry VTT) beta and have their own Piece Set Model (board_bases v0.3.2). That makes them the official "attach your own figure to a recognized base" mechanism, and the best fit for 3D-printed toppers. The portal manifest lists 10 models. No official source publishes glyph-ID-to-piece mappings or per-set counts. The docs say to find each ID by placing pieces one at a time and logging them.

### Cited Findings
- Live manifest at dev.board.fun/downloads/models/manifest.json (fetched Nov 2026). Model, version, filename:
  - Board Arcade 1.3.7, arcade_v1.3.7.tflite
  - Board Bases 0.3.2, board_bases_v0.3.2.tflite (1.57 MB; the others are about 0.57 to 0.98 MB)
  - Chop Chop 1.3.0
  - Heist 0.3.0
  - Mushka 1.3.1
  - Omakase 1.3.2
  - Save the Bloogs 1.3.2
  - Thrasos 2.4.3
  - Chop Chop + Mushka 1.0.0
  - Thrasos + Arcade 1.0.2
  - Source: [manifest.json](https://dev.board.fun/downloads/models/manifest.json)
- Board Tabletop product page: Board Bases "transform your minis into interactive pieces". "Attach your figure to a Board Base, drop it on the screen, and Board can identify and track each base." The beta bundle "includes the Game + 6 Bases". "Board Bases work with any standard 25mm miniature." The page gives no attachment method and no developer terms for Bases. — [Board Tabletop](https://board.fun/products/board-tabletop)
- Wargamer (Feb 2026), before Tabletop launched, speculated about "glyph-enhanced base converters" for D&D minis and quoted the site line "Use your own maps with Board's piece tracking built in." — [Wargamer](https://www.wargamer.com/dnd/virtual-tabletop-on-board)
- Glyph ID is the piece's index within its Piece Set. Unity uses 0-based piece IDs with fingers at -1. Godot and Web use 1-based IDs with fingers at 0. "Find each piece's ID by placing one at a time and logging it." — [Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design); [Touch guide](https://docs.dev.board.fun/guides/touch-input)
- Web SDK: "The SDK never names pieces — Glyph IDs are integers and the taxonomy is game-specific, so your game owns its own name table." — AGENTS.md, @board.fun/web-sdk 1.0.0-beta.6
- The FAQ refers to "the 49 Pieces" that ship with Board. TechCrunch at launch reported "12 launch games and 50 game pieces". — [FAQ](https://docs.dev.board.fun/faq); [TechCrunch, Oct 28 2025](https://techcrunch.com/2025/10/28/mirrors-founder-is-back-with-a-new-connected-screen-startup-a-gaming-device-called-board)
- Retail pieces per game: Chop Chop has knives, spoons, a mill and a sponge. Save the Bloogs has cannons, stairs, a shapeshifter ring and blocks. Mushka has a toy bag, brush and wand. Omakase has chopsticks. Board Arcade has spaceships and robots. Spycraft has a "Spy Kit". Image filenames suggest the Arcade, Ships and Robots sets are shared across several arcade titles. — [board.fun/pages/games](https://board.fun/pages/games)
- Help center: "Each new game comes with its own piece set"; "Your Board ships with 7 exclusive games and 2 custom piece sets." — [Help center: Games and pieces](https://board.gorgias.help/en-US/articles/games-and-pieces-318768)
- Unity 3.3.0 (Apr 3 2026) added simulator icon sets for the Omakase and Thrasos piece sets and a "Contact type and Glyph ID overlay". — [Unity changelog](https://docs.dev.board.fun/unity/changelog)
- "Only one Piece Set can be active at a time." Combined models (Chop Chop + Mushka, Thrasos + Arcade) exist, and the FAQ says sets "may expand or combine over time." — [Pieces](https://docs.dev.board.fun/learn/pieces); [FAQ](https://docs.dev.board.fun/faq)

### Inferences
- The Board Bases model's version (0.3.x) and larger file size fit a newer or beta set, possibly with more classes. Because the Bases are meant to sit under arbitrary figures, they are the official way to put custom 3D-printed shapes on Board. A game targeting the Board Bases model can make any topper recognizable, limited to the number of distinct Bases (6 in the bundle).
- Combined models are how one game can use pieces from two retail sets.

### Gaps
- Glyph ID counts and mappings per set are not published in the pages fetched. The Unity simulator icon assets for Omakase and Thrasos probably carry names and IDs, but the docs page doesn't list them. You'd need to inspect the Unity package or log each piece on hardware.
- Whether Board Bases are sold separately, how many distinct glyphs the Bases model knows (it could be more than 6), and how figures attach are all undocumented.
- The developer portal UI (dev.board.fun) is a JS app and its content couldn't be read. The manifest JSON was the only source.

## 3. Every customization lever in the SDK

### Takeaway
Developers control how they interpret contacts: smoothing, persistence, model choice, and their own gesture logic on top of per-frame snapshots. They also configure OS-level services: AI player types, the pause menu, saves, avatars and the profile switcher. They cannot change recognition itself.

### Cited Findings
- **Input settings (Unity BoardInputSettings):** Piece Set Model (.tflite), Translation Smoothing (0–1), Rotation Smoothing (0–1), and Persistence ("How long Pieces remain tracked after losing contact"). Multiple settings assets can be switched at runtime. "Load Available Models" / "Select" downloads into StreamingAssets. `glyphModelFilename` was renamed `pieceSetModelFilename` in 3.2.0. — [Unity Setup Reference](https://docs.dev.board.fun/unity/getting-started/setup-reference); [Unity changelog](https://docs.dev.board.fun/unity/changelog)
- The FAQ confirms that "translation, rotation smoothing, and Piece persistence can be tuned." — [FAQ](https://docs.dev.board.fun/faq)
- **Godot:** `Board.input.activate(model_path)`, then `subscribe()`. Models are installed with `install_models.sh --list/--name/--all` from the manifest. The Godot pages fetched don't document smoothing settings. — [Godot Setup Reference](https://docs.dev.board.fun/godot/getting-started/setup-reference)
- **Web:** `Board.input.subscribe/unsubscribe/getContacts/getContactsByType`. The model is passed at pack time (`web-pack ... --model model.tflite`). The Web SDK type definitions expose no smoothing or persistence settings. — @board.fun/web-sdk 1.0.0-beta.6 input.d.ts and AGENTS.md
- **Contact data:** contactId, x, y, orientation, type, phase (None/Began/Moved/Ended/Canceled/Stationary), glyphId, isTouched. Snapshots arrive at about 60 fps and games diff them for edges. All contacts are Canceled when the pause screen opens. Unity is bottom-left / Y-up / radians. Godot and Web are top-left / Y-down / degrees. — web-sdk types.d.ts; [Touch guide](https://docs.dev.board.fun/guides/touch-input)
- **Interaction primitives (design conventions, not APIs):** Place/Lift, Slide, Trace, Shake, Rotate, Twist, and Touch-and-Release. Piece categories are Pawn, Action and Reaction. — [Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design)
- **AI player types:** `SetAIPlayerTypes()` (Unity 3.3.0) / `setAIPlayerTypes(types)` (Web), with each type given a name and description. They appear in the OS player selector. `presentAddPlayer(aiTypeIndices?)` can limit the choices. — [Unity changelog](https://docs.dev.board.fun/unity/changelog); [Godot changelog](https://docs.dev.board.fun/godot/changelog); web-sdk types.d.ts
- **Session/roster:** the roster is OS-owned. Use `presentAddPlayer`, `presentReplacePlayer`, `addGuest`, `removePlayer`, `resetPlayers`, `getActiveProfile`. Player types are Profile, Guest and AI. "A game can't silently change who's playing." — web-sdk AGENTS.md
- **Pause menu:** `setContext({gameId, gameName, offerSaveOption, customButtons[{id,title,icon}], audioTracks[{id,name,value 0-100}]})`. The icon must be one of "circulararrow", "doorwitharrow", "leftarrow", "square" or "". Results come back as resume, quit, save_and_quit or custom_button, along with slider values. — web-sdk types.d.ts
- **Save games:** create, load, list and update an opaque payload with a cover image, played time and game version. Storage info and maximum data, app storage and description sizes are available. There is no direct delete; the game removes players and the OS deletes the save once none remain. — web-sdk AGENTS.md
- **Avatars:** `loadPNG`, `getDefault`, `forPlayer`, `clearCache`. Avatars are cached data URIs, and games can't create avatars. — web-sdk AGENTS.md
- **Application:** `quit()`, `showProfileSwitcher()`, `hideProfileSwitcher()`. — web-sdk AGENTS.md
- **Unity Simulator:** you can create custom icons via Create > Board > Simulation > Icon, setting Display Name, Contact Type (Finger/Glyph), Glyph ID, Sprite, Size and alpha hit threshold. The palette can be switched by name in code (3.1.0), and input mappings can be remapped via an Input Actions asset. — [Unity Simulator](https://docs.dev.board.fun/unity/simulator); [Unity changelog](https://docs.dev.board.fun/unity/changelog)
- **Web SDK versions:** 1.0.0-beta.1 through beta.6, released Jun 2–12, 2026. The changes since beta.1 cover pause fixes and README and metadata updates. The minimum is Board OS 1.10.0. The API is "append-only", and games must not gate on version numbers. — web-sdk CHANGELOG.md / AGENTS.md
- **Godot:** 1.0.0-beta.1 (May 26, 2026) adds AI type filtering, a cached avatar loader and get_app_storage_info. — [Godot changelog](https://docs.dev.board.fun/godot/changelog)

### Inferences
- The simulator's custom icons only let you simulate any glyph ID; they do not create a recognizable physical piece. They are still useful for designing around a hypothetical custom set before pitching it.
- Smoothing and persistence seem to be exposed only in Unity. Web and Godot developers probably smooth contacts themselves.

### Gaps
- Default values for smoothing and persistence are not documented on the pages fetched.

## 4. Blob contacts, and whether a custom conductive object can act as an anonymous token

### Takeaway
Blob is documented only as "an unclassified contact blob (neither a recognized finger nor a glyph)". It appears in the Web, Godot and Unity enums, but the conceptual docs (Concepts, Touch System) list only Finger and Glyph. Nothing documents Blob size, shape, position accuracy or orientation (orientation is "only meaningful for Glyph contacts"). Using a conductive object as an anonymous Blob token may be possible, but that is inference only and untested here.

### Cited Findings
- `Blob = 2`: "An unclassified contact blob (neither a recognized finger nor a glyph)." Finger: "glyphId will be 0." Orientation: "Only meaningful for Glyph contacts." — @board.fun/web-sdk types.d.ts
- The Web API reference lists Blob as an enum value but gives no description. — [Web API Reference](https://docs.dev.board.fun/web/reference/api)
- The Concepts and Touch System pages list only Finger and Glyph contact types. — [Concepts](https://docs.dev.board.fun/learn/concepts); [Touch System](https://docs.dev.board.fun/learn/touch-system)
- Palm and forearm rejection "happens at the hardware level," and the system "resolves overlapping contacts." Board's AI filters out unintentional contact. The Canceled phase is used e.g. for palm rejection. — [Touch System](https://docs.dev.board.fun/learn/touch-system); [FAQ](https://docs.dev.board.fun/faq); web-sdk types.d.ts

### Inferences
- A Blob is probably any capacitive footprint the model can't classify, such as a conductive coin, a foil-wrapped base or a misread piece. A game could treat Blobs as anonymous position-only tokens, but there are risks. A Blob gives no identity and no orientation. Palm and unintentional-contact filtering may suppress it, especially if it's large or ungrounded. Behavior may also change between OS or model versions, since Blob is undocumented in the conceptual docs. Test on hardware before relying on it.
- An ungrounded passive conductor may not register at all. Retail pieces register whether touched or not, but they use engineered glyph patterns.

### Gaps
- There are no published limits on contact size or shape, or on how Blobs are emitted.

## 5. Physical constraints: stacking, mechanical pieces, size, materials, sensor specs

### Takeaway
The documentation is thin here. Pieces are passive, made from "a blend of plastic and conductive material", and need no conductive body (touched sensing needs one). The sensor is "optically-bonded, high-resolution capacitive touch" with no artificial contact limit (about 170 Arcade pieces at once), running ML on a dedicated NPU at roughly 60 fps. Stacking, mechanical glyph-changing pieces and size limits are not documented. One retail piece, the Save the Bloogs "shapeshifter ring", hints at a piece that presents different states.

### Cited Findings
- "Pieces are passive and made from a blend of plastic and conductive material." "No batteries, sensors, or electronics." Position near 1920×1080 resolution, orientation to about 1°. — [Pieces](https://docs.dev.board.fun/learn/pieces)
- Touched state: "Some Pieces have a conductive body connected to the Glyph pattern. When a player holds one, their body completes a circuit." "Almost all pieces are capacitive; Strata's blocks never report touched." — [Pieces](https://docs.dev.board.fun/learn/pieces); [Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design)
- Tracking can drop when a piece is moved fast, lifted at an angle or covered by a hand. — [Piece Interaction Design](https://docs.dev.board.fun/guides/piece-interaction-design)
- Sensor: "Optically-bonded, high-resolution capacitive touch", anti-glare coating. No controller model or scan rate is given. — [Hardware](https://docs.dev.board.fun/learn/hardware)
- "No artificial limit on simultaneous contacts", about 170 Board Arcade pieces at once, recognition on a dedicated NPU. — [Touch System](https://docs.dev.board.fun/learn/touch-system)
- Callbacks fire every "inference frame (~60fps)". The SoC is a MediaTek Genio 700 with 4 GB RAM. — web-sdk AGENTS.md / input.d.ts
- HN (nicoles): pieces have "a conductive pattern built into the surface using specialized materials". — [HN thread mirror](https://hn.svelte.dev/item/45742456)
- Submission guidance: "Games are often best with 4-12 Pieces." Don't drop or slam pieces. — [Game Submissions](https://docs.dev.board.fun/game-submissions)
- The Save the Bloogs piece list includes a "shapeshifter ring". — [board.fun/pages/games](https://board.fun/pages/games)

### Inferences
- Stacking is probably unsupported for recognition, since only the bottom glyph touches the screen. A mechanical piece could in principle switch between two glyphs the model already knows, but nothing documents this.

### Gaps
- No minimum or maximum piece size, glyph spacing or materials spec. No capacitive controller part number or scan rate. Not clear what the "shapeshifter ring" does mechanically.

## 6. Developer program terms: selling and distributing games and pieces

### Takeaway
The SDK is free. You own your games and may distribute them on Board (sideload) or on third-party sites like itch.io, owing Harris Hill no revenue share there, but Board can remove them at its discretion. In-game purchases or unlocks of games on Board are barred. Curated outcomes are a free Community Game or a Board publishing deal (possibly with game-specific Pieces and revenue share). The Terms don't mention third-party hardware or pieces, but they tie the SDK to "existing pieces sets" and bar reverse engineering, derivative works and trademark use.

### Cited Findings
- The license is non-exclusive, non-transferable and revocable, covering "Developed Programs" and "Developed Tools". You may distribute on Board and on third-party platforms or your own site, and Harris Hill may remove a game or request its removal. "You are not entitled to pay any revenue share to Harris Hill" on third-party sales. Section 3 bars letting users "purchase, download, unlock or otherwise access games from within any Developed Program" on Board. Harris Hill "may... launch a marketplace". No reverse engineering, no derivative works of the SDK, and no use of Harris Hill trademarks. The SDK is "designed exclusively to be run on Board through the use of our existing pieces sets." Terms last updated June 2, 2026. Delaware law, arbitration. — [Developer Terms](https://docs.dev.board.fun/more/license)
- Outcomes: independent distribution (e.g. itch.io), a Community Game (free in the Board Game Store), or a Board Game publishing partnership. "All games require use of physical Pieces"; the Board must "always" react when a piece is placed. — [Game Submissions](https://docs.dev.board.fun/game-submissions)
- "Board is open for creation and curated for families." The SDK is free and there are no dev kits; any retail Board works. — [FAQ](https://docs.dev.board.fun/faq); [Create](https://board.fun/pages/create)
- The npm LICENSE file reads "All rights reserved", with use governed by the Developer Terms. On HN the team called it "open-source", but the license is proprietary. — @board.fun/web-sdk LICENSE; [HN thread mirror](https://hn.svelte.dev/item/45742456)

### Inferences
- The Terms don't explicitly ban selling 3D-printed toppers or shells for retail pieces. Selling anything branded "Board", or implying endorsement, is barred. Cloning glyph patterns for sale could raise IP and "existing pieces sets" concerns, so ask hello@board.fun first.

### Gaps
- No terms specific to hardware or pieces. No marketplace revenue terms.

## 7. Community discussion (Discord, Reddit, GitHub, HN)

### Takeaway
The only first-party public statement found on homemade pieces is the HN comment from Board's nicoles: multi-material 3D printing works but is finicky. The Discord is set up for SDK support, not feature ideation. No Reddit or GitHub threads on homemade glyphs were found.

### Cited Findings
- HN quotes from nicoles and ryanmeasel, cited in section 1. A former Board detection researcher (escapecharacter) said the team has been "really robustifying the detection algorithm." — [HN thread mirror](https://hn.svelte.dev/item/45742456)
- Discord: for SDK support, technical questions, updates and showcases, "not a roadmap or ideation forum". Product feedback goes to hello@board.fun. — [FAQ](https://docs.dev.board.fun/faq)

### Inferences
- Since that HN comment came at launch (Oct 2025) and the FAQ now says "only existing Pieces and models", the "make your own" route most likely means reproducing existing glyphs, not adding new identities.

### Gaps
- The Discord can't be searched publicly. Reddit searches turned up only unrelated 3D-printing content.

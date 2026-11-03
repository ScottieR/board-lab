# What Makes Games Fun: Research Brief for Board Lab

**Purpose:** Design grounding for (a) a library of game archetypes and mechanic "verbs" on Board (a 23.8" touchscreen table that tracks piece identity, position, rotation and touch), and (b) an AI that helps kids design their own games. The audience is 2-4 players sitting face to face: kids of about 5, 7 and 10, plus parents.
**Compiled:** 2026-11-02. Sources are linked inline. Where a claim comes from general design knowledge and not a source fetched for this brief, it is marked *(unverified)*.

---

## 1. Frameworks for fun

### MDA and the 8 kinds of fun
In [Hunicke, LeBlanc and Zubek's MDA paper](https://users.cs.northwestern.edu/%7Ehunicke/MDA.pdf), **Mechanics** (rules and data) produce **Dynamics** (run-time behavior), and dynamics produce **Aesthetics** (the player's emotional response). Designers work from mechanics toward aesthetics, while players feel the aesthetics first. The paper lists eight aesthetics:

| Aesthetic | Meaning | Board example |
|---|---|---|
| Sensation | Pleasure for the senses | Chunky pieces, glowing trails, sound |
| Fantasy | Make-believe | "This piece *is* a dragon" |
| Narrative | Drama that unfolds | Oregon Trail events |
| Challenge | Obstacles to overcome | Puzzles, races |
| Fellowship | Social connection | Co-op, table talk |
| Discovery | Exploring the unknown | Little Alchemy combinations, hidden map |
| Expression | Self-expression | Building, decorating, kids designing games |
| Submission | A relaxing pastime | Townscaper-style toying |

**Implication for the AI:** every generated game should name its 2-3 target aesthetics first, then choose mechanics that serve them. The paper describes games as "more like artifacts than media", meaning the experience comes from behavior, not from content alone.

### Koster: fun is learning
Raph Koster argues that fun is the brain's reward for mastering patterns, and that boredom sets in once a pattern is exhausted or can't be learned. His [10-year retrospective](https://www.raphkoster.com/wp-content/uploads/2026/07/Theory-of-Fun-10-Years-Later.pdf) splits fun into easy, hard, social, visceral and altered-state types, treats delight as a separate, momentary recognition, and recasts games as deliberate-practice machines. **Implication:** each game needs a learnable pattern with depth beyond the first session, plus fresh variation (new tiles, layouts or twists) before mastery turns into boredom.

### Flow and difficulty curves
Csikszentmihalyi's flow is the channel between anxiety (challenge above skill) and boredom (skill above challenge). In his thesis, [Jenova Chen](https://jenovachen.info/abstract) argued that passive, data-driven difficulty adjustment is incomplete, and that players should instead steer their own difficulty through choices embedded in play. In flOw, for example, you dive deeper when you feel ready. **Implication:** at a mixed-age table, let each player pick their own challenge level through play (an easy lane or a hard lane, a bigger or smaller target), not through a settings menu.

### Sid Meier: interesting decisions
In his [GDC 2012 talk](https://gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions), Meier says a decision is interesting when it involves a **tradeoff**, depends on the **situation**, reflects **personal style**, and has **persistent** consequences. The two classic tensions are risk versus reward and short term versus long term. He advises giving players too much information rather than too little. The worst response to a choice, in his view, is the game simply moving on, so every decision needs feedback. He also says pacing should alternate heavy and light decisions, and he cuts a third or more of his ideas. A decision is uninteresting if the player would always pick the same option, or would pick at random.

### Lazzaro's 4 Keys
[Nicole Lazzaro](https://bigthink.com/videos/what-makes-a-game-fun/) identifies four keys:
- **Hard Fun:** fiero, the triumph of beating something difficult.
- **Easy Fun:** curiosity, wonder and surprise.
- **Serious Fun:** play that changes how you feel or matters for a purpose.
- **People Fun:** amusement and laughter between players.

Bestselling games usually combine about three of the four. For families, People Fun and Easy Fun are the reliable base, and Hard Fun is an optional layer on top.

### Self-Determination Theory
In [Ryan, Rigby and Przybylski (2006)](https://sciencedaily.com/releases/2006/12/061226134706.htm), meeting the needs for **autonomy** (meaningful choice), **competence** (visible growth) and **relatedness** (connection to others) predicted enjoyment and continued play better than surface "fun" features did. This maps directly onto kids designing their own games: authorship gives autonomy, a playable result gives competence, and playing it with family gives relatedness.

### Juice and game feel
In [Juice It or Lose It](https://gdcvault.com/play/1016487/contactUs) (GDC), Jonasson and Purho took a plain Breakout clone live on stage and made it delightful with tweening, squash and stretch, particles, screen shake, sound and cheering. They changed none of the rules. [Steve Swink](https://en.wikipedia.org/wiki/Game_feel) defines game feel as real-time control of virtual objects in a simulated space, with interactions emphasized by polish. **On Board, a physical piece is the controller.** Touching, lifting, sliding and rotating it should each get an immediate, distinct response on screen, such as a glow, ripple, footprint trail or creature reaction. [Dorfromantik's team](https://www.gamedeveloper.com/disciplines/sparking-joy-through-tile-placement-in-idyllic-village-builder-i-dorfromantik-i-) adds an important counterweight: put the polish on the action players repeat most, but keep it subtle enough to protect the mood.

### Core loops, variable rewards, push-your-luck, emergence
- **Core loop:** act, get feedback, earn a reward, grow, then act again with more options. Idle and incremental games lay this bare. [Pecorella's math of idle games](https://blog.kongregate.com/quest-for-progress-the-math-of-idle-games) shows that costs rising faster than production, with multipliers unlocking at ownership thresholds, keep changing which upgrade is best. That keeps decisions fresh, and prestige resets restart the cycle.
- **Variable rewards and collection:** unpredictable payoffs and filling a collection drive "one more turn." With kids, use this ethically: rewards come from play, never from purchases, and every session ends at a natural stopping point.
- **Push-your-luck:** [Quacks of Quedlinburg](https://shippboardgames.blogspot.com/2020/02/design-practicum-dissecting-quacks-of.html) shows that each safe draw feels like a reward, that tension climbs as the bust chance rises, and that **busting only limits your rewards instead of erasing them**. Simultaneous drawing keeps everyone involved. That is the right recipe for kids: real tension with a soft landing.
- **Emergence:** a few simple rules that interact produce surprising stories. Catan's trading and Overcooked's overlapping timers are examples. *(unverified, general design knowledge)*

---

## 2. Cooperative, social and mixed-age design

### The alpha-player (quarterbacking) problem
In co-op games, one player can work out the best move and direct everyone else. A [playtester quoted by Justin Gary](https://justingarydesign.substack.com/p/the-quarterback-problem) asked what their presence changed compared with one person running an extra seat. [Meeple Mountain](https://www.meeplemountain.com/articles/benching-the-quarterback-how-to-deal-with-alpha-players-in-co-op-games/) and [others](https://donteatthemeeples.substack.com/p/mitigating-quarterbacking-cooperative-games) catalog the design fixes:
1. **Hidden information:** each player knows something only they can see (Hanabi, The Mind). On Board, information can appear only under a player's own piece, or only when they touch it.
2. **Real-time pressure:** a timer leaves no room for one person to direct everyone (Space Alert, Fuse, Overcooked).
3. **Simultaneous play:** everyone acts at the same time, which Board's multi-touch and multi-piece tracking supports naturally.
4. **Asymmetric roles:** each role has powers only that player has, so no one can play the whole game in their head.
5. **Personal or semi-co-op goals:** a private objective lets players push back on the leader (Dead of Winter).

For a family with a 10-year-old and parents, **asymmetric roles with role-locked information** is the strongest fix. In particular, give the 5-year-old a role the others depend on.

### Hybrid digital and physical table talk
- **Nintendo Land (Wii U):** in Luigi's Ghost Mansion, one GamePad player is the ghost and sees the whole map, while four TV players with flashlights must cooperate and revive each other ([GamesBeat](https://gamesbeat.com/nintendoland/)). The information gap between seats generates shouting, bluffing and laughter. On a single shared screen, Board can create the same gap by giving one player a phone or covered view, or by hiding information until a piece is touched.
- **Jackbox:** [Jason Shen's analysis](https://www.jasonshen.com/2020/the-product-genius-behind-jackbox-games/) credits rules you can explain in under 30 seconds, 15-20 minute sessions, timers that stop anyone from stalling, rising point values and harder challenges for leaders as comebacks, ways to mess with each other, and humor the players generate themselves. **Players' own content is the funniest content.** For a kid-designed game, that means the kids' own drawings, names and voice recordings.
- **Catan:** constant negotiation and no player elimination keep the whole table engaged ([Teuber legacy](https://gotranscript.com/public/catans-surprise-origin-and-klaus-teubers-legacy)).
- A useful principle *(unverified, synthesized)*: the screen should **referee and reveal**, and leave the deciding and persuading to the people. Digital-physical hybrids work best when the app handles bookkeeping and surprises, so people can look at each other instead of at a rulebook.

### Mixed ages: making a 5-year-old and a 10-year-old both enjoy it
Patterns from HABA-style family games and digital party games *(partly unverified, synthesized)*:
- **Equalizing mechanics** such as luck, dexterity, memory and speed-spotting, where a 5-year-old can beat a parent fairly. Memory and search-and-find are the classic equalizers.
- **Handicaps built into the world, not called out as handicaps:** a bigger target zone, more time, or an easier lane, chosen through play as Chen recommends.
- **Catch-up and rubber-banding:** rising stakes in the final round, the leader facing harder challenges (Jackbox), and soft busting (Quacks). Keep it invisible enough that the 10-year-old doesn't feel robbed.
- **Shared fate** (co-op against the game) removes the experience of losing to a sibling.
- **Short rounds** of 3-10 minutes, so the youngest player's attention lasts and a loss is quickly followed by another round.
- **No elimination.** Every player acts at least every 30 seconds or so.

---

## 3. Designing for young kids

- **Toca Boca: digital toys, not games.** The apps have "no winning or losing, no start or end" and drop text and menus. They are gender neutral, and they are meant to hold a 2-year-old's attention as well as a 32-year-old's ([GamesBeat](https://gamesbeat.com/designing-ipad-toys/)). Toca Kitchen gives kids ingredients and lets them combine them freely instead of scoring mini-games. Characters react, and in [Kill Screen's summary](https://www.killscreen.com/secret-smart-kids-entertainment-give-them-toy-not-game/), "their pleasure, or disgust, is your reward." Co-founder Björn Jeffery: you can't win, you can't lose, and there's no explicit purpose ([Quartz](https://qz.com/613098/a-new-kind-of-game-for-kids-encourages-creativity-by-eliminating-goals)).
- **Sago Mini:** no instructions, no formal rules and no assessment. The child controls the pace. The apps support as many fingers on the screen at once as possible, and each one is playtested monthly with 20-30 kids during development ([Joan Ganz Cooney Center Q&A with Jason Krogh](https://joanganzcooneycenter.org/2014/11/14/qa-with-sago-sagos-jason-krogh/)). Kids love repeatable moments, such as ringing a friend's doorbell over and over. *Sago Mini Jinja's Garden* won the **2026 ADA for Interaction (game)** because kids can explore with swipe controls instead of reading instructions ([Apple Newsroom 2026](https://www.apple.com/newsroom/2026/06/apple-reveals-winners-of-the-2026-apple-design-awards/)).
- **Reading-free UI** ([UXmatters, citing NN/g age bands](https://uxmatters.com/mt/archives/2020/01/ux-design-for-kids-key-design-considerations.php)): children aged 3-5 work through images and symbols, 6-8 can read a little but icons should still lead, and 9-12 recognize standard UI patterns. Icons must be literal, because a child may read a hamburger menu icon as a hamburger. Break content into small chunks and reward each step. On Board, use voice-over narration, demonstrate rules with animated ghost hands or pieces, and teach by doing.
- **What kids find funny** *(unverified, synthesized from Toca/Sago practice)*: cause and effect they can repeat, characters overreacting with silly sounds, mild gross-out humor (burps, slime), things going wrong safely, size and absurdity mismatches, and seeing themselves or their family in the game. Failure should be funny, never punishing.

---

## 4. Apple Design Awards and cozy-builder aesthetics

### Categories (2022 to present)
The six categories, each awarded to one app and one game ([9to5Mac 2025](https://9to5mac.com/2025/06/03/apple-announces-2025-apple-design-award-winners/)):
- **Delight and Fun:** memorable, engaging, satisfying experiences.
- **Inclusivity:** experiences that work for people of varied backgrounds, abilities and languages.
- **Innovation:** novel use of technology that sets the winner apart in its genre.
- **Interaction:** intuitive interfaces and effortless controls.
- **Social Impact:** improving lives and highlighting crucial issues.
- **Visuals and Graphics:** stunning imagery, skillful interfaces, high-quality animation and a cohesive theme.

### Verified game winners relevant here
- **2014:** Monument Valley, Threes ([MacRumors guide](https://www.macrumors.com/guide/apple-design-awards))
- **2017:** Old Man's Journey ([MacRumors](https://www.macrumors.com/guide/apple-design-awards))
- **2018:** Alto's Odyssey, Florence, Oddmar, Frost, INSIDE ([TouchArcade](https://toucharcade.com/2018/06/05/wwdc-2018-apple-design-award-winners-include-altos-odyssey-oddmar-and-more/))
- **2020:** Sky: Children of the Light, Sayonara Wild Hearts, Song of Bloom, Where Cards Fall ([MacStories](https://www.macstories.net/news/apple-design-awards-for-2020-awarded-to-eight-developers/))
- **2024:** NYT Games (Delight and Fun), praised for replay value and easy, elegant design. Crayola Adventures (Inclusivity), with diverse characters and full narration for all ages. Lost in Play (Innovation), with hand-drawn art and endearing characters. Rytmos (Interaction), where simple drag gestures each add an element to a song ([Apple Newsroom 2024](https://apple.com/newsroom/2024/06/apple-announces-winners-of-the-2024-apple-design-awards))
- **2025:** Balatro (Delight and Fun), Art of Fauna (Inclusivity), PBJ: The Musical (Innovation), DREDGE (Interaction), Neva (Social Impact), Infinity Nikki (Visuals) ([9to5Mac](https://9to5mac.com/2025/06/03/apple-announces-2025-apple-design-award-winners/))
- **2026:** Is This Seat Taken? (Delight and Fun), a cartoon logic puzzle with playful interactions. Pine Hearts (Inclusivity). Blue Prince (Innovation). **Sago Mini Jinja's Garden (Interaction)** ([Apple Newsroom 2026](https://www.apple.com/newsroom/2026/06/apple-reveals-winners-of-the-2026-apple-design-awards/))
- **Not found in the winner lists checked:** Toca Boca apps. Treat claims that Toca won an ADA as unconfirmed.

**What the winners share:** a single, cohesive art direction; one core gesture that feels good (Rytmos's drag, Alto's one-tap); no reading needed to start; accessibility treated as a feature (Crayola's narration); and short, completable experiences. [Ken Wong on Monument Valley](https://gamedeveloper.com/design/designing-the-surprise-mobile-game-hit-i-monument-valley-i-): each level is a framed artwork, the game is meant to be finished rather than to be hard, and the push-and-pull interactions feel like a toy. In his words, "games are experiences."

### Cozy nature and builder toys
- **Townscaper:** no objectives and no score. The player places or removes blocks and picks colors, and the algorithm handles all the architecture and detail. The game does the beautiful part. Stålberg's goal: "the visuals and the joy of creation to be the whole point" ([PC Gamer](https://pcgamer.com/townscapers-developer-on-how-its-radically-casual-design-is-inspiring-a-new-wave-of-low-stress-builders-to-adapt-the-blueprint)).
- **Dorfromantik:** the repeated tile placement is made rewarding with subtle animation and sound. Quests are small, countable demands shown on the map, such as a deer wanting a forest of a certain size. Challenge is optional, so the game doesn't punish players who build purely for looks. The art is an idealized, painterly countryside that echoes board games ([Game Developer](https://www.gamedeveloper.com/disciplines/sparking-joy-through-tile-placement-in-idyllic-village-builder-i-dorfromantik-i-)).
- **Terra Nil:** a "reverse city builder" in which players restore a wasteland into an ecosystem, with a Ghibli-inspired palette and a satisfying, relaxing restoration loop ([Game World Observer](https://gameworldobserver.com/2022/09/30/terra-nil-free-lives-interview-reverse-city-builder-studio-ghibli)).
- **Islanders and Before We Leave** *(unverified, general knowledge)*: minimal palettes, low-poly forms, placement previews that show the score before you commit (Islanders), and no combat.
- **The common recipe:** no fail state or only a soft one; placement previews; procedural detail that rewards every action; a limited, harmonious palette; ambient sound and music that respond to the player; and a visible before-and-after transformation.

---

## 5. Classics to adapt: the essential fun

| Classic | Essential fun | Digital must preserve | Digital can improve |
|---|---|---|---|
| **Oregon Trail** | Naming your party, scarce resources, random misfortune, darkly funny deaths ([Format](https://www.format.com/magazine/you-have-died-of-dysentery-oregon-trail-design/)) | Personal attachment (named companions), tradeoffs, tombstones left for the next players | Kid-safe stakes: getting lost or a broken wagon, with silly rather than grim outcomes; co-op wagon roles |
| **Mexican Train** | Your own train plus a shared public train, a marker that opens your train to others when you're stuck, and doubles that must be satisfied ([Pagat](https://www.pagat.com/tile/wdom/mextrain-c.html)) | Physical tiles; the "uno"-style last-tile call; the train metaphor | Auto-matching hints for the 5-year-old, automatic scoring, animated trains running along completed lines |
| **Rummikub** | Rearranging the shared table: every tile is visible and anything can be reshuffled as long as all sets are valid at the end of the turn ([WellGames](https://wellgames.com/news/rummikub-timeless-game-739523)) | Free manipulation of tiles; the "aha" of a big rearrangement | Validate sets in real time with glows; let a turn be undone safely; color and shape modes before numbers |
| **Mahjong** | The ritual of draw and discard, claiming another player's discard, building toward a hand, the clack of tiles *(unverified)* | Tactile tiles and claiming as a social interruption | Hand-goal hints and simplified kid hands; automatic scoring, which is the biggest barrier |
| **Catan** | Trading and negotiation; no elimination; building rather than destroying ([Teuber](https://gotranscript.com/public/catans-surprise-origin-and-klaus-teubers-legacy)); everyone collects on others' rolls *(unverified)* | Face-to-face trading; a variable board | Animated resource flow; trade suggestions for kids; a robber that doesn't make a sibling cry |
| **Ouija** | Shared hands, the planchette apparently moving by itself, suspense. The ideomotor effect is real: in a UBC study, people answered guessed questions more accurately with the planchette than they did online ([Georgia Straight](https://www.straight.com/news/freud-and-jung-theorized-about-unconscious-ubc-researchers-try-prove-its-existence)) | Several hands on one piece. Board's touch sensing can detect who is touching | Reframe as a "mystery oracle" or group-mind game: spooky-fun, not occult |
| **Where's Waldo / Mamoko** | Wordless spreads where readers follow each character's storyline from page to page, including a mystery thief finally revealed ([Kirkus](https://kirkusreviews.com/book-reviews/aleksandra-mizielinska/welcome-to-mamoko)) | Wordlessness; dense but readable scenes; many parallel stories | Animated scenes with characters who move between them; place a piece to "follow" a character; a different quest for each player |
| **Choose-your-own-adventure** | Second-person agency and meaningful forks *(unverified)* | Real consequences; rereading to find the other endings | Group voting by moving pieces; a map of discovered endings; the AI generating branches from kids' ideas |
| **Little Alchemy** | Combination discovery: what do two things make? Curiosity plus collection *(unverified)* | Logical but surprising results; a visible collection | Combine physical pieces on the table; family shared discovery book; hints that unlock over time |
| **Overcooked** | Chaotic co-op: a small set of tasks, overlapping timers, levels that shift to break memorized routines; a timer instead of lives ([MCV post-mortem](https://mcvuk.com/development-news/the-develop-post-mortem-overcooked/)) | Forced communication; simple verbs; a fair timer | Pieces as chefs on a shared table; scaling difficulty by seat; a kind ending ("we served 7!") |
| **Farm/idle upgrade games** | Watching numbers and the world grow; upgrade choices whose value shifts at thresholds ([Pecorella](https://blog.kongregate.com/quest-for-progress-the-math-of-idle-games)) | A visible growth curve; satisfying unlocks | Make it social and session-bounded; the farm visibly transforms like Terra Nil; no dark patterns |

---

## Design rules for an AI game designer

1. **Pick 2-3 target aesthetics first**, from Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression and Submission, then justify every mechanic against them. *[MDA]*
2. **Combine at least two of Lazzaro's keys, with People Fun always included** for a family table. *[Lazzaro]*
3. **Every touch, lift, move or rotation of a piece gets a visible and audible response within about 100 ms.** Silence feels like a bug. *[Swink game feel; Meier "never just move on"]*
4. **Put the most polish on the action players repeat most**, and scale its intensity to the game's mood: big for party games, subtle for cozy ones. *[Jonasson & Purho; Dorfromantik]*
5. **A 5-year-old must be able to contribute meaningfully without reading:** voice narration, literal icons and demonstrations of the rules. *[Toca, Sago, NN/g age bands]*
6. **Teach by doing within 30 seconds.** No rules screen; the first action is the tutorial. *[Jackbox; Jinja's Garden ADA]*
7. **Every decision needs a tradeoff.** If one option is always best, or the choice is effectively random, cut it or redesign it. *[Meier]*
8. **Alternate heavy and light decisions.** Never stack several complex choices in a row for a young player. *[Meier pacing]*
9. **Show players the information they need to choose** (placement previews, odds and outcomes) before they commit. *[Meier; Islanders-style previews]*
10. **Players set their own difficulty through play** (an easy lane or hard lane, a bigger or smaller target), not through a menu. *[Chen, flow]*
11. **Include at least one equalizing skill** (memory, spotting, dexterity or luck) where the youngest player can fairly beat a parent. *[family-game practice]*
12. **Catch-up should be invisible:** rising stakes in the last round, harder challenges for the leader, soft busting. Never punish the leader in a way they can see. *[Jackbox; Quacks]*
13. **No player elimination, and nobody waits more than about 30 seconds without something to do.** Prefer simultaneous play. *[Catan; Quacks; Overcooked]*
14. **In co-op, prevent quarterbacking** with role-locked powers or private information (revealed under a player's own piece) and/or a real-time timer. *[alpha-player literature; Hanabi; Space Alert]*
15. **Give every role a reason the team needs it**, especially the youngest player's role. *[asymmetric design; Nintendo Land]*
16. **Create information gaps between seats** to spark table talk: one player knows something the others must ask about. *[Nintendo Land]*
17. **The screen referees and reveals; people decide and persuade.** Automate bookkeeping and scoring, and leave negotiation and bluffing to the humans. *[Catan; hybrid board-game practice]*
18. **Failure should be funny, soft and quick to recover from.** A bust shrinks your reward instead of wiping it out, and characters react with comic dismay. *[Quacks; Toca "pleasure or disgust is your reward"]*
19. **Offer a toy mode with no goals** in every game where possible, so the youngest player can simply play with the pieces. *[Toca; Townscaper]*
20. **Let the system make the player's action beautiful:** procedural detail, growth and harmony bloom from simple placements. *[Townscaper; Terra Nil]*
21. **Show a before-and-after transformation** (wasteland to garden, empty table to town) and replay it at the end. *[Terra Nil; Dorfromantik]*
22. **One cohesive art direction per game:** a limited palette, one illustration style, ambient sound. Every screen should be worth framing. *[Monument Valley; ADA Visuals]*
23. **Build a learnable pattern with depth, then add a twist** before mastery turns to boredom: new tiles, shifted layouts or a rule mutation each round. *[Koster; Overcooked shifting levels]*
24. **Use players' own content** (drawings, names, recorded voices, inside jokes) as the most delightful material. *[Jackbox; SDT relatedness]*
25. **Name things and remember them:** named pieces and characters, and keepsakes (tombstones, a discovery book) that carry over between sessions. *[Oregon Trail; Meier on customization]*
26. **Discovery beats instruction:** let players find combinations and secrets, and keep a visible collection of what they've found. *[Little Alchemy; Lazzaro Easy Fun]*
27. **Sessions of 5-20 minutes with a natural ending.** No endless loops, no purchase-driven rewards, and no streak pressure on kids. *[Jackbox pacing; ethical variable rewards]*
28. **Kid-designed games need autonomy, competence and relatedness:** the kid makes real choices, the AI guarantees the result is playable, and the game is built to be played with family that night. *[Self-Determination Theory]*
29. **Use the hardware's unique senses:** rotation as a choice dial, touch for "who's holding it," and several hands on one piece for group moments like Ouija. *[Board capabilities; ideomotor research]*
30. **Playtest with the real ages and cut a third.** The AI should propose variants, watch what the table enjoys, and remove the parts that aren't fun. *[Sago monthly playtests; Meier]*

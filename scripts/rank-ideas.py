"""Generate docs/GAME_IDEAS.md from docs/ideas.json.

Score = fun (45%) + Board fit (35%) + doability (20%), each 1-5, as 0-100.
Run: python3 scripts/rank-ideas.py
"""
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
ideas = json.loads((root / "docs" / "ideas.json").read_text())
for i in ideas:
    i["score"] = round((i["fun"] * 0.45 + i["fit"] * 0.35 + i["do"] * 0.2) / 5 * 100)
ideas.sort(key=lambda i: (-i["score"], -i["fun"], i["name"]))

STATUS = {"playable": "✅ playable", "next": "🔜 build next", "template": "📋 starter template"}
out = [
    "# Game ideas, ranked",
    "",
    "Every idea from Scottie (★), Gemini (G) and the first Board Lab list (B), merged where they're the same game and",
    "ranked by **score = fun 45% + Board fit 35% + doability 20%** (each 1–5).",
    "",
    "- **Fun** — how strong the core loop is for our family (mixed ages, playing together), using the research in",
    "  `docs/research/FUN_RESEARCH.md`.",
    "- **Board fit** — how much it needs Board's superpowers (pieces you place/turn/hold, everyone around one table)",
    "  rather than being a tablet game on a big screen.",
    "- **Doability** — how much new engine work, content and art it needs. Phones-as-hands and runtime AI lower it.",
    "",
    "Status: ✅ playable in the simulator now · 🔜 build next (verbs designed, small engine work) · 📋 starter template",
    "(archetype + skeleton exist; the Studio can start a kid's game from it).",
    "",
    "| # | Game | Score | Fun | Fit | Do | Status | Archetype | Merges |",
    "|---|------|------:|---:|---:|---:|--------|-----------|--------|",
]
for n, i in enumerate(ideas, 1):
    out.append(
        f"| {n} | **{i['name']}** | {i['score']} | {i['fun']} | {i['fit']} | {i['do']} | {STATUS[i['status']]} | "
        f"`{i['arch']}` | {'; '.join(i['src'])} |"
    )
out += ["", "## What makes each one a Board game", ""]
for n, i in enumerate(ideas, 1):
    line = f"{n}. **{i['name']}** — {i['hook']}"
    if i.get("needs"):
        line += f" *Needs: {', '.join(i['needs'])}.*"
    if i.get("note"):
        line += f" _{i['note']}_"
    out.append(line)
out += [
    "",
    "## Notes on Gemini's hardware suggestions",
    "",
    "- **Keep:** translucent PETG shells as light pipes — the screen glows up through lanterns, gems and eyes with no",
    "  electronics. Great for Night Lights, Firefly Meadow and the potion beakers.",
    "- **Doesn't apply to Board:** recognising a printed *shape* or footprint (only official glyph bases are",
    "  identified), conductive nibs as IDs (they'd read as anonymous touches at best), physical mirrors/gears/cranks",
    "  (the screen can't see them — use piece rotation instead), and hidden dials inside goblets (use phones for secrets).",
    "- **Careful:** felt pads under a piece will block its glyph. Put felt only on the outer rim of a shell, never",
    "  over the base. Don't flick pieces across the glass — move virtual things with them.",
    "",
    "_Regenerate this file with `python3 scripts/rank-ideas.py` after editing `docs/ideas.json`._",
]
(root / "docs" / "GAME_IDEAS.md").write_text("\n".join(out) + "\n")
print(f"ranked {len(ideas)} ideas")
for i in ideas[:12]:
    print(i["score"], i["name"])

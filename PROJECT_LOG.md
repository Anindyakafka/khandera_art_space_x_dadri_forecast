# Project Log

A running record of key project decisions, updates, and the reasons behind them, reconstructed from the current repository state and this session.

| Date | Area | Decision / Change | Why | Status |
| --- | --- | --- | --- | --- |
| 2026-04-08 | Flicker refinement | Expanded hover tolerance across normal paragraph gaps and increased heading/body separation in the Dadri manifesto area. | Reduce orb flicker in line spacing while keeping text from creeping too close to headings. | In progress |
| 2026-04-08 | Hover stability | Reduced the Dadri orb size and narrowed active reflow to the hovered paragraph so manifesto/body text no longer pushes under headings as aggressively. | Keep the interaction readable, stop heading overlap, and reduce flicker in airy text spacing. | In progress |
| 2026-04-08 | Deployment note | Logged another small repo update to ensure there is always a visible commit-worthy change during iteration. | Make it easier to trigger Netlify deploys while ongoing interaction refinements are still in progress. | Active |
| 2026-04-08 | Project log maintenance | Cleaned up a merge-conflict state in `PROJECT_LOG.md` and kept the decision table current. | Maintain a readable, pushable log file while multiple iterations are happening quickly. | Active |
| 2026-04-08 | Dadri flow debugging | Continued refining `DadriFlowField.svelte` so the orb can travel further through long-form text and preserve paragraph spacing while hovering. | Prevent the orb from feeling artificially capped and keep the reading rhythm intact during interaction. | In progress |
| 2026-04-07 | Project documentation | Created `PROJECT_LOG.md` as an internal running log for decisions and rationale. | Keep track of design/implementation choices over time and make iteration history easier to follow. | Active |
| 2026-04-07 | Deployment workflow | Keep at least one concrete edited file during iteration. | Ensure there is always something visible to push for Netlify-triggered deploys. | Active |
| 2026-04-07 | Dadri interaction design | Scoped the orb/text-reflow effect to **Dadri Forecast pages only**. | The interaction belongs to the Dadri reading experience and felt distracting when applied site-wide. | Active |
| 2026-04-07 | Text targeting | Limited the effect to **body-copy zones** rather than headings, labels, nav, and warning bars. | Preserve hierarchy and keep the effect editorial rather than decorative/noisy. | Active |
| 2026-04-07 | Text layout direction | Moved away from one-sided float behavior toward **Pretext-style obstacle-aware reflow** using `@chenglou/pretext`. | The desired reference was text flowing around an orb, not just shifting to one side. | In progress |
| 2026-04-07 | Reading rhythm | Iteratively refined paragraph grouping and hover behavior to avoid collapsed spacing, paragraph jumps, and awkward whitespace behavior. | Long-form text needs to stay readable while still feeling alive and responsive. | In progress |
| 2026-04-07 | Dadri visual identity | Kept Dadri as a separate visual/system layer with its own navigation context, logo use, dark treatment, and atmospheric overlays. | Reinforce Dadri Forecast as a distinct editorial and conceptual zone inside the wider site. | Active |
| 2026-04-07 | Site structure | Maintained a content-driven workflow using `content/` and `static/media/` for editorial updates. | Allows the site to be updated through markdown/JSON/media assets instead of hard-coded copy only. | Active |
| 2026-04-07 | Route architecture | Preserved a split between the main Khandera site and the dedicated `/dadri-forecast` route family. | Supports different tone, structure, and experimentation levels across the two parts of the project. | Active |
| 2026-04-07 | Homepage/content strategy | Structured the site around archive-style routes: home, about, manifesto, artists, projects, and events, with Dadri-specific mirrors/subroutes where needed. | Supports the project’s archival/editorial framing and keeps navigation legible. | Active |

---

## Notes

- This log is based on the **current repo state plus the decisions made in this conversation**.
- It is **not** a full reconstruction of unavailable past chats.
- Future entries can be appended in the same table format.

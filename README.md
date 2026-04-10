# Symposion

A personal board of advisors desktop app powered by the Claude API. Pose a question and watch a cast of historically-inspired characters debate it in real time — each with their own personality, memory of past sessions, and vote.

Built with **Tauri 2.0 + React + Vite + TypeScript + MUI**.

---

## Features

- **Open session** — ask your board a question, get a full multi-turn debate with verdicts, votes, and a tension map showing ideological fault lines
- **Just listen** — say nothing; the board holds a candid session about you based on your session history
- **Member memory** — after each session, each member's position is compressed into a memory entry injected into future prompts; at 20 entries, older memories are condensed into a long-term summary
- **Manage board** — swap in/out up to 6 members from a bank of 21 pre-built characters, or create a custom member with AI auto-fill
- **Devil's Advocate mode** — adds a permanent structural opposition seat to every debate
- **Guest appearances** — Claude occasionally nominates a relevant outside voice when the board identifies a gap

---

## Stack

| Layer | Technology |
|---|---|
| Desktop shell | Tauri 2.0 |
| Frontend | React 18 + TypeScript + Vite |
| UI | MUI (Material UI) with `styled()` components |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| HTTP | `@tauri-apps/plugin-http` (scoped to `api.anthropic.com`) |
| Persistence | `@tauri-apps/plugin-store` (board + sessions), `@tauri-apps/plugin-stronghold` (API key) |

---

## Getting started

```bash
npm install
npm run tauri dev
```

You'll need an [Anthropic API key](https://console.anthropic.com/). Enter it in the Settings panel when the app opens.

To build a distributable:

```bash
npm run tauri build
```

---

## Project structure

### Config & build

| File | Purpose |
|---|---|
| `src-tauri/tauri.conf.json` | Tauri config — window size (1200×800, min 900×600), app identifier, build commands, icon targets |
| `src-tauri/Cargo.toml` | Rust dependencies for the Tauri backend (plugins: store, http, etc.) |
| `src-tauri/build.rs` | Tauri build script (boilerplate) |
| `vite.config.ts` | Vite bundler config with `@` path alias pointing to `src/` |
| `package.json` | npm scripts and dependencies |
| `scripts/bump-version.ts` | Syncs version numbers across `package.json` and `tauri.conf.json` |

### Entry points

| File | Purpose |
|---|---|
| `src/main.tsx` | React root — creates the Tauri HTTP adapter, calls `setApiAdapter()`, loads the MUI theme, wraps app in `ThemeProvider` |
| `src/App.tsx` | Top-level layout — renders `Sidebar` + active screen, all modal/panel overlays, and hydrates state from `plugin-store` on mount |
| `src/index.css` | Global base styles (box model reset, body background, scrollbar, font) |

### `src/core/` — Platform-agnostic logic

| File | Purpose |
|---|---|
| `types.ts` | All shared TypeScript types: `Member`, `Memory`, `Session`, `Message`, `DialogueLine`, `TensionMap`, `Board`, `Guest` |
| `api.ts` | Anthropic API calls via injected `ApiAdapter`. `callAnthropic` (single-turn), `callAnthropicWithHistory` (multi-turn), `parseJsonResponse` to strip markdown fences. Cap: `MAX_OUTPUT_TOKENS = 2048` |
| `board.ts` | `MEMBER_BANK` of 21 pre-built characters, `DEFAULT_MEMBERS` (5 defaults), `createDefaultBoard()`, `generateMemberId()`, `getMemberFromBank()`. `MAX_BOARD_MEMBERS = 6` |
| `prompts.ts` | All Claude prompt builders — `buildOpenSessionPrompt`, `buildFollowUpPrompt`, `buildListenPrompt`, `buildMemoryCompressionPrompt`, `buildMemoryCondensationPrompt`, `buildAutoFillPrompt`, `buildSessionSummary`. Each returns `{ system, user }` |
| `memory.ts` | Post-session memory pipeline: `compressSessionMemories` stores a `Memory` entry per member after each session. `maybeCondenseMemories` triggers at 20 entries, collapsing older ones into `condensedMemory`. `runCondensationPass` runs it across all members |
| `session.ts` | Session factory functions (`createSession`, `createUserMessage`, `createBoardMessage`) and display helpers (`getSessionTitle`, `getRelativeDate`) |

### `src/lib/` — Adapters & theming

| File | Purpose |
|---|---|
| `tauri-adapter.ts` | Implements `ApiAdapter` using `@tauri-apps/plugin-http` for Tauri's scoped HTTP allowlist |
| `theme.ts` | MUI dark theme — colors, typography, component overrides |

### `src/hooks/` — React state logic

| File | Purpose |
|---|---|
| `useAppState.ts` | Central state hook — owns `board`, `sessions`, `activeSessionId`, `screen`, modal open states, `apiKey`. Exposes `addMember`, `removeMember`, `toggleDevilsAdvocate`, `addSession`, `updateSession` |
| `useSession.ts` | Session execution hook — `runOpenSession`, `runFollowUp`, `runListenSession`, `autoFillMember`. Manages `loading`/`error` state and the `activeGuest`. Triggers memory compression after session ends |
| `useStorage.ts` | Persistence hook using `plugin-store` — reads/writes `board`, `sessions`, and `apiKey` to disk |

### `src/screens/` — Full-page views

| File | Purpose |
|---|---|
| `NewSessionScreen.tsx` | Landing screen — member avatar stack, "Open session" / "Just listen" cards, text input to start a session |
| `ActiveSessionScreen.tsx` | Active session view — conversation thread with per-member dialogue lines, verdicts, tension maps, and a follow-up input bar |

### `src/components/` — UI panels & overlays

| File | Purpose |
|---|---|
| `Sidebar.tsx` | Left sidebar — member list, "Manage board" button, recent session list, "New session" button |
| `ManageBoardPanel.tsx` | Slide-in panel — remove existing members, add from the suggested list, toggle Devil's Advocate mode |
| `AddMemberPanel.tsx` | Sub-panel opened from ManageBoard — form to create a custom member with AI auto-fill (generates name/emoji/role/personality from a description) |
| `SettingsModal.tsx` | Modal for entering and saving the Anthropic API key |
| `LoadingDialogue.tsx` | Animated loading state shown while waiting for Claude's response |
| `TensionMap.tsx` | Visualizes the board's ideological clusters and fault lines from the Claude response |

---

## Architecture notes

- **Adapter pattern** — `ApiAdapter` in `src/core/api.ts` abstracts all HTTP calls. Tauri injects `tauri-adapter.ts` at startup; a future Expo/mobile port would inject a native fetch adapter without touching core logic.
- **Two-tier memory** — Recent memories (up to 20) are stored verbatim per member. Once the limit is hit, older entries are condensed into a `condensedMemory` string by a separate Claude call, keeping prompt size bounded while preserving long-term context.
- **API key storage** — The Anthropic API key is stored in an encrypted Stronghold vault (`symposion-vault.hold` in `AppData/Roaming/com.symposion.desktop/`) rather than the plaintext JSON store used for board and session data. On first launch after this change, any existing plaintext key is automatically migrated and removed from the JSON file.
- **Styling** — All styles use MUI `styled()` components in co-located `.styled.ts` files. No Tailwind, no CSS modules.

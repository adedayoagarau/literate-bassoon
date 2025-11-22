# Typefoundry

**A distraction-free, local-first writing environment for all literary forms**

Typefoundry is a tactile minimalist writing application designed for novelists, screenwriters, and poets. Inspired by the "Freewrite" aesthetic, it provides a focused writing experience with intelligent mode-switching and zero distractions.

## Features

### 🎭 The "Chameleon" Editor

The editor adapts its behavior based on your project type:

#### 📚 Novelist Mode
- Standard Manuscript Format (Times New Roman, 12pt, double-spaced)
- Auto-indentation for paragraphs
- Auto-chapter detection (coming soon)

#### 🎬 Screenwriter Mode  
- Courier 12pt with proper screenplay margins
- Fountain syntax support
- Intelligent element detection:
  - `INT.` or `EXT.` → Scene Heading
  - `ALL CAPS` → Character Name
  - `(parenthetical)` → Parenthetical

#### 📝 Poet Mode
- Crimson Text serif font
- Absolute whitespace preservation
- Stanza mode with visual separation
- No auto-formatting interference

### 🧘 Zen Mode

Toggle distraction-free mode to hide all UI elements:
- Sidebars disappear
- Background changes to off-white (#fdfbf7)
- Text in dark gray (#333)
- Pure focus on your words

### 🗂️ The Binder

Organize your work with a structured file tree:
- **Manuscript Folder**: Your draft
- **Research Folder**: Images, PDFs, notes
- **The Junkyard**: Deleted scenes preserved for eternity

### 🔧 The Toolkit

Quick access to writing tools (right panel):
- **Thesaurus**: Local synonym lookup
- **Rhyme Dictionary**: For poets
- **Grammar Check**: Rule-based checking

### ⌨️ Typewriter Scrolling

The active line stays vertically centered as you type, mimicking the experience of a physical typewriter.

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Editor**: Tiptap (extensible rich text)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Fonts**: Courier Prime, Crimson Text, Times New Roman

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Design Philosophy: "Tactile Minimalism"

Typefoundry embraces the feel of ink on paper:
- High-contrast monochrome aesthetics
- Specific serif fonts to mimic traditional writing
- Static, "heavy" UI elements (no layout shifts)
- Information diet: stats hidden unless needed

## Roadmap

- [ ] SQLite local storage
- [ ] Export to DOCX, EPUB, PDF, FDX
- [ ] Local thesaurus/rhyme databases
- [ ] LanguageTool integration
- [ ] "The Vault" - Optional AI agents for post-draft analysis
  - Script Doctor (screenplay analysis)
  - Logic Checker (plot holes)
  - Scansion Tool (poetic meter)

## License

ISC

## Acknowledgments

Inspired by [farzaa/freewrite](https://github.com/farzaa/freewrite) 

# Plain Shiki

Highlight your plaintext in any container via [Shiki].

By using the CSS Custom Highlight API, code can be highlighted on plain text nodes without rich text. It will help you get the lightest code editor.

## Installation

```bash
pnpm i plain-shiki
```

## Usage

```ts
import { createPlainShiki } from "plain-shiki";
import { createHighlighter } from "shiki";

const shiki = await createHighlighter({
    langs: ["html", "css", "js", "ts"],
    themes: ["vitesse-light", "vitesse-dark"]
});

const el = document.querySelector(".plain-shiki") as HTMLElement;

createPlainShiki(shiki).mount(el, {
    lang: "ts",
    themes: {
        light: "vitesse-light",
        dark: "vitesse-dark"
    }
});
```

[Shiki]: https://shiki.style

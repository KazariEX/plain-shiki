# Plain Shiki

Highlight your plaintext in any container via [Shiki].

## Installation

```bash
pnpm i plain-shiki
```

## Usage

```ts
import { createHighlighter } from "shiki";
import { createPlainShiki } from "plain-shiki";

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
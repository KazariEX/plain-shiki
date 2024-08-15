# Plain Shiki

Highlight your plaintext in any container via [Shiki]!

## Installation

```bash
pnpm i plain-shiki
```

## Usage

```ts
import { createPlainShiki } from "plain-shiki";

const el = document.querySelector(".plain-shiki") as HTMLElement;

createPlainShiki(el, {
    lang: "ts",
    themes: {
        light: "vitesse-light",
        dark: "vitesse-dark"
    }
});
```

[Shiki]: https://shiki.style
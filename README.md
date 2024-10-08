# Plain Shiki

Highlight your plaintext in any container via [Shiki].

By using the CSS Custom Highlight API, code can be highlighted on plain text nodes without rich text. It will help you get the lightest code editor.

## Installation

```bash
pnpm i plain-shiki
```

## Usage

1. Firstly, create any element that can contain text nodes, e.g. `<div class="plain-shiki"></div>`

2. Add the `contenteditable` attribute to this element. If you don't mind the [compatibility](https://caniuse.com/?search=contenteditable) of the target browser, you can specify its value as `plaintext-only`

3. Write the following code:

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

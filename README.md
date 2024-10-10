# Plain Shiki

[![version](https://img.shields.io/npm/v/plain-shiki?color=32A9C3&labelColor=1B3C4A&label=npm)](https://www.npmjs.com/package/plain-shiki)
[![downloads](https://img.shields.io/npm/dm/plain-shiki?color=32A9C3&labelColor=1B3C4A&label=downloads)](https://www.npmjs.com/package/plain-shiki)
[![license](https://img.shields.io/npm/l/plain-shiki?color=32A9C3&labelColor=1B3C4A&label=license)](/LICENSE)

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
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine-javascript.mjs";
import grammarTs from "shiki/langs/typescript.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import vitesseLight from "shiki/themes/vitesse-light.mjs";

const shiki = await createHighlighterCore({
  langs: [grammarTs],
  themes: [vitesseLight, vitesseDark],
  engine: createJavaScriptRegexEngine()
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

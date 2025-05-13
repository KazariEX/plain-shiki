## 0.1.0 (2025-02-05)

### Chores

- ship ESM only

## 0.0.12 (2024-10-11)

### Features

- add `defaultSelector` option
- allow passing `false` to `defaultTheme`

### Bug Fixes

- avoid index out of bounds during temporary updates
- should not use the end index of longer lines

## 0.0.11 (2024-10-10)

### Features

- add `defaultTheme` option

### Performance

- keep the grammar state of the last editing line
- optimize continuous input

### Bug Fixes

- merge lines to diff overlapping content

## 0.0.9 (2024-10-08)

### Bug Fixes

- delete ranges instead of highlights
- avoid deleting external stylesheet
- avoid running `dispose` multiple times

## 0.0.8 (2024-10-07)

### Features

- calc edit diff for better rerendering

### Bug Fixes

- delete highlights when disposing

## 0.0.7 (2024-10-06)

### Performance

- support parsing and caching line by line based on shiki grammar state

## 0.0.6 (2024-10-06)

### Performance

- reduce the time complexity of finding node and offset
- don't wrap `update` with `debounce` when delay is zero

### Bug Fixes

- clear ranges in advance

## 0.0.5 (2024-10-04)

### Features

- support `contenteditable` without `plaintext-only`

## 0.0.4 (2024-09-23)

### Types

- export return type of `createPlainShiki`

## 0.0.3 (2024-08-18)

### Bug Fixes

- should remove stylesheet when disposing

### Types

- adjust types of options

## 0.0.2 (2024-08-16)

### Features

- externalize shiki instance

## 0.0.1 (2024-08-16)

### Features

- implement basic highlighting function

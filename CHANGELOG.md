## 0.0.7 (2024-10-06)

### Perf

- support parsing and caching line by line based on shiki grammar state

## 0.0.6 (2024-10-06)

### Perf

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
# nuxt3-vuetify3-issue-15412

Testing Vite 5.4.2 ([fix sass file:// reference](https://github.com/vitejs/vite/pull/17909)): missing sourcemap, even enabling `vite.css.devSourcemap`.

Testing [fix sass modern source map](https://github.com/vitejs/vite/pull/17938) it is working:
- add `"vite": "https://pkg.pr.new/vite@561b940"` to `package.json` dependencies
- and same entry to `package.json` resolutions

then run `pnpm install && pnpm dedupe && pnpm nuxt prepare`.

To start dev server run `pnpm run`.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/userquin/nuxt3-vuetify3-issue-15412)


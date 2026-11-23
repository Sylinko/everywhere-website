# Everywhere Website

The English and Simplified Chinese site for [Everywhere](https://everywhere.sylinko.com). TanStack Start serves the site on Cloudflare Workers; Fumadocs compiles the MDX and powers document navigation and search.

## Develop locally

Use Node.js 26 and the pnpm version in `package.json`..

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Edit documentation in `content/docs/{en,zh}/` and legal policies in `content/policies/{en,zh}/`. Routes live in `src/routes/` and shared page code in `src/features/`.

Page URLs start with `/en` or `/zh`. If the prefix is missing, the site redirects to the same path using the browser's preferred language, defaulting to English. If the browser prefers Chinese, for example, `/pricing` redirects to `/zh/pricing`, while `/en/pricing` stays in English. API and static asset URLs do not need a language prefix.

## Build and verify

```sh
pnpm types:check
pnpm build
pnpm start
```

## License

[Apache 2.0](LICENSE) © Sylinko Inc.

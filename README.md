# Everywhere Website

A documentation site for Everywhere, built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## 🚀 Key Features

- **Framework:** Built on [Next.js](https://nextjs.org), leveraging React Server Components.
- **Documentation:** Powered by [Fumadocs](https://fumadocs.dev), offering a robust MDX-based documentation workflow.
- **Styling:** Styled with [Tailwind CSS v4](https://tailwindcss.com) and `tailwindcss-animate` for a beautiful, responsive UI.
- **Icons:** Uses [Lucide React](https://lucide.dev) for consistent and crisp iconography.
- **Internationalization:** Built-in support for multiple languages (e.g., English, Simplified Chinese).
- **Search:** Integrated search functionality for quick navigation.

## 🛠️ Tech Stack

- **Core:** TypeScript, React, Next.js
- **Content:** MDX (Fumadocs MDX)
- **UI/UX:** Tailwind CSS, Radix UI (via Fumadocs UI)
- **Package Manager:** pnpm

## 📂 Project Structure

```text
everywhere-website
├── app/                    # Next.js App Router (pages, layouts, API)
│   ├── api/                # API routes
│   ├── og/                 # Open Graph image generation
│   └── [lang]              # Internationalized routes
│       ├── (home)/         # Landing page routes
│       ├── docs/           # Documentation routes
│       ├── llms-full.txt/  # Full Documentation text file
│       ├── llms.mdx/       # Text file for pages
│       └── policies/       # Policy pages
├── components/             # Reusable React components
├── content/                # MDX content source
│   ├── docs/               # Documentation files
│   └── policies/           # Policy documents
├── lib/                    # Utilities and configurations
├── public/                 # Static assets
├── next.config.mjs         # Next.js configuration
├── open-next.config.ts     # Open Next configuration
└── source.config.ts        # Fumadocs configuration
```

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (LTS version recommended)
- pnpm (Project package manager)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Sylinko/everywhere-website.git
    cd everywhere-website
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Development

Start the development server:

```bash
 pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

To build the application for production:

```bash
 pnpm build
```

To start the production server:

```bash
 pnpm start
```

## 🔍 Code Quality

We maintain high code quality standards using ESLint and Prettier.

- **Lint:** `pnpm lint` (Checks for code issues)
- **Format:** `pnpm format` (Formats code with Prettier)
- **Type Check:** `pnpm types:check` (Runs TypeScript type checking)

## 🤝 Contributing

Contributions are welcome! Please check the `content` directory to add or update documentation.

## 📄 License

[Apache 2.0](LICENSE) © Sylinko Inc.

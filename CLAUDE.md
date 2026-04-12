# CLAUDE.md

## Project Overview

A Hugo static site / blog deployed on Cloudflare Pages. Hugo version: 0.160.1.

## Commands

```bash
hugo server -D    # dev server with drafts
hugo              # production build (output: public/)
hugo new posts/YYYY-MM-DD-my-post.md  # new post from archetype
```

## Directory Structure

```
hugo.toml                  # all site config (params, menus, taxonomies, markup, output formats)
archetypes/posts.md        # template for new posts
content/
  _index.md                # home page content
  about.md                 # about page (uses github-profile shortcode)
  posts/
    _index.md              # posts section index
    YYYY-MM-DD-slug.md     # blog posts (date-prefixed filenames, slug in front matter)
  feed/
    _index.md              # drives Atom feed output
layouts/
  _default/
    baseof.html            # base template (inlines all CSS, loads JS)
    home.html              # home page — shows latest post
    single.html            # generic single page
    list.html              # generic list page
    home.favicon.svg       # dynamic favicon from theme colors
    _markup/
      render-heading.html  # adds anchor links to headings
      render-image.html    # image optimization (avif/webp) for page bundle images
  posts/
    single.html            # post layout with prev/next navigation
    list.html              # posts listing
  partials/
    postslist.html         # reusable post list component
    modal.html             # modal dialog component (called with dict params)
  shortcodes/
    github-profile.html    # GitHub profile widget (client-side API fetch)
    swatch.html            # color swatch for theme showcase post
  feed/
    list.atom.xml          # custom Atom feed template
  404.html                 # 404 page
assets/css/
  index.css                # main stylesheet (semantic CSS variables)
  chroma.css               # syntax highlighting (Chroma classes mapped to theme variables)
  message-box.css          # message box styles
  themes/
    liminal-salt.css       # active theme — defines :root, [data-theme="dark"], [data-theme="light"]
    nord.css               # alternate theme
static/
  js/                      # theme-toggle.js, modal.js, image-modal.js (vanilla JS, no framework)
  feed/pretty-atom-feed.xsl
```

## Key Config (hugo.toml)

- **Permalinks**: posts use `/posts/:slug/` — slug comes from front matter, not filename
- **Markup**: Goldmark with `unsafe = true` (raw HTML in markdown). Chroma highlighting with CSS classes (`noClasses = false`)
- **Menus**: `[[menus.main]]` entries for nav (about, posts)
- **Theme params**: `[params.theme]` stores `name`, `accent`, `background` — used by favicon template and CSS loading
- **Output formats**: HTML + RSS + Favicon on home, custom Atom format for `/feed/feed.xml`

## Adding a New Post

```bash
hugo new posts/YYYY-MM-DD-my-post.md
```

Then edit the front matter:

```yaml
---
title: "Post Title"
description: "Post description"
date: YYYY-MM-DD
slug: my-post
tags: [tag1, tag2]
draft: false
---
```

Filename convention: `YYYY-MM-DD-slug.md` for chronological sorting in the directory. The `slug` field determines the URL.

## Theme System

- Active theme set via `params.theme.name` in `hugo.toml` (currently `"liminal-salt"`)
- Theme CSS in `assets/css/themes/` defines CSS custom properties for `:root`, `[data-theme="dark"]`, and `[data-theme="light"]`
- Light/dark toggle via `static/js/theme-toggle.js` with localStorage persistence, respects `prefers-color-scheme`
- Favicon uses `params.theme.accent` and `params.theme.background` from config

### Switching Themes

1. Change `params.theme.name` to the theme name (e.g., `"nord"`)
2. Update `params.theme.accent` and `params.theme.background` to match
3. Rebuild

### Adding a New Theme

1. Create `assets/css/themes/my-theme.css` with `:root`, `[data-theme="dark"]`, and `[data-theme="light"]` blocks
2. Required CSS variables: `--background`, `--foreground`, `--foreground-secondary`, `--accent`, `--accent-hover`, `--card`, `--border`, `--link`, `--link-active`, `--link-visited`, plus `--syntax-*` variables for code highlighting
3. Set `params.theme.name` in `hugo.toml`

## Modals

**From a template:**
```go-html-template
{{ partial "modal.html" (dict "id" "my-modal" "title" "Title" "content" "<p>Body</p>") }}
```

**Image modals:** Add `modal-image` class to any `<img>` — `image-modal.js` handles the rest automatically.

## Deployment

Cloudflare Pages with build command `hugo`, output directory `public`, and `HUGO_VERSION=0.160.1` environment variable.

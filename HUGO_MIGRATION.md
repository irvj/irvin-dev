# Hugo Migration Plan

Migration plan for irvin.dev from Eleventy (11ty) v3 to Hugo.

## Table of Contents

- [Overview](#overview)
- [What Gets Simpler in Hugo](#what-gets-simpler-in-hugo)
- [What Needs Extra Work](#what-needs-extra-work)
- [Migration Steps](#migration-steps)
  - [Step 1: Prerequisites](#step-1-prerequisites)
  - [Step 2: Scaffold Hugo Project](#step-2-scaffold-hugo-project)
  - [Step 3: Hugo Configuration](#step-3-hugo-configuration)
  - [Step 4: Theme CSS and Variables](#step-4-theme-css-and-variables)
  - [Step 5: Layouts and Templates](#step-5-layouts-and-templates)
  - [Step 6: Content Migration](#step-6-content-migration)
  - [Step 7: Partials and Components](#step-7-partials-and-components)
  - [Step 8: JavaScript and Static Assets](#step-8-javascript-and-static-assets)
  - [Step 9: RSS / Atom Feed](#step-9-rss--atom-feed)
  - [Step 10: Sitemap, 404, and Favicon](#step-10-sitemap-404-and-favicon)
  - [Step 11: Image Optimization](#step-11-image-optimization)
- [Complete File Mapping](#complete-file-mapping)
- [PrismJS to Chroma Migration](#prismjs-to-chroma-migration)
- [Deployment](#deployment)
- [Verification Checklist](#verification-checklist)

---

## Overview

### Features to Preserve

| Feature | 11ty Implementation | Hugo Equivalent |
|---------|-------------------|-----------------|
| Blog posts with tags | Markdown + front matter + `posts.11tydata.js` | Markdown + front matter + `_index.md` archetypes |
| Draft system | Preprocessor in `eleventy.config.js` | Built-in `draft: true` + `--buildDrafts` flag |
| Light/dark theme toggle | `theme-toggle.js` + CSS variables + localStorage | Same JS/CSS, no change needed |
| Multi-theme system | `_data/theme.js` parses CSS at build time | Custom data template or config params |
| Syntax highlighting | PrismJS plugin | Hugo built-in Chroma highlighter |
| RSS/Atom feed | `@11ty/eleventy-plugin-rss` | Built-in RSS output format or custom template |
| Heading anchors | `@zachleat/heading-anchors` web component | Hugo `render-heading` render hook |
| Image optimization | `@11ty/eleventy-img` transform | Hugo image processing pipes |
| Modal system | Nunjucks macro + JS | Hugo partial + same JS |
| Image modals | `modal-image` class + `image-modal.js` | Same JS, no change needed |
| GitHub profile widget | `github-profile.njk` include (client-side fetch) | Hugo partial (same client-side fetch) |
| Navigation | `@11ty/eleventy-navigation` plugin | Hugo menus in config |
| Tag pages | `tag-pages.njk` pagination over collections | Hugo taxonomies (built-in) |
| Sitemap | Custom `sitemap.xml.njk` | Built-in sitemap output |
| 404 page | `404.md` with custom permalink | `layouts/404.html` |
| Favicon from theme | `favicon.njk` template using theme data | Hugo template with site params |
| Content bundling | `{% css %}` / `{% js %}` shortcodes + `<style>` extraction | Direct CSS/JS includes (simpler) |
| View transitions | `@view-transition { navigation: auto; }` | Same CSS, no change |
| Archive page | `archive.njk` with posts list | Hugo list template |
| Posts list partial | `postslist.njk` | Hugo partial |
| Prev/next post links | `getPreviousCollectionItem` / `getNextCollectionItem` | `.PrevInSection` / `.NextInSection` |
| Date formatting | Luxon filters (`readableDate`, `htmlDateString`) | Go `time.Format` |

---

## What Gets Simpler in Hugo

### Drafts
11ty requires a custom preprocessor and Zod schema validation. Hugo has `draft: true` built-in — drafts are excluded by default, included with `hugo --buildDrafts` or `hugo server -D`.

### RSS/Atom Feed
11ty needs the `@11ty/eleventy-plugin-rss` plugin and configuration. Hugo generates RSS out of the box at `/index.xml` for any list page. Custom templates override the default.

### Syntax Highlighting
11ty requires the PrismJS plugin and client-side JS. Hugo uses Chroma (server-side) — no JS payload, configured in `hugo.toml`.

### Static Assets
11ty uses `addPassthroughCopy` for each static directory. Hugo automatically serves everything in `static/` at the site root.

### Sitemap
11ty requires a custom `sitemap.xml.njk` template. Hugo generates `/sitemap.xml` automatically.

### Tag Pages
11ty requires `tag-pages.njk` with pagination over collections. Hugo taxonomies generate tag list and term pages automatically.

### 404 Page
11ty needs `permalink: 404.html` and `eleventyExcludeFromCollections: true`. Hugo uses `layouts/404.html` by convention.

### Prev/Next Posts
11ty uses `getPreviousCollectionItem` / `getNextCollectionItem` filters. Hugo has `.PrevInSection` / `.NextInSection` built-in on every page.

### Date Formatting
11ty requires Luxon and custom filters. Hugo has Go's `time.Format` and helpers like `.Format`, `dateFormat`, `time` built-in.

---

## What Needs Extra Work

### Theme CSS Parsing at Build Time
`_data/theme.js` reads CSS files with Node.js `readFileSync` and regex to extract color values for the favicon. In Hugo, this must be replicated with either:
- Site params in `hugo.toml` (simplest — just duplicate the two color values)
- A data file that the favicon template reads

**Recommendation:** Store `accent` and `background` in `hugo.toml` `[params.theme]`. Two lines of config replaces the entire `_data/theme.js` file.

### Data Cascade
11ty's directory data files (`content.11tydata.js`, `posts.11tydata.js`) set defaults for entire directories. Hugo uses:
- `_index.md` front matter for section-level defaults
- `cascade` in front matter or config to propagate values down
- `archetypes/` for new content templates

### Nunjucks Macros (Modal Component)
The modal uses a Nunjucks `{% macro modal(id, title, content) %}`. Hugo doesn't have macros — use a partial with dict params:
```go-html-template
{{ partial "modal.html" (dict "id" "my-modal" "title" "Title" "content" "<p>Body</p>") }}
```

### Heading Anchors
The `@zachleat/heading-anchors` web component wraps `<main>` content. In Hugo, use a markdown render hook (`render-heading.html`) to inject anchor links directly into rendered headings — no client-side JS needed.

### Content Bundling
11ty's `{% css %}` / `{% js %}` paired shortcodes and automatic `<style>` / `<script>` extraction into bundles has no direct Hugo equivalent. Options:
- Inline CSS/JS directly in templates (current approach is already inlining via `{% include %}`)
- Use Hugo Pipes for asset processing (concat, minify)

Since the current site already inlines all CSS via `{% include "css/..." %}` in `base.njk`, the migration is straightforward: use Hugo's `resources.Get` + `resources.Concat` or just keep inlining.

### Navigation
11ty uses `@11ty/eleventy-navigation` with `eleventyNavigation` front matter. Hugo uses menus defined in `hugo.toml` or front matter `menu:` entries.

---

## Migration Steps

### Step 1: Prerequisites

Install Hugo (extended edition for SCSS support, though not strictly needed here):

```bash
# macOS
brew install hugo

# Verify
hugo version
```

Minimum Hugo version: **0.128.0+** (for latest features and render hooks).

### Step 2: Scaffold Hugo Project

Create the Hugo project structure alongside (or replacing) the 11ty project:

```
irvin-dev/
├── hugo.toml
├── archetypes/
│   └── posts.md
├── assets/
│   └── css/
│       ├── index.css
│       ├── message-box.css
│       ├── prism-diff.css        # renamed for Chroma
│       └── themes/
│           ├── liminal-salt.css
│           └── nord.css
├── content/
│   ├── _index.md
│   ├── about.md
│   ├── posts/
│   │   ├── _index.md
│   │   ├── start.md
│   │   └── liminal-salt-theme.md
│   └── tags/
│       └── _index.md
├── data/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── home.html
│   │   ├── list.html
│   │   └── single.html
│   ├── posts/
│   │   └── single.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── postslist.html
│   │   ├── modal.html
│   │   └── github-profile.html
│   ├── _default/
│   │   └── _markup/
│   │       └── render-heading.html
│   ├── 404.html
│   └── index.xml          # custom RSS template (optional)
├── static/
│   └── js/
│       ├── theme-toggle.js
│       ├── modal.js
│       └── image-modal.js
└── public/                 # generated output (gitignored)
```

### Step 3: Hugo Configuration

Create `hugo.toml`:

```toml
baseURL = "https://irvin.dev/"
languageCode = "en"
title = "irvin.dev"

# Theme (not a Hugo theme — just site params for our CSS theme system)
[params]
  description = ""

[params.author]
  name = "Joseph Irvin"
  email = ""
  url = "https://irvin.dev"

[params.theme]
  name = "liminal-salt"
  accent = "#8fac98"
  background = "#1a1c1b"

# Menus (replaces eleventy-navigation)
[menus]
  [[menus.main]]
    name = "Posts"
    url = "/posts/"
    weight = 3

  [[menus.main]]
    name = "About"
    url = "/about/"
    weight = 2

# Taxonomies
[taxonomies]
  tag = "tags"

# Permalinks
[permalinks]
  [permalinks.page]
    posts = "/posts/:slug/"

# Markdown / Goldmark
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true  # allow raw HTML in markdown (needed for inline HTML in posts)

  [markup.highlight]
    style = "base16-snazzy"  # placeholder — will be overridden by CSS
    noClasses = false         # use CSS classes (not inline styles) for syntax highlighting
    tabWidth = 2
    lineNos = false
    guessSyntax = false

# Output formats
[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML"]
  taxonomy = ["HTML"]
  term = ["HTML"]

# RSS configuration
[services]
  [services.rss]
    limit = 10

# Sitemap
[sitemap]
  changeFreq = ""
  filename = "sitemap.xml"
  priority = -1

# Build
[build]
  [build.buildStats]
    enable = false
```

Create `archetypes/posts.md`:

```markdown
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
tags: []
draft: false
---
```

### Step 4: Theme CSS and Variables

#### Move CSS to `assets/css/`

Hugo's asset pipeline (`resources.Get`) reads from `assets/`. Move all CSS files there:

```
assets/css/
├── index.css
├── message-box.css
├── chroma.css            # generated (see below)
└── themes/
    ├── liminal-salt.css
    └── nord.css
```

The theme CSS files (`liminal-salt.css`, `nord.css`) are used as-is — they define `:root`, `[data-theme="dark"]`, and `[data-theme="light"]` blocks with CSS custom properties.

#### Generate Chroma CSS

Hugo's Chroma highlighter outputs CSS classes when `noClasses = false`. Generate a base stylesheet, then **discard it** — the existing semantic token styles in `index.css` will be remapped to Chroma classes (see [PrismJS to Chroma Migration](#prismjs-to-chroma-migration)).

```bash
hugo gen chromastyles --style=monokailight > /dev/null  # just to see available classes
```

#### Create `assets/css/chroma.css`

Map the semantic CSS variables to Chroma token classes. See the [PrismJS to Chroma Migration](#prismjs-to-chroma-migration) section for the complete mapping.

### Step 5: Layouts and Templates

#### `layouts/_default/baseof.html`

This replaces `_includes/layouts/base.njk`:

```go-html-template
<!doctype html>
<html lang="{{ site.Language.Lang }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ if .Title }}{{ .Title }}{{ else }}{{ site.Title }}{{ end }}</title>
    <meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate" href="/index.xml" type="application/rss+xml" title="{{ site.Title }}">

    {{/* Theme CSS */}}
    {{ $theme := resources.Get (printf "css/themes/%s.css" site.Params.theme.name) }}
    {{ $main := resources.Get "css/index.css" }}
    {{ $chroma := resources.Get "css/chroma.css" }}
    {{ $messageBox := resources.Get "css/message-box.css" }}
    <style>{{ $theme.Content | safeCSS }}</style>
    <style>{{ $main.Content | safeCSS }}</style>
    <style>{{ $chroma.Content | safeCSS }}</style>
    <style>{{ $messageBox.Content | safeCSS }}</style>

    {{/* Theme toggle - loaded early to prevent flash */}}
    <script src="/js/theme-toggle.js"></script>

    {{/* Modal scripts */}}
    <script src="/js/modal.js"></script>
    <script src="/js/image-modal.js"></script>
  </head>
  <body>
    <a href="#main" id="skip-link" class="visually-hidden">Skip to main content</a>

    <header>
      <a href="/" class="home-link">{{ site.Title }}</a>

      <nav class="nav">
        {{ range site.Menus.main }}
          <a href="{{ .URL }}" class="nav-item"{{ if $.IsMenuCurrent "main" . }} aria-current="page"{{ end }}>{{ .Name }}</a>
        {{ end }}
      </nav>

      <button id="theme-toggle" aria-label="Toggle theme" class="theme-toggle-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
      </button>
    </header>

    <main id="main">
      {{ block "main" . }}{{ end }}
    </main>

    <footer>
    </footer>
  </body>
</html>
```

#### `layouts/_default/home.html`

This replaces `content/index.njk` — shows the latest blog post:

```go-html-template
{{ define "main" }}
  {{ $posts := where site.RegularPages "Section" "posts" }}
  {{ $latest := index $posts 0 }}
  {{ if $latest }}
  <article>
    <h1>{{ $latest.Title }}</h1>

    <ul class="post-metadata">
      <li><time datetime="{{ $latest.Date.Format "2006-01-02" }}">{{ $latest.Date.Format "02 January 2006" }}</time></li>
      {{ range $latest.Params.tags }}
        {{ $tag := . | urlize }}
        <li><a href="/tags/{{ $tag }}/" class="post-tag">{{ . }}</a></li>
      {{ end }}
    </ul>

    {{ $latest.Content }}
  </article>
  {{ else }}
  <p>No posts yet.</p>
  {{ end }}
{{ end }}
```

#### `layouts/_default/list.html`

General list page (used by archive, tags index):

```go-html-template
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ .Content }}
  {{ partial "postslist.html" .Pages }}
{{ end }}
```

#### `layouts/_default/single.html`

Default single page (about, etc.):

```go-html-template
{{ define "main" }}
  {{ .Content }}
{{ end }}
```

#### `layouts/posts/single.html`

This replaces `_includes/layouts/post.njk`:

```go-html-template
{{ define "main" }}
<article>
  <h1>{{ .Title }}</h1>

  <ul class="post-metadata">
    <li><time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "02 January 2006" }}</time></li>
    {{ range .Params.tags }}
      {{ $tag := . | urlize }}
      <li><a href="/tags/{{ $tag }}/" class="post-tag">{{ . }}</a></li>
    {{ end }}
  </ul>

  {{ .Content }}

  {{ $pages := where site.RegularPages "Section" "posts" }}
  {{ with .PrevInSection }}
    {{ $.Scratch.Set "prevPost" . }}
  {{ end }}
  {{ with .NextInSection }}
    {{ $.Scratch.Set "nextPost" . }}
  {{ end }}

  {{ if or ($.Scratch.Get "prevPost") ($.Scratch.Get "nextPost") }}
  <ul class="links-nextprev">
    {{ with $.Scratch.Get "prevPost" }}
      <li class="links-nextprev-prev">&larr; Previous<br> <a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
    {{ end }}
    {{ with $.Scratch.Get "nextPost" }}
      <li class="links-nextprev-next">Next &rarr;<br><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
    {{ end }}
  </ul>
  {{ end }}
</article>
{{ end }}
```

#### `layouts/posts/list.html`

Posts section list (the "Posts" page at `/posts/`):

```go-html-template
{{ define "main" }}
  <h1>Posts</h1>
  {{ partial "postslist.html" .Pages.ByDate.Reverse }}
{{ end }}
```

### Step 6: Content Migration

#### Front Matter Changes

11ty uses YAML front matter. Hugo also uses YAML (or TOML/JSON). Most front matter is compatible. Key changes:

**Posts:** Remove explicit `permalink` — Hugo uses the `[permalinks]` config. If a post has a custom slug that differs from the filename, add `slug:` instead.

Before (11ty):
```yaml
---
title: Start
description: Let's begin.
date: 2025-12-13
permalink: /posts/start/
---
```

After (Hugo):
```yaml
---
title: Start
description: Let's begin.
date: 2025-12-13
slug: start
---
```

**About page:** The 11ty about page uses JavaScript front matter for navigation. In Hugo, navigation is handled by `hugo.toml` menus, so the front matter simplifies to:

Before (11ty):
```js
---js
const eleventyNavigation = {
  key: "about",
  order: 2
};
---
```

After (Hugo):
```yaml
---
title: About
---
```

**404 page:** Move to `content/404.md` or `layouts/404.html`. Remove `permalink: 404.html` and `eleventyExcludeFromCollections: true` — Hugo handles this by convention.

#### Content Files

Move content files from `content/posts/` to Hugo's `content/posts/`. Rename to match desired slugs if needed. The current filenames use a date prefix pattern (`25-12-13-start.md`) — Hugo can derive dates from front matter, so filenames can be simplified:

| 11ty Path | Hugo Path |
|-----------|-----------|
| `content/posts/25-12-13-start.md` | `content/posts/start.md` |
| `content/posts/26-03-07-liminal-salt-theme.md` | `content/posts/liminal-salt-theme.md` |

#### Section `_index.md` Files

Create `_index.md` files for Hugo sections:

`content/_index.md`:
```yaml
---
title: "irvin.dev"
---
```

`content/posts/_index.md`:
```yaml
---
title: "Posts"
---
```

#### Template Syntax in Markdown

The about page uses `{% include "github-profile.njk" %}` — Nunjucks template syntax inside markdown. Hugo doesn't support this directly. Replace with a Hugo shortcode:

Create `layouts/shortcodes/github-profile.html` with the same HTML/JS content, then call it in markdown:

```markdown
{{</* github-profile */>}}
```

Similarly, any Nunjucks templates used inside markdown content must be converted to Hugo shortcodes.

### Step 7: Partials and Components

#### `layouts/partials/postslist.html`

Replaces `_includes/postslist.njk`:

```go-html-template
<ol class="postlist">
{{ range . }}
  <li class="postlist-item">
    <a href="{{ .RelPermalink }}" class="postlist-link">{{ if .Title }}{{ .Title }}{{ else }}<code>{{ .RelPermalink }}</code>{{ end }}</a>
    <time class="postlist-date" datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "02 January 2006" }}</time>
  </li>
{{ end }}
</ol>
```

#### `layouts/partials/modal.html`

Replaces `_includes/components/modal.njk` macro:

```go-html-template
{{/* Usage: {{ partial "modal.html" (dict "id" "my-id" "title" "Title" "content" "<p>Body</p>") }} */}}
<div id="{{ .id }}" class="modal" role="dialog" aria-modal="true" aria-labelledby="{{ .id }}-title" hidden>
  <div class="modal-backdrop" data-modal-close></div>
  <div class="modal-container">
    <div class="modal-header">
      <h2 id="{{ .id }}-title" class="modal-title">{{ .title }}</h2>
      <button class="modal-close" data-modal-close aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
    <div class="modal-content">
      {{ .content | safeHTML }}
    </div>
  </div>
</div>
```

#### `layouts/shortcodes/github-profile.html`

Replaces `_includes/github-profile.njk` (used as a shortcode in markdown content):

```go-html-template
<div id="github-profile" class="github-profile">
  <div class="github-profile-loading">Loading GitHub profile...</div>
</div>

<script>
(function() {
  const username = 'irvj';
  const profileContainer = document.getElementById('github-profile');

  fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(data => {
      const largeAvatarUrl = data.avatar_url.replace(/\?.*$/, '') + '?s=460';

      profileContainer.innerHTML = `
        <svg class="github-logo" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <img src="${largeAvatarUrl}" alt="" data-modal-title="${data.name || data.login}" class="github-avatar modal-image">
        <div class="github-info">
          <h2 class="github-name">${data.name || data.login}</h2>
          ${data.bio ? '<p class="github-bio">' + data.bio + '</p>' : ''}
          <a href="${data.html_url}" class="github-link" target="_blank" rel="noopener noreferrer">@${data.login}</a>
        </div>
      `;

      if (window.initImageModals) {
        window.initImageModals();
      }
    })
    .catch(error => {
      console.error('Error fetching GitHub profile:', error);
      profileContainer.innerHTML = `
        <div class="github-error">
          <p>Unable to load GitHub profile</p>
          <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">Visit @${username} on GitHub</a>
        </div>
      `;
    });
})();
</script>
```

#### `layouts/_default/_markup/render-heading.html`

Replaces `@zachleat/heading-anchors` web component with a render hook:

```go-html-template
<h{{ .Level }} id="{{ .Anchor | safeURL }}">
  {{ .Text }}
  <a class="ha" href="#{{ .Anchor | safeURL }}" aria-hidden="true">#</a>
</h{{ .Level }}>
```

Also add a `.ha` placeholder style if desired (the existing CSS already has `.ha` and `.ha-placeholder` styles).

### Step 8: JavaScript and Static Assets

Copy all files from `public/` to `static/`:

```
public/js/theme-toggle.js  →  static/js/theme-toggle.js
public/js/modal.js          →  static/js/modal.js
public/js/image-modal.js    →  static/js/image-modal.js
```

These JavaScript files require **no changes** — they're framework-agnostic vanilla JS that works with the DOM directly.

Remove the `@zachleat/heading-anchors` script include from `baseof.html` since heading anchors are now handled by the render hook. Also remove the `<heading-anchors>` wrapper element from around `{{ content }}`.

Remove the `{% getBundle "js" %}` script tag — Hugo doesn't use content bundling. If you need per-page JS, use Hugo's asset pipeline or shortcodes.

### Step 9: RSS / Atom Feed

Hugo generates RSS at `/index.xml` by default. The current 11ty site generates an Atom feed at `/feed/feed.xml`. Two options:

**Option A: Use Hugo's default RSS (simplest)**

Hugo generates RSS 2.0 at `/index.xml`. Update the `<link rel="alternate">` in `baseof.html` to point there. Move the XSL stylesheet to `static/feed/pretty-atom-feed.xsl` if you want to keep styled XML.

**Option B: Custom Atom feed at `/feed/feed.xml`**

Create a custom output format in `hugo.toml`:

```toml
[mediaTypes]
  [mediaTypes."application/atom+xml"]
    suffixes = ["xml"]

[outputFormats]
  [outputFormats.Atom]
    mediaType = "application/atom+xml"
    baseName = "feed"
    rel = "alternate"
    isPlainText = false

[outputs]
  home = ["HTML", "Atom"]
```

Then create `layouts/_default/home.atom.xml`:

```go-html-template
<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/feed/pretty-atom-feed.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{{ site.Title }}</title>
  <subtitle>{{ site.Params.description }}</subtitle>
  <link href="{{ site.BaseURL }}" />
  <link href="{{ "feed/feed.xml" | absURL }}" rel="self" />
  <updated>{{ now.Format "2006-01-02T15:04:05Z" }}</updated>
  <id>{{ site.BaseURL }}</id>
  <author>
    <name>{{ site.Params.author.name }}</name>
  </author>
  {{ $pages := where site.RegularPages "Section" "posts" }}
  {{ range first 10 $pages }}
  <entry>
    <title>{{ .Title }}</title>
    <link href="{{ .Permalink }}" />
    <id>{{ .Permalink }}</id>
    <updated>{{ .Date.Format "2006-01-02T15:04:05Z" }}</updated>
    <content type="html">{{ .Content | html }}</content>
  </entry>
  {{ end }}
</feed>
```

For the Atom feed, copy the XSL stylesheet:
```
content/feed/pretty-atom-feed.xsl  →  static/feed/pretty-atom-feed.xsl
```

### Step 10: Sitemap, 404, and Favicon

#### Sitemap

Hugo generates `/sitemap.xml` automatically. No custom template needed. Delete `content/sitemap.xml.njk`.

#### 404 Page

Create `layouts/404.html`:

```go-html-template
{{ define "main" }}
  <h1>Content not found.</h1>
  <p>Go <a href="/">home</a>.</p>
{{ end }}
```

Cloudflare Pages automatically serves `404.html` for missing routes.

#### Favicon

Create `layouts/partials/favicon.svg` or generate it as a template.

**Option A: Static template** — Create `layouts/index.svg` with a custom output format:

Add to `hugo.toml`:
```toml
[mediaTypes]
  [mediaTypes."image/svg+xml"]
    suffixes = ["svg"]

[outputFormats]
  [outputFormats.Favicon]
    mediaType = "image/svg+xml"
    baseName = "favicon"
    rel = "icon"
    isPlainText = true
    notAlternative = true

[outputs]
  home = ["HTML", "Atom", "Favicon"]
```

Create `layouts/_default/home.favicon.svg`:

```go-html-template
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="24" height="24" rx="4" fill="{{ site.Params.theme.background }}" stroke="none"/>
  <path d="M12 19h8" fill="none" stroke="{{ site.Params.theme.accent }}"/>
  <path d="m4 17 6-6-6-6" fill="none" stroke="{{ site.Params.theme.accent }}"/>
</svg>
```

**Option B: Simple static file** — Just render the SVG once with the correct colors and save as `static/favicon.svg`. Only regenerate when theme colors change.

### Step 11: Image Optimization

Hugo has built-in image processing. The 11ty site uses `@11ty/eleventy-img` to automatically transform all images to avif/webp formats with lazy loading.

#### Hugo Image Processing via Render Hook

Create `layouts/_default/_markup/render-image.html`:

```go-html-template
{{ $img := .Page.Resources.GetMatch .Destination }}
{{ if $img }}
  {{ $webp := $img.Resize (printf "%dx webp" $img.Width) }}
  {{ $avif := $img.Resize (printf "%dx avif" $img.Width) }}
  <picture>
    <source srcset="{{ $avif.RelPermalink }}" type="image/avif">
    <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
    <img src="{{ $img.RelPermalink }}" alt="{{ .Text }}" loading="lazy" decoding="async"
      {{ with $img.Width }}width="{{ . }}"{{ end }}
      {{ with $img.Height }}height="{{ . }}"{{ end }}
      {{ with .Title }}title="{{ . }}"{{ end }}>
  </picture>
{{ else }}
  {{/* Fallback for external images or unresolved paths */}}
  <img src="{{ .Destination | safeURL }}" alt="{{ .Text }}" loading="lazy" decoding="async"
    {{ with .Title }}title="{{ . }}"{{ end }}>
{{ end }}
```

#### Page Bundles for Images

Hugo's image processing requires images to be page resources. Convert posts with images to page bundles:

```
content/posts/my-post/
├── index.md
└── my-image.jpg
```

Instead of:
```
content/posts/my-post.md
```

#### Modal Images

Images with `class="modal-image"` are set via raw HTML in markdown, not via markdown image syntax. These bypass the render hook and work as-is with `image-modal.js`. For these, either:
- Keep them as raw HTML (current approach)
- Or create a shortcode: `{{</* modal-image src="image.jpg" alt="Description" */>}}`

---

## Complete File Mapping

| 11ty File | Hugo Equivalent | Notes |
|-----------|----------------|-------|
| `eleventy.config.js` | `hugo.toml` | All config moves here |
| `package.json` | *(none)* | Hugo is a single binary, no npm |
| `_data/metadata.js` | `hugo.toml` `[params]` | Site metadata in config |
| `_data/theme.js` | `hugo.toml` `[params.theme]` | Theme name + colors |
| `_data/eleventyDataSchema.js` | *(none)* | Hugo validates drafts natively |
| `_config/filters.js` | *(none)* | Hugo has built-in equivalents |
| `_includes/layouts/base.njk` | `layouts/_default/baseof.html` | Base template |
| `_includes/layouts/home.njk` | `layouts/_default/home.html` | Home page |
| `_includes/layouts/post.njk` | `layouts/posts/single.html` | Post layout |
| `_includes/postslist.njk` | `layouts/partials/postslist.html` | Posts list partial |
| `_includes/components/modal.njk` | `layouts/partials/modal.html` | Modal partial (macro → dict) |
| `_includes/github-profile.njk` | `layouts/shortcodes/github-profile.html` | Shortcode (used in markdown) |
| `content/index.njk` | `layouts/_default/home.html` + `content/_index.md` | Home page split into layout + content |
| `content/tags.njk` | *(built-in)* | Hugo taxonomy list |
| `content/tag-pages.njk` | *(built-in)* | Hugo taxonomy term pages |
| `content/archive.njk` | `content/posts/_index.md` + `layouts/posts/list.html` | Posts section list |
| `content/sitemap.xml.njk` | *(built-in)* | Hugo generates sitemap |
| `content/404.md` | `layouts/404.html` | 404 page |
| `content/favicon.njk` | `layouts/_default/home.favicon.svg` | Custom output format |
| `content/about.md` | `content/about.md` | Minimal front matter changes |
| `content/content.11tydata.js` | *(none)* | Layout set per-section or in config |
| `content/posts/posts.11tydata.js` | `content/posts/_index.md` + `archetypes/posts.md` | Section defaults |
| `content/feed/pretty-atom-feed.xsl` | `static/feed/pretty-atom-feed.xsl` | Static asset |
| `css/index.css` | `assets/css/index.css` | Moved to assets |
| `css/message-box.css` | `assets/css/message-box.css` | Moved to assets |
| `css/prism-diff.css` | `assets/css/chroma.css` | Remapped for Chroma classes |
| `css/themes/liminal-salt.css` | `assets/css/themes/liminal-salt.css` | No change |
| `css/themes/nord.css` | `assets/css/themes/nord.css` | No change |
| `public/js/theme-toggle.js` | `static/js/theme-toggle.js` | No change |
| `public/js/modal.js` | `static/js/modal.js` | No change |
| `public/js/image-modal.js` | `static/js/image-modal.js` | No change |

---

## PrismJS to Chroma Migration

Hugo uses Chroma for syntax highlighting. When `noClasses = false` in `hugo.toml`, Chroma outputs CSS classes instead of inline styles. The class names differ from PrismJS.

### Token Class Mapping

Replace the PrismJS `.token.*` rules in `index.css` with Chroma equivalents. Create `assets/css/chroma.css`:

```css
/* Chroma syntax highlighting — mapped from PrismJS semantic variables */

/* Background for code blocks (replaces pre[class*="language-"] rule) */
.highlight pre {
  background: var(--hover);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  tab-size: 2;
}

.highlight pre code {
  color: var(--foreground);
}

/* Comments */
.highlight .c,    /* Comment */
.highlight .ch,   /* Comment.Hashbang */
.highlight .cm,   /* Comment.Multiline */
.highlight .c1,   /* Comment.Single */
.highlight .cs {  /* Comment.Special */
  color: var(--foreground-muted);
}

/* Punctuation */
.highlight .p {   /* Punctuation */
  color: var(--foreground-muted);
}

/* Keywords */
.highlight .k,    /* Keyword */
.highlight .kc,   /* Keyword.Constant */
.highlight .kd,   /* Keyword.Declaration */
.highlight .kn,   /* Keyword.Namespace */
.highlight .kp,   /* Keyword.Pseudo */
.highlight .kr,   /* Keyword.Reserved */
.highlight .kt {  /* Keyword.Type */
  color: var(--accent);
}

/* Strings */
.highlight .s,    /* Literal.String */
.highlight .sa,   /* Literal.String.Affix */
.highlight .sb,   /* Literal.String.Backtick */
.highlight .sc,   /* Literal.String.Char */
.highlight .dl,   /* Literal.String.Delimiter */
.highlight .sd,   /* Literal.String.Doc */
.highlight .s2,   /* Literal.String.Double */
.highlight .se,   /* Literal.String.Escape */
.highlight .sh,   /* Literal.String.Heredoc */
.highlight .si,   /* Literal.String.Interpol */
.highlight .sx,   /* Literal.String.Other */
.highlight .sr,   /* Literal.String.Regex */
.highlight .s1,   /* Literal.String.Single */
.highlight .ss {  /* Literal.String.Symbol */
  color: var(--message-bg);
}

/* Numbers */
.highlight .m,    /* Literal.Number */
.highlight .mb,   /* Literal.Number.Bin */
.highlight .mf,   /* Literal.Number.Float */
.highlight .mh,   /* Literal.Number.Hex */
.highlight .mi,   /* Literal.Number.Integer */
.highlight .il,   /* Literal.Number.Integer.Long */
.highlight .mo {  /* Literal.Number.Oct */
  color: var(--accent-hover);
}

/* Booleans (Chroma treats as Keyword.Constant) */
/* Already covered by .kc above */

/* Names / Identifiers */
.highlight .na {  /* Name.Attribute */
  color: var(--message-bg);
}
.highlight .nb {  /* Name.Builtin */
  color: var(--message-bg);
}
.highlight .nc {  /* Name.Class */
  color: var(--diff-deleted);
}
.highlight .nf,   /* Name.Function */
.highlight .fm {  /* Name.Function.Magic */
  color: var(--diff-deleted);
}
.highlight .nt {  /* Name.Tag */
  color: var(--diff-deleted);
}
.highlight .nn {  /* Name.Namespace */
  opacity: 0.7;
}

/* Operators */
.highlight .o,    /* Operator */
.highlight .ow {  /* Operator.Word */
  color: var(--foreground-muted);
}

/* Decorators */
.highlight .nd {  /* Name.Decorator */
  color: var(--diff-deleted);
}

/* Variables */
.highlight .nv,   /* Name.Variable */
.highlight .vc,   /* Name.Variable.Class */
.highlight .vg,   /* Name.Variable.Global */
.highlight .vi,   /* Name.Variable.Instance */
.highlight .vm {  /* Name.Variable.Magic */
  color: var(--foreground-muted);
}

/* Deleted / Inserted (diff highlighting) */
.highlight .gd {  /* Generic.Deleted */
  background-color: var(--diff-deleted);
  color: inherit;
}
.highlight .gi {  /* Generic.Inserted */
  background-color: var(--diff-inserted);
  color: inherit;
}

/* Generic emphasis */
.highlight .ge {  /* Generic.Emph */
  font-style: italic;
}
.highlight .gs {  /* Generic.Strong */
  font-weight: bold;
}
```

### Diff Highlighting

The `css/prism-diff.css` handles PrismJS diff syntax (`language-diff-*`). Hugo uses Chroma's diff lexer which outputs `.gd` (deleted) and `.gi` (inserted) classes. The mapping above covers this. The diff prefix unselectable behavior can be preserved with:

```css
/* Diff prefix characters */
.highlight .gd .x,
.highlight .gi .x {
  -webkit-user-select: none;
  user-select: none;
}
```

### Removing PrismJS

After migration, remove from `package.json`:
- `@11ty/eleventy-plugin-syntaxhighlight`
- `prismjs`

Remove from CSS:
- All `.token.*` rules in `index.css`
- `css/prism-diff.css`
- `pre[class*="language-"]` rules (replace with `.highlight pre`)

---

## Deployment

### Cloudflare Pages

The current site deploys on Cloudflare Pages. Update the build configuration:

| Setting | 11ty Value | Hugo Value |
|---------|-----------|------------|
| Build command | `npx @11ty/eleventy` | `hugo` |
| Output directory | `_site` | `public` |
| Environment variable | — | `HUGO_VERSION=0.145.0` (or latest) |

Cloudflare Pages has native Hugo support. Set `HUGO_VERSION` in environment variables to pin the version.

### Development Commands

| Task | 11ty | Hugo |
|------|------|------|
| Dev server | `npm start` | `hugo server -D` |
| Production build | `npm run build` | `hugo` |
| Build with drafts | `npm start` (auto) | `hugo server -D` |
| New post | manual | `hugo new posts/my-post.md` |

---

## Verification Checklist

### Pages

- [ ] Home page shows latest blog post with title, date, tags, and full content
- [ ] Posts page (`/posts/`) lists all posts in reverse chronological order
- [ ] About page (`/about/`) renders with GitHub profile widget
- [ ] Individual post pages render with title, date, tags, content, prev/next links
- [ ] Tag pages (`/tags/TAG/`) list posts for each tag
- [ ] Tags index (`/tags/`) lists all tags (if desired — may be removed)
- [ ] 404 page renders at `/404.html`

### Visual Parity

- [ ] Liminal Salt theme colors match (dark and light modes)
- [ ] Nord theme can be activated by changing config
- [ ] Light/dark toggle works with localStorage persistence
- [ ] System `prefers-color-scheme` respected as default
- [ ] Typography, spacing, and layout match original
- [ ] Code blocks styled correctly with Chroma classes
- [ ] Inline code styled correctly
- [ ] Blockquotes styled correctly
- [ ] Navigation header matches (logo, nav items, theme toggle)
- [ ] Footer matches (currently empty)
- [ ] View transitions still work (`@view-transition { navigation: auto; }`)

### Blog Features

- [ ] Post dates formatted as "DD Month YYYY" (e.g., "13 December 2025")
- [ ] Tags link to correct tag pages
- [ ] Previous/next post navigation works
- [ ] Posts list partial renders correctly on archive and tag pages
- [ ] Draft posts hidden in production build, shown in dev server

### RSS Feed

- [ ] Feed accessible at expected URL (`/index.xml` or `/feed/feed.xml`)
- [ ] Feed contains correct post entries (limited to 10)
- [ ] Feed validates (W3C Feed Validation Service)
- [ ] XSL stylesheet renders feed in browser (if kept)
- [ ] `<link rel="alternate">` in HTML head points to feed

### Favicon

- [ ] SVG favicon renders at `/favicon.svg`
- [ ] Uses theme accent and background colors
- [ ] `<link rel="icon">` in HTML head points to favicon

### Modals

- [ ] Modal partial works when called from templates
- [ ] Image modals work on `modal-image` class images
- [ ] GitHub avatar opens in modal on click
- [ ] ESC key closes modals
- [ ] Backdrop click closes modals
- [ ] Focus trap works within open modals
- [ ] Keyboard navigation (Enter/Space to open)

### Heading Anchors

- [ ] Headings in posts have anchor links
- [ ] Anchor links use correct slugified IDs
- [ ] Clicking anchor scrolls and updates URL hash

### SEO

- [ ] `<title>` tag correct on all pages
- [ ] `<meta name="description">` present
- [ ] Sitemap generated at `/sitemap.xml`
- [ ] All internal links resolve (no 404s)
- [ ] Canonical URLs correct

### Build and Deploy

- [ ] `hugo` builds without errors
- [ ] `hugo server -D` runs dev server with drafts
- [ ] Build output matches expected file structure
- [ ] Cloudflare Pages build succeeds
- [ ] All routes work on deployed site

### Theme Switching

- [ ] Change `params.theme.name` to `"nord"` in `hugo.toml`
- [ ] Update `params.theme.accent` and `params.theme.background` to Nord values
- [ ] Rebuild — verify Nord colors applied everywhere
- [ ] Favicon uses Nord colors

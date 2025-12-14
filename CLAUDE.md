# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Eleventy (11ty) v3 static site generator blog based on the eleventy-base-blog starter template. The site generates a blog with posts, tags, feeds, and navigation.

## Build and Development Commands

```bash
# Development server with hot reload
npm start

# Production build (excludes drafts)
npm run build

# Debug mode with verbose logging
npm run debug
npm run debugstart  # with dev server

# Benchmark build performance
npm run benchmark
```

## Architecture

### Directory Structure

- **content/**: Source content and templates (input directory)
  - `posts/`: Blog post markdown files
  - `*.njk`: Page templates (index, tags, sitemap)
  - `content.11tydata.js`: Global data cascade for all content
  - `posts/posts.11tydata.js`: Data cascade specific to blog posts

- **_includes/**: Template partials and layouts
  - `layouts/`: Base layout templates (base.njk, home.njk, post.njk)
  - `components/`: Reusable components (modal.njk)
  - `postslist.njk`: Reusable component for rendering post lists
  - `github-profile.njk`: GitHub profile widget with API integration

- **_data/**: Global data files
  - `metadata.js`: Site metadata (title, URL, author, description)
  - `eleventyDataSchema.js`: Zod schema validation for front matter

- **_config/**: Eleventy configuration modules
  - `filters.js`: Custom template filters (date formatting, array manipulation)

- **public/**: Static assets copied directly to output
  - `css/`: Stylesheets (index.css, message-box.css, prism-diff.css)
  - `js/`: JavaScript files (theme-toggle.js, modal.js, image-modal.js)
  - `favicon.svg`: Site favicon

- **_site/**: Generated output directory (not tracked in git)

### Key Configuration (eleventy.config.js)

- **Input directory**: `content/`
- **Output directory**: `_site/`
- **Template formats**: Markdown, Nunjucks, HTML, Liquid, 11ty.js
- **Markdown preprocessor**: Nunjucks
- **HTML preprocessor**: Nunjucks

### Plugins and Features

1. **Drafts system**: Posts with `draft: true` in front matter are:
   - Marked with "(draft)" suffix in dev mode
   - Excluded from production builds (ELEVENTY_RUN_MODE=build)

2. **Image optimization**: Automatic image transform to avif/webp formats with lazy loading

3. **Content bundling**: CSS and JS bundles extracted from `<style>` and `<script>` tags

4. **RSS/Atom feed**: Generated at `/feed/feed.xml` (configurable in config)

5. **Syntax highlighting**: PrismJS via @11ty/eleventy-plugin-syntaxhighlight

6. **Navigation**: Site navigation managed via @11ty/eleventy-navigation

7. **View Transitions**: Cross-document view transitions enabled for smooth page navigation (50ms duration)

8. **Theme System**:
   - Light/dark mode toggle with Nord color palette
   - Theme preference stored in localStorage
   - Respects system `prefers-color-scheme` as default
   - No CSS transitions on theme change (handled by View Transitions API)

9. **Modal System**:
   - Reusable modal component (`components/modal.njk`)
   - Automatic image modals via `modal-image` class
   - Accessible with keyboard navigation, focus trap, ESC to close
   - Click backdrop or X button to close

10. **GitHub Integration**:
    - Dynamic GitHub profile widget on About page
    - Fetches profile data via GitHub API
    - Avatar image opens in modal on click

### Data Cascade

Eleventy uses a data cascade system where data flows from:
1. Global data files (`_data/*.js`)
2. Directory data files (`*.11tydata.js`)
3. Template front matter

Use `.11tydata.js` files to set defaults for entire directories (e.g., layout, permalink patterns).

### Custom Filters

Available in templates via `_config/filters.js`:
- `readableDate`: Format dates with Luxon
- `htmlDateString`: ISO date strings for HTML
- `head`: Get first n elements of array
- `filterTagList`: Remove "all" and "posts" from tag lists
- `sortAlphabetically`: Sort strings alphabetically

## Common Development Tasks

### Adding a New Blog Post

Create a markdown file in `content/posts/` with front matter:
```yaml
---
title: "Post Title"
description: "Post description"
date: 2025-10-28
tags:
  - tag1
  - tag2
draft: false  # Optional, set to true to exclude from production builds
---
```

### Modifying Site Metadata

Edit `_data/metadata.js` to change site title, URL, author info, or description. This data is available in all templates as `metadata.title`, `metadata.author.name`, etc.

### Adding Custom Filters

Add new filters to `_config/filters.js` using `eleventyConfig.addFilter(name, function)`.

### Working with Images

Place images in content directories. The image transform plugin automatically optimizes them. To opt-out specific images, use standard HTML: `<img eleventy:ignore src="...">`.

### Path Prefix for Subdirectories

If deploying to a subdirectory, uncomment and set `pathPrefix` in the config object at the bottom of `eleventy.config.js`. Use with the HtmlBasePlugin to automatically transform URLs.

### Using Modals

**Reusable Modal Component:**
```njk
{% from "components/modal.njk" import modal %}
{{ modal("modal-id", "Modal Title", "<p>Content here</p>") }}
<button onclick="openModal('modal-id')">Open Modal</button>
```

**Automatic Image Modals:**
Add `modal-image` class to any image to make it clickable with automatic modal:
```html
<img src="image.jpg" alt="Description" class="modal-image">
```

The image modal system:
- Automatically detects all images with `modal-image` class
- Creates unique modals for each image
- Uses image `alt` text as modal title
- Shows full-resolution image in modal
- Keyboard accessible (Enter/Space to open, ESC to close)

### Theme Toggle

The site uses a light/dark theme toggle with Nord color palette. Theme preference is stored in localStorage and respects system `prefers-color-scheme` as the default. The toggle button is in the header.

### GitHub Profile Widget

The About page includes a dynamic GitHub profile widget that fetches data from the GitHub API. To use it:
```njk
{% include "github-profile.njk" %}
```

The widget displays the user's avatar, name, bio, and a link to their GitHub profile. The avatar image is clickable and opens in a modal.

---
title: Liminal Salt Theme
description: Liminal Salt Theme
date: 2026-03-07
permalink: /posts/liminal-salt-theme/
---

{% from "components/swatch.njk" import swatch %}
{% set d = liminalSalt.ui.dark %}
{% set l = liminalSalt.ui.light %}
{% set sd = liminalSalt.syntax.dark %}
{% set sl = liminalSalt.syntax.light %}

<a href="https://github.com/irvj/liminal-salt" target="_blank">Liminal Salt</a> is an LLM frontend for OpenRouter that I built in Python and Django, but it also spawned a color theme that I've been using for various projects. The overall aesthetic is kind of a muted beige/sage milieu.

I'm a lover of Nord as a palette, but Liminal Salt has an earthy vibe that I really enjoy. I hope to keep building on it and maybe soon transition all my tools to using it.

It's still evolving, but here's the current palette:

## Dark Theme

### Base

The default page background and primary text colors. Foreground Secondary is for supporting text like subtitles and metadata.

<div class="swatch-row">
  {{ swatch(d.background, "Background", bordered=true) }}
  {{ swatch(d.foreground, "Foreground") }}
  {{ swatch(d.foregroundSecondary, "Foreground Secondary") }}
</div>

### Muted

A subdued surface for secondary UI like disabled states, chips, and sidebars. Muted Foreground is for placeholder text and de-emphasized labels.

<div class="swatch-row">
  {{ swatch(d.muted, "Muted", bordered=true) }}
  {{ swatch(d.mutedForeground, "Muted Foreground") }}
</div>

### Card

An elevated surface for cards, dialogs, popovers, and panels that sit above the background.

<div class="swatch-row">
  {{ swatch(d.card, "Card", bordered=true) }}
  {{ swatch(d.cardForeground, "Card Foreground") }}
</div>

### Accent

The primary action color for buttons, links, and interactive highlights. Accent Foreground is the text color on accent-colored surfaces.

<div class="swatch-row">
  {{ swatch(d.accent, "Accent") }}
  {{ swatch(d.accentHover, "Accent Hover") }}
  {{ swatch(d.accentForeground, "Accent Foreground", bordered=true) }}
</div>

### Destructive

For destructive actions and error states — delete buttons, form validation errors, error toasts, and danger alerts.

<div class="swatch-row">
  {{ swatch(d.destructive, "Destructive") }}
  {{ swatch(d.destructiveHover, "Destructive Hover") }}
  {{ swatch(d.destructiveForeground, "Destructive Foreground", bordered=true) }}
</div>

### Success

For confirmations and positive states — saved indicators, valid form fields, success toasts, and completion badges.

<div class="swatch-row">
  {{ swatch(d.success, "Success") }}
  {{ swatch(d.successForeground, "Success Foreground", bordered=true) }}
</div>

### Warning

For caution states — warnings, deprecation notices, and attention-needed indicators that aren't errors.

<div class="swatch-row">
  {{ swatch(d.warning, "Warning") }}
  {{ swatch(d.warningForeground, "Warning Foreground", bordered=true) }}
</div>

### Borders & Focus

Structural and interactive borders. Ring is the focus indicator for keyboard navigation. Input is the default border for form fields. Border is for layout dividers and container edges.

<div class="swatch-row">
  {{ swatch(d.ring, "Ring") }}
  {{ swatch(d.input, "Input") }}
  {{ swatch(d.border, "Border", bordered=true) }}
</div>

### Syntax

Colors for code highlighting — keywords, strings, types, and other language constructs.

<div class="swatch-row">
  {{ swatch(sd.keyword, "Keyword") }}
  {{ swatch(sd.function, "Function") }}
  {{ swatch(sd.string, "String") }}
  {{ swatch(sd.number, "Number") }}
  {{ swatch(sd.type, "Type") }}
  {{ swatch(sd.comment, "Comment") }}
  {{ swatch(sd.tag, "Tag") }}
  {{ swatch(sd.regex, "Regex") }}
</div>

## Light Theme

### Base

<div class="swatch-row">
  {{ swatch(l.background, "Background", bordered=true) }}
  {{ swatch(l.foreground, "Foreground") }}
  {{ swatch(l.foregroundSecondary, "Foreground Secondary") }}
</div>

### Muted

<div class="swatch-row">
  {{ swatch(l.muted, "Muted", bordered=true) }}
  {{ swatch(l.mutedForeground, "Muted Foreground") }}
</div>

### Card

<div class="swatch-row">
  {{ swatch(l.card, "Card", bordered=true) }}
  {{ swatch(l.cardForeground, "Card Foreground") }}
</div>

### Accent

<div class="swatch-row">
  {{ swatch(l.accent, "Accent") }}
  {{ swatch(l.accentHover, "Accent Hover") }}
  {{ swatch(l.accentForeground, "Accent Foreground", bordered=true) }}
</div>

### Destructive

<div class="swatch-row">
  {{ swatch(l.destructive, "Destructive") }}
  {{ swatch(l.destructiveHover, "Destructive Hover") }}
  {{ swatch(l.destructiveForeground, "Destructive Foreground", bordered=true) }}
</div>

### Success

<div class="swatch-row">
  {{ swatch(l.success, "Success") }}
  {{ swatch(l.successForeground, "Success Foreground", bordered=true) }}
</div>

### Warning

<div class="swatch-row">
  {{ swatch(l.warning, "Warning") }}
  {{ swatch(l.warningForeground, "Warning Foreground", bordered=true) }}
</div>

### Borders & Focus

<div class="swatch-row">
  {{ swatch(l.ring, "Ring") }}
  {{ swatch(l.input, "Input") }}
  {{ swatch(l.border, "Border", bordered=true) }}
</div>

### Syntax

<div class="swatch-row">
  {{ swatch(sl.keyword, "Keyword") }}
  {{ swatch(sl.function, "Function") }}
  {{ swatch(sl.string, "String") }}
  {{ swatch(sl.number, "Number") }}
  {{ swatch(sl.type, "Type") }}
  {{ swatch(sl.comment, "Comment") }}
  {{ swatch(sl.tag, "Tag") }}
  {{ swatch(sl.regex, "Regex") }}
</div>

## Accessibility

All foreground/background pairings meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text). Many primary pairings exceed AAA (7:1).

### Dark Theme

#### On surfaces

Contrast ratios for text and UI elements on the three surface tokens.

| Token | Background | Card | Muted | Level |
|-------|------------|------|-------|-------|
| Foreground | 13.5 | 11.9 | 14.3 | AAA |
| Foreground Secondary | 9.5 | 8.4 | 10.1 | AAA |
| Muted Foreground | 6.2 | 5.4 | 6.5 | AA |
| Accent | 7.0 | 6.1 | 7.4 | AA-AAA |
| Accent Hover | 8.7 | 7.6 | 9.2 | AAA |
| Destructive | 5.9 | 5.2 | 6.3 | AA |
| Destructive Hover | 6.9 | 6.1 | 7.3 | AA |
| Success | 7.6 | 6.6 | 8.0 | AA-AAA |
| Warning | 7.6 | 6.7 | 8.1 | AA-AAA |
| Ring | 8.5 | 7.5 | 9.0 | AAA |
| Input | 3.5 | 3.1 | 3.7 | AA (non-text) |

#### Paired foregrounds

Contrast ratios for foreground tokens measured against their own surface.

| Token | Surface | Contrast | Level |
|-------|---------|----------|-------|
| Card Foreground | Card | 11.9 | AAA |
| Accent Foreground | Accent | 7.0 | AAA |
| Destructive Foreground | Destructive | 5.9 | AA |
| Success Foreground | Success | 7.6 | AAA |
| Warning Foreground | Warning | 7.6 | AAA |

#### Syntax on surfaces

Contrast ratios for syntax highlighting tokens on the three surface tokens.

| Token | Background | Card | Muted | Level |
|-------|------------|------|-------|-------|
| Keyword | 7.0 | 6.1 | 7.4 | AA-AAA |
| Function | 8.7 | 7.6 | 9.2 | AAA |
| String | 7.6 | 6.7 | 8.1 | AA-AAA |
| Number | 7.1 | 6.3 | 7.5 | AAA |
| Type | 7.8 | 6.9 | 8.3 | AAA |
| Comment | 6.2 | 5.4 | 6.5 | AA |
| Tag | 5.9 | 5.2 | 6.3 | AA |
| Regex | 6.5 | 5.7 | 6.9 | AA |

### Light Theme

#### On surfaces

| Token | Background | Card | Muted | Level |
|-------|------------|------|-------|-------|
| Foreground | 12.6 | 13.8 | 11.5 | AAA |
| Foreground Secondary | 6.4 | 7.0 | 5.8 | AA-AAA |
| Muted Foreground | 5.0 | 5.5 | 4.6 | AA |
| Accent | 5.1 | 5.5 | 4.6 | AA |
| Accent Hover | 6.3 | 6.9 | 5.7 | AA |
| Destructive | 5.0 | 5.4 | 4.5 | AA |
| Destructive Hover | 5.9 | 6.4 | 5.3 | AA |
| Success | 5.1 | 5.5 | 4.6 | AA |
| Warning | 5.1 | 5.6 | 4.6 | AA |
| Ring | 6.4 | 7.0 | 5.8 | AA-AAA |
| Input | 3.4 | 3.7 | 3.1 | AA (non-text) |

#### Paired foregrounds

| Token | Surface | Contrast | Level |
|-------|---------|----------|-------|
| Card Foreground | Card | 13.8 | AAA |
| Accent Foreground | Accent | 5.1 | AA |
| Destructive Foreground | Destructive | 5.0 | AA |
| Success Foreground | Success | 5.1 | AA |
| Warning Foreground | Warning | 5.1 | AA |

#### Syntax on surfaces

| Token | Background | Card | Muted | Level |
|-------|------------|------|-------|-------|
| Keyword | 5.1 | 5.5 | 4.6 | AA |
| Function | 6.3 | 6.9 | 5.7 | AA |
| String | 5.1 | 5.6 | 4.6 | AA |
| Number | 5.4 | 5.9 | 4.9 | AA |
| Type | 5.0 | 5.4 | 4.5 | AA |
| Comment | 5.0 | 5.5 | 4.6 | AA |
| Tag | 5.0 | 5.4 | 4.5 | AA |
| Regex | 5.1 | 5.6 | 4.7 | AA |

## Examples

Here's how the theme looks applied to common UI elements. <a href="javascript:void(0)" onclick="document.getElementById('theme-toggle').click()">Toggle light/dark mode</a> to see both variants.

### Buttons

<div class="btn-row">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-outline">Outline</button>
  <button class="btn btn-danger">Destructive</button>
</div>

### Form Fields

<div class="form-row">
  <div class="form-field">
    <label>Name</label>
    <input type="text" placeholder="Enter your name">
  </div>
  <div class="form-field">
    <label>Email</label>
    <input type="email" placeholder="you@example.com">
  </div>
  <div class="form-field">
    <label>Message</label>
    <textarea rows="3" placeholder="Write something..."></textarea>
  </div>
</div>

### Code Block

```python
def liminal_salt(palette: dict) -> str:
    """Apply the Liminal Salt theme to a surface."""
    bg = palette.get("background", "#1a1c1b")
    fg = palette.get("foreground", "#e8e4dc")
    accent = palette.get("accent", "#8fac98")
    return f"surface({bg}) text({fg}) accent({accent})"
```

### Blockquote

<blockquote>
  The Liminal Salt palette draws from natural, earthy tones — muted sage greens and warm beiges that feel grounded without being heavy.
</blockquote>

### Inline Code & Links

Here's some `inline code` alongside a [link to the repository](https://github.com/irvj/liminal-salt). The theme's `--accent` variable drives both the link color and the code highlight, keeping everything visually cohesive across `light` and `dark` modes.

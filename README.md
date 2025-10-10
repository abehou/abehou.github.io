# Personal Website - Setup Guide

A simple, clean personal website with a minimalist design.

## Quick Start

### 1. Add Your Profile Photo

Place your photo file named **`profile.jpg`** in this directory:

```
personal_web/
├── index.html
├── publications.html
├── experiences.html
├── blog.html
├── style.css
└── profile.jpg  ← Add your photo here
```

**Photo requirements:**
- Square image (recommended: 400×400px or larger)
- Format: JPG or PNG
- Name it `profile.jpg` (or update line 25 in `index.html` if using a different name)

### 2. Update Social Media Links

The footer includes Twitter and GitHub icons. Update these in **all four HTML files**:

**Quick method** - Use find and replace:
- Find: `https://twitter.com/yourusername`
- Replace with: `https://twitter.com/your_actual_username`

- Find: `https://github.com/yourusername`
- Replace with: `https://github.com/your_actual_username`

**Manual method** - In each file (`index.html`, `publications.html`, `experiences.html`, `blog.html`), update the footer section:
```html
<a href="https://twitter.com/your_username" ...>
<a href="https://github.com/your_username" ...>
```

### 3. Customize Your Content

- **index.html** - Your introduction (already has your info!)
- **publications.html** - Add your research papers
- **experiences.html** - Add work experience and education
- **blog.html** - Add blog posts

## Publishing to GitHub Pages

1. **Create a repository** named `yourusername.github.io` on GitHub

2. **Push your code:**
   ```bash
   cd /nlp/u/abehou/personal_web
   git init
   git add .
   git commit -m "Initial commit: Personal website"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch "main", folder "/ (root)"
   - Save

4. **Your site will be live** at `https://yourusername.github.io` in a few minutes!

## Customization

### Profile Photo Styling

Edit `style.css` lines 103-109 to change size:
```css
.profile-photo img {
    width: 180px;        /* Desktop size */
    height: 180px;
    border-radius: 50%;  /* Makes it circular */
    object-fit: cover;
    border: 3px solid #f0f0f0;
}
```

### Colors and Fonts

All styling is in `style.css`. Key variables:
- Main text: `#333`
- Links: `#0066cc`
- Light gray: `#888`
- Borders: `#e0e0e0`

### Adding More Social Links

To add more social icons (LinkedIn, Google Scholar, etc.), copy the existing icon pattern in the footer and find SVG icons from sources like [Simple Icons](https://simpleicons.org/).

## File Structure

```
.
├── index.html          # Home page with intro
├── publications.html   # Publications page
├── experiences.html    # Experience page
├── blog.html          # Blog page
├── style.css          # All styling
└── README.md          # This file
```

## Features

- ✨ Clean, minimalist design
- 📱 Fully responsive (mobile & desktop)
- 🚀 No dependencies - pure HTML/CSS
- 🎨 Easy to customize
- ⚡ Fast loading

## Preview Locally

Simply open `index.html` in your web browser to preview the site!

## Tips

- Keep the design focused on content
- Update regularly with new work
- Test on mobile devices
- Consider adding Google Analytics for visitor tracking
- Use optimized images for faster loading

---

© 2025 - Feel free to use this template!


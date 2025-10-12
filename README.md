# Terminal-Style Personal Website

A unique personal website (developed by Abe Hou: abehou.com) with a terminal emulator interface and vim-style file viewer.

Please give credit if you plan to use my template!

## Features

- **Terminal Interface**: Navigate your website using familiar terminal commands
- **Vim-Style Viewer**: View files in a vim-inspired reader with keyboard shortcuts
- **Directory Structure**: Organized content in directories (main, publications, experiences, blog)
- **Command History**: Use arrow keys to navigate through command history
- **Tab Completion**: Press Tab to autocomplete commands and filenames

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List files and directories | `ls`, `ls publications` |
| `cd <dir>` | Change directory | `cd publications` |
| `view <file>` | Open file in vim viewer | `view main`, `view paper1.txt` |
| `cat <file>` | Alias for view | `cat main` |
| `pwd` | Print working directory | `pwd` |
| `clear` | Clear terminal screen | `clear` |
| `help` | Show help message | `help` |
| `whoami` | Display current user | `whoami` |
| `date` | Show current date/time | `date` |

## Navigation Examples

```bash
# List all available files
ls

# View the main page
view main

# Navigate to publications directory
cd publications

# Browse publications interactively
view publications

# Browse experiences interactively
view experiences

# Browse blog posts interactively
view blog

# Go back to home directory
cd ~
```

## Interactive Browsing

When you run `view publications`, `view experiences`, or `view blog`, you enter an **interactive browsing mode**:

1. **Navigate**: Use ↑/↓ arrow keys or `j`/`k` to move between items
2. **Select**: Press `Enter` to view the selected item in detail
3. **Go Back**: Press `b` to return to the list from an item
4. **Quit**: Press `q` to exit and return to terminal

This makes it easy to browse through your publications without typing long paper names!

## Vim Viewer Shortcuts

When viewing a file, use these keyboard shortcuts:

| Key | Action |
|-----|--------|
| `q` or `Esc` | Quit viewer and return to terminal |
| `b` | Go back to list (if viewing from interactive mode) |
| `j` or `↓` | Scroll down (or navigate to next item in list) |
| `k` or `↑` | Scroll up (or navigate to previous item in list) |
| `Enter` | Select item (in interactive list mode) |
| `d` | Scroll down half page |
| `u` | Scroll up half page |
| `g` | Go to top (or first item in list) |
| `G` | Go to bottom (or last item in list) |

## File Structure

```
~/personal_web/
├── main              # About me
├── publications/     # Research publications
│   ├── paper1.txt
│   └── paper2.txt
├── experiences/      # Work and education
│   ├── position1.txt
│   ├── position2.txt
│   ├── education1.txt
│   └── education2.txt
└── blog/            # Blog posts
    ├── post1.txt
    ├── post2.txt
    └── post3.txt
```

## Customization

### Adding New Publications

Edit `terminal.js` and add entries to the `content.publications.files` object:

```javascript
'paper3.txt': {
    title: 'Your Paper Title',
    authors: '<strong>Your Name</strong>, Co-authors',
    venue: 'Conference/Journal Name, Year',
    links: '[Paper] URL | [Code] URL',
    abstract: 'Paper abstract...'
}
```

### Adding New Experiences

Edit `terminal.js` and add entries to the `content.experiences.files` object:

```javascript
'position3.txt': {
    title: 'New Position',
    organization: 'Company Name',
    duration: 'Start - End',
    description: 'Description of role...'
}
```

### Styling

- Modify `terminal.css` to change colors, fonts, and layout
- Terminal uses monospace fonts for authentic terminal feel
- Vim viewer uses a dark theme by default

## Running Locally

1. Open `index.html` in a web browser
2. Or use a local server:
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

## Browser Compatibility

- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design included
- Best experience on desktop with physical keyboard

## Tips

- Use Tab for command/filename autocompletion
- Use ↑/↓ arrow keys to navigate command history
- Terminal input stays focused - just start typing
- Press `q` to quickly exit the vim viewer

## Backup Files

Original HTML files are backed up as:
- `publications.html.bak`
- `experiences.html.bak`
- `blog.html.bak`

You can restore these if needed.


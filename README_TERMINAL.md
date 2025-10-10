# Terminal-Style Personal Website

A unique personal website with a terminal emulator interface and vim-style file viewer.

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

# List files in publications
ls

# View a specific publication
view paper1.txt

# View all publications summary
view publications

# Go back to home directory
cd ~

# View experiences without changing directory
view experiences
```

## Vim Viewer Shortcuts

When viewing a file, use these keyboard shortcuts:

| Key | Action |
|-----|--------|
| `q` or `Esc` | Quit viewer and return to terminal |
| `j` or `↓` | Scroll down |
| `k` or `↑` | Scroll up |
| `d` | Scroll down half page |
| `u` | Scroll up half page |
| `g` | Go to top |
| `G` | Go to bottom |

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


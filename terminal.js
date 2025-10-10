// Terminal Emulator for Personal Website
// Author: Abe Hou

// Content Data Structure
const content = {
    main: {
        type: 'file',
        content: `
╔═══════════════════════════════════════════════════════════════╗
║                          ABE HOU                              ║
╚═══════════════════════════════════════════════════════════════╝

Hi! I am Abe Hou.

I am a first-year PhD student in Computer Science at Stanford 
University, working with Diyi Yang.
https://cs.stanford.edu/~diyiy/index.html

I am interested in human-AI collaboration, social simulation, 
and legal AI.

I graduated from Johns Hopkins University with a B.S. in Computer 
Science and Mathematics. I am extremely grateful to have worked 
with Ben Van Durme, Daniel Khashabi, and Tianxing He.
───────────────────────────────────────────────────────────────
CONTACT & SOCIAL
───────────────────────────────────────────────────────────────
Twitter: https://twitter.com/abe_hou
GitHub: https://github.com/abehou
Email: abehou@stanford.edu
───────────────────────────────────────────────────────────────
`
    },
    publications: {
        type: 'directory',
        description: 'My research publications',
        files: {
            'paper1.txt': {
                title: 'Paper Title Goes Here',
                authors: '<strong>Abe Hou</strong>, Co-author 1, Co-author 2',
                venue: 'Conference/Journal Name, Year',
                links: '[Paper] # | [Code] # | [Project Page] #',
                abstract: 'This is where the abstract or detailed description of the paper would go. It provides an overview of the research problem, methodology, key findings, and contributions of the work.'
            },
            'paper2.txt': {
                title: 'Another Paper Title',
                authors: 'Co-author 1, <strong>Abe Hou</strong>, Co-author 2',
                venue: 'Conference/Journal Name, Year',
                links: '[Paper] # | [Code] #',
                abstract: 'Another research paper abstract goes here. This section would describe the second paper\'s contributions, methodology, and results in detail.'
            }
        },
        summary: `
╔═══════════════════════════════════════════════════════════════╗
║                        PUBLICATIONS                           ║
╚═══════════════════════════════════════════════════════════════╝

Available papers:
  • paper1.txt - Paper Title Goes Here
  • paper2.txt - Another Paper Title

Use 'view <filename>' to read a paper in detail.
For example: view paper1.txt
`
    },
    experiences: {
        type: 'directory',
        description: 'My professional and academic experiences',
        files: {
            'position1.txt': {
                title: 'Position Title',
                organization: 'Organization/Company Name',
                duration: 'Start Date - End Date',
                description: 'Brief description of your role and responsibilities. What did you work on? What technologies did you use? This is where you\'d elaborate on your key achievements and projects.'
            },
            'position2.txt': {
                title: 'Previous Position',
                organization: 'Organization/Company Name',
                duration: 'Start Date - End Date',
                description: 'Brief description of your role and responsibilities for this position.'
            },
            'education1.txt': {
                title: 'PhD in Computer Science',
                organization: 'Stanford University',
                duration: '2024 - Present',
                description: 'Working with Diyi Yang on human-AI collaboration, social simulation, and legal AI. Conducting research on natural language processing and machine learning applications.'
            },
            'education2.txt': {
                title: 'B.S. Computer Science and Mathematics',
                organization: 'Johns Hopkins University',
                duration: '2020 - 2024',
                description: 'Worked with Ben Van Durme, Daniel Khashabi, and Tianxing He on NLP research. Relevant coursework included Machine Learning, Natural Language Processing, Advanced Algorithms, and Mathematical Statistics.'
            }
        },
        summary: `
╔═══════════════════════════════════════════════════════════════╗
║                         EXPERIENCES                           ║
╚═══════════════════════════════════════════════════════════════╝

WORK EXPERIENCE:
  • position1.txt - Position Title
  • position2.txt - Previous Position

EDUCATION:
  • education1.txt - PhD in Computer Science (Stanford)
  • education2.txt - B.S. Computer Science and Mathematics (JHU)

Use 'view <filename>' to read more details.
For example: view education1.txt
`
    },
    blog: {
        type: 'directory',
        description: 'My blog posts and writings',
        files: {
            'post1.txt': {
                title: 'Blog Post Title',
                date: 'October 10, 2025',
                content: 'A brief excerpt or summary of your blog post goes here. This gives readers a preview of what the post is about. You can expand this with the full blog post content, discussing research insights, technical tutorials, or personal thoughts about your field.'
            },
            'post2.txt': {
                title: 'Another Blog Post',
                date: 'September 15, 2025',
                content: 'Another excerpt describing what this blog post covers. You can write about research, tutorials, thoughts, or anything you\'d like to share. This is your space to explore ideas and share knowledge with the community.'
            },
            'post3.txt': {
                title: 'Getting Started with My Research',
                date: 'August 1, 2025',
                content: 'A post about how you got started in your field, lessons learned, or advice for others. Share your journey, the challenges you faced, and what you learned along the way. This kind of content can be invaluable for students and researchers just starting out.'
            }
        },
        summary: `
╔═══════════════════════════════════════════════════════════════╗
║                            BLOG                               ║
╚═══════════════════════════════════════════════════════════════╝

Recent posts:
  • post1.txt - Blog Post Title (Oct 10, 2025)
  • post2.txt - Another Blog Post (Sep 15, 2025)
  • post3.txt - Getting Started with My Research (Aug 1, 2025)

Use 'view <filename>' to read a post.
For example: view post1.txt
`
    }
};

// Terminal State
let currentDirectory = '~';
let commandHistory = [];
let historyIndex = -1;

// DOM Elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const vimViewer = document.getElementById('vim-viewer');
const vimContent = document.getElementById('vim-content');

// Initialize Terminal
function init() {
    displayWelcomeMessage();
    terminalInput.focus();
    
    // Event listeners
    terminalInput.addEventListener('keydown', handleInput);
    document.addEventListener('keydown', handleVimKeypress);
    
    // Keep terminal input focused
    document.addEventListener('click', () => {
        if (!vimViewer.classList.contains('hidden')) return;
        terminalInput.focus();
    });
}

function displayWelcomeMessage() {
    const welcome = `
╔═══════════════════════════════════════════════════════════════╗
║            Welcome to Abe Hou's Personal Website              ║
║                      Terminal Interface                       ║
╚═══════════════════════════════════════════════════════════════╝

Type 'help' for available commands, or 'ls' to list files.

`;
    addOutput(welcome, 'info');
    executeCommand('ls');
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (command) {
            addOutput(`abehou@stanford:${currentDirectory}$ ${command}`, 'command');
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            executeCommand(command);
        } else {
            addOutput(`abehou@stanford:${currentDirectory}$ `, 'command');
        }
        terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        autocomplete();
    }
}

function executeCommand(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
        case 'help':
            showHelp();
            break;
        case 'ls':
            listFiles(args[0]);
            break;
        case 'cd':
            changeDirectory(args[0]);
            break;
        case 'view':
            viewFile(args.join(' '));
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'pwd':
            addOutput(currentDirectory, 'info');
            break;
        case 'cat':
            viewFile(args.join(' '));
            break;
        case 'whoami':
            addOutput('abehou', 'info');
            break;
        case 'date':
            addOutput(new Date().toString(), 'info');
            break;
        default:
            addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
    }
    
    scrollToBottom();
}

function showHelp() {
    const help = `
Available commands:
───────────────────────────────────────────────────────────────
  ls [directory]       List files and directories
  cd <directory>       Change directory (main, publications, experiences, blog)
  view <file>          Open file in vim-style viewer
  cat <file>           Alias for 'view'
  pwd                  Print current directory
  clear                Clear terminal screen
  whoami               Display current user
  date                 Show current date and time
  help                 Show this help message
───────────────────────────────────────────────────────────────

Examples:
  ls                   # List all available files
  cd publications      # Navigate to publications directory
  view main            # View main page
  view paper1.txt      # View specific publication
  view publications    # View all publications
───────────────────────────────────────────────────────────────
`;
    addOutput(help, 'info');
}

function listFiles(dir) {
    if (!dir) {
        // List root directory
        const output = `
Available files and directories:
  <span class="file">main</span>              About me and introduction
  <span class="directory">publications/</span>    My research publications
  <span class="directory">experiences/</span>     Professional and academic experience
  <span class="directory">blog/</span>            Blog posts and writings

Type 'view <filename>' to open a file, or 'cd <directory>' to navigate.
`;
        addOutput(output, 'info');
    } else {
        const dirName = dir.replace('/', '');
        if (content[dirName] && content[dirName].type === 'directory') {
            const files = Object.keys(content[dirName].files);
            let output = `\nContents of ${dirName}/:\n`;
            files.forEach(file => {
                output += `  <span class="file">${file}</span>\n`;
            });
            output += `\nType 'view ${dirName}' to see summary, or 'view <filename>' for details.\n`;
            addOutput(output, 'info');
        } else {
            addOutput(`Directory not found: ${dir}`, 'error');
        }
    }
}

function changeDirectory(dir) {
    if (!dir || dir === '~' || dir === '/') {
        currentDirectory = '~';
        updatePrompt();
        addOutput('Changed to home directory', 'success');
    } else if (dir === '..') {
        if (currentDirectory !== '~') {
            currentDirectory = '~';
            updatePrompt();
            addOutput('Changed to home directory', 'success');
        }
    } else {
        const dirName = dir.replace('/', '');
        if (content[dirName]) {
            if (content[dirName].type === 'directory') {
                currentDirectory = `~/${dirName}`;
                updatePrompt();
                addOutput(`Changed directory to ${dirName}`, 'success');
                listFiles(dirName);
            } else {
                addOutput(`${dirName} is not a directory. Use 'view ${dirName}' to open it.`, 'error');
            }
        } else {
            addOutput(`Directory not found: ${dir}`, 'error');
        }
    }
}

function viewFile(filename) {
    if (!filename) {
        addOutput('Usage: view <filename>', 'error');
        return;
    }

    // Remove any trailing slashes
    filename = filename.replace(/\/$/, '');

    // Check if it's a main file
    if (filename === 'main' || filename === 'main.txt') {
        openVimViewer('main', content.main.content);
        return;
    }

    // Check if it's a directory summary
    if (content[filename] && content[filename].type === 'directory') {
        openVimViewer(filename, content[filename].summary);
        return;
    }

    // Check in current directory if we're in one
    if (currentDirectory !== '~') {
        const dirName = currentDirectory.split('/')[1];
        const dir = content[dirName];
        if (dir && dir.files && dir.files[filename]) {
            const file = dir.files[filename];
            const formattedContent = formatFileContent(filename, file);
            openVimViewer(filename, formattedContent);
            return;
        }
    }

    // Search in all directories
    for (const [dirName, dirData] of Object.entries(content)) {
        if (dirData.type === 'directory' && dirData.files && dirData.files[filename]) {
            const file = dirData.files[filename];
            const formattedContent = formatFileContent(filename, file);
            openVimViewer(filename, formattedContent);
            return;
        }
    }

    addOutput(`File not found: ${filename}`, 'error');
}

function formatFileContent(filename, file) {
    if (file.title) {
        // Publication or Experience format
        let content = `╔═══════════════════════════════════════════════════════════════╗\n`;
        content += `║ ${file.title.padEnd(61)} ║\n`;
        content += `╚═══════════════════════════════════════════════════════════════╝\n\n`;
        
        if (file.authors) {
            content += `Authors: ${file.authors.replace(/<strong>/g, '').replace(/<\/strong>/g, '')}\n`;
        }
        if (file.venue) {
            content += `Venue: ${file.venue}\n`;
        }
        if (file.organization) {
            content += `Organization: ${file.organization}\n`;
        }
        if (file.duration) {
            content += `Duration: ${file.duration}\n`;
        }
        if (file.date) {
            content += `Date: ${file.date}\n`;
        }
        
        content += `\n───────────────────────────────────────────────────────────────\n\n`;
        
        if (file.abstract) {
            content += `ABSTRACT\n\n${file.abstract}\n\n`;
        }
        if (file.description) {
            content += `DESCRIPTION\n\n${file.description}\n\n`;
        }
        if (file.content) {
            content += `${file.content}\n\n`;
        }
        if (file.links) {
            content += `───────────────────────────────────────────────────────────────\n`;
            content += `LINKS\n\n${file.links}\n`;
        }
        
        return content;
    }
    
    return JSON.stringify(file, null, 2);
}

function openVimViewer(filename, content) {
    vimViewer.classList.remove('hidden');
    document.querySelector('.vim-filename').textContent = filename;
    vimContent.textContent = content;
    vimContent.scrollTop = 0;
    updateVimStatus();
}

function closeVimViewer() {
    vimViewer.classList.add('hidden');
    terminalInput.focus();
}

function handleVimKeypress(e) {
    if (vimViewer.classList.contains('hidden')) return;

    if (e.key === 'q' || e.key === 'Escape') {
        e.preventDefault();
        closeVimViewer();
    } else if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        vimContent.scrollTop += 40;
        updateVimStatus();
    } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        vimContent.scrollTop -= 40;
        updateVimStatus();
    } else if (e.key === 'g') {
        e.preventDefault();
        vimContent.scrollTop = 0;
        updateVimStatus();
    } else if (e.key === 'G') {
        e.preventDefault();
        vimContent.scrollTop = vimContent.scrollHeight;
        updateVimStatus();
    } else if (e.key === 'd') {
        e.preventDefault();
        vimContent.scrollTop += vimContent.clientHeight / 2;
        updateVimStatus();
    } else if (e.key === 'u') {
        e.preventDefault();
        vimContent.scrollTop -= vimContent.clientHeight / 2;
        updateVimStatus();
    }
}

function updateVimStatus() {
    const scrollPercent = Math.round((vimContent.scrollTop / (vimContent.scrollHeight - vimContent.clientHeight)) * 100) || 0;
    document.getElementById('vim-status').textContent = `${scrollPercent}%`;
}

function addOutput(text, className = '') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
}

function clearTerminal() {
    terminalOutput.innerHTML = '';
}

function scrollToBottom() {
    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
}

function updatePrompt() {
    const prompts = document.querySelectorAll('.prompt');
    prompts.forEach(prompt => {
        prompt.textContent = `abehou@stanford:${currentDirectory}$ `;
    });
}

function autocomplete() {
    const input = terminalInput.value.trim();
    const parts = input.split(/\s+/);
    
    if (parts.length === 1) {
        // Complete command
        const commands = ['help', 'ls', 'cd', 'view', 'clear', 'pwd', 'cat', 'whoami', 'date'];
        const matches = commands.filter(cmd => cmd.startsWith(parts[0]));
        if (matches.length === 1) {
            terminalInput.value = matches[0] + ' ';
        }
    } else if (parts.length === 2 && (parts[0] === 'cd' || parts[0] === 'view' || parts[0] === 'ls')) {
        // Complete filename/directory
        const dirs = ['main', 'publications', 'experiences', 'blog'];
        const matches = dirs.filter(dir => dir.startsWith(parts[1]));
        if (matches.length === 1) {
            terminalInput.value = parts[0] + ' ' + matches[0];
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);


// Terminal Emulator for Personal Website
// Author: Abe Hou

// Content Data Structure (loaded from JSON)
let content = {};
let dataLoaded = false;

// Terminal State
let currentDirectory = '~';
let commandHistory = [];
let historyIndex = -1;

// Interactive list state
let interactiveMode = false;
let interactiveList = [];
let selectedIndex = 0;
let interactiveType = ''; // 'publications', 'experiences', 'blog'

// DOM Elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const vimViewer = document.getElementById('vim-viewer');
const vimContent = document.getElementById('vim-content');

// Load JSON data
async function loadData() {
    try {
        const dataFiles = ['main', 'publications', 'experiences', 'blog'];
        const promises = dataFiles.map(file => 
            fetch(`data/${file}.json`)
                .then(response => response.json())
                .then(data => ({ name: file, data }))
        );
        
        const results = await Promise.all(promises);
        results.forEach(({ name, data }) => {
            content[name] = data;
        });
        
        // Generate dynamic summaries for directories
        generateSummaries();
        
        dataLoaded = true;
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        addOutput('Error loading content data. Please check console.', 'error');
        return false;
    }
}

// Generate dynamic summaries for directory views
function generateSummaries() {
    // Generate publications summary
    if (content.publications && content.publications.files) {
        let summary = `
╔═══════════════════════════════════════════════════════════════╗
║                        PUBLICATIONS                           ║
╚═══════════════════════════════════════════════════════════════╝

Available papers:
`;
        Object.entries(content.publications.files).forEach(([filename, fileData]) => {
            summary += `  • ${filename}\n\n ${fileData.authors}\n`;
        });
        summary += `\nUse 'view <filename>' to read a paper in detail.\nFor example: view ${Object.keys(content.publications.files)[0]}\n`;
        content.publications.summary = summary;
    }

    // Generate experiences summary
    if (content.experiences && content.experiences.files) {
        let summary = `
╔═══════════════════════════════════════════════════════════════╗
║                         EXPERIENCES                           ║
╚═══════════════════════════════════════════════════════════════╝

`;
        const files = Object.entries(content.experiences.files);
        const positions = files.filter(([name]) => name.startsWith('position'));
        const education = files.filter(([name]) => name.startsWith('education'));
        
        if (positions.length > 0) {
            summary += `WORK EXPERIENCE:\n`;
            positions.forEach(([filename, fileData]) => {
                summary += `  • ${filename} - ${fileData.title}\n`;
            });
            summary += '\n';
        }
        
        if (education.length > 0) {
            summary += `EDUCATION:\n`;
            education.forEach(([filename, fileData]) => {
                const shortOrg = fileData.organization.split(' ').slice(0, 2).join(' ');
                summary += `  • ${filename} - ${fileData.title} (${shortOrg})\n`;
            });
        }
        
        summary += `\nUse 'view <filename>' to read more details.\nFor example: view ${Object.keys(content.experiences.files)[0]}\n`;
        content.experiences.summary = summary;
    }

    // Generate blog summary
    if (content.blog && content.blog.files) {
        let summary = `
╔═══════════════════════════════════════════════════════════════╗
║                            BLOG                               ║
╚═══════════════════════════════════════════════════════════════╝

Recent posts:
`;
        Object.entries(content.blog.files).forEach(([filename, fileData]) => {
            summary += `  • ${filename} - ${fileData.title} (${fileData.date})\n`;
        });
        summary += `\nUse 'view <filename>' to read a post.\nFor example: view ${Object.keys(content.blog.files)[0]}\n`;
        content.blog.summary = summary;
    }
}

// Initialize Terminal
async function init() {
    addOutput('Loading content...', 'info');
    const loaded = await loadData();
    
    if (!loaded) {
        addOutput('Failed to load content. Please refresh the page.', 'error');
        return;
    }
    
    clearTerminal();
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
  view publications    # Browse publications interactively
  view experiences     # Browse experiences interactively
  view blog            # Browse blog posts interactively

Interactive Navigation:
  When viewing publications/experiences/blog, use:
    ↑/↓ or j/k         Navigate between items
    Enter              View selected item
    b                  Go back to list (from item view)
    q                  Quit viewer
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

    // Check if it's a directory summary - open interactive list
    if (content[filename] && content[filename].type === 'directory') {
        openInteractiveList(filename);
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

function openInteractiveList(dirName) {
    interactiveMode = true;
    interactiveType = dirName;
    selectedIndex = 0;
    
    // Build list of items
    interactiveList = Object.entries(content[dirName].files);
    
    // Update help text
    document.querySelector('.vim-help').textContent = 'Use ↑↓ or j/k to navigate, Enter to select, q to quit';
    
    // Display the interactive list
    displayInteractiveList();
}

function displayInteractiveList() {
    let displayContent = '';
    
    if (interactiveType === 'publications') {
        displayContent = `╔═══════════════════════════════════════════════════════════════╗\n`;
        displayContent += `║                        PUBLICATIONS                           ║\n`;
        displayContent += `╚═══════════════════════════════════════════════════════════════╝\n\n`;
        displayContent += `Use ↑/↓ or j/k to navigate, Enter to view, q to quit\n\n`;
        displayContent += `───────────────────────────────────────────────────────────────\n\n`;
        
        interactiveList.forEach(([filename, fileData], index) => {
            const pointer = index === selectedIndex ? '→ ' : '  ';
            const highlight = index === selectedIndex ? '█ ' : '  ';
            displayContent += `${pointer}${highlight}${filename}\n\n`;
            displayContent += `   ${fileData.authors}\n\n`;
            displayContent += `───────────────────────────────────────────────────────────────\n\n`;
        });
    } else if (interactiveType === 'experiences') {
        displayContent = `╔═══════════════════════════════════════════════════════════════╗\n`;
        displayContent += `║                         EXPERIENCES                           ║\n`;
        displayContent += `╚═══════════════════════════════════════════════════════════════╝\n\n`;
        displayContent += `Use ↑/↓ or j/k to navigate, Enter to view, q to quit\n\n`;
        displayContent += `───────────────────────────────────────────────────────────────\n\n`;
        
        interactiveList.forEach(([filename, fileData], index) => {
            const pointer = index === selectedIndex ? '→ ' : '  ';
            displayContent += `${pointer}${fileData.title}\n`;
            displayContent += `   ${fileData.organization} | ${fileData.duration}\n\n`;
        });
    } else if (interactiveType === 'blog') {
        displayContent = `╔═══════════════════════════════════════════════════════════════╗\n`;
        displayContent += `║                            BLOG                               ║\n`;
        displayContent += `╚═══════════════════════════════════════════════════════════════╝\n\n`;
        displayContent += `Use ↑/↓ or j/k to navigate, Enter to view, q to quit\n\n`;
        displayContent += `───────────────────────────────────────────────────────────────\n\n`;
        
        interactiveList.forEach(([filename, fileData], index) => {
            const pointer = index === selectedIndex ? '→ ' : '  ';
            displayContent += `${pointer}${fileData.title}\n`;
            displayContent += `   ${fileData.date}\n\n`;
        });
    }
    
    vimViewer.classList.remove('hidden');
    document.querySelector('.vim-filename').textContent = interactiveType;
    vimContent.innerHTML = `<pre>${displayContent}</pre>`;
    
    // Scroll to selected item
    scrollToSelectedItem();
    updateVimStatus();
}

function scrollToSelectedItem() {
    // Rough estimate: each item is about 4-5 lines, adjust as needed
    const itemHeight = interactiveType === 'publications' ? 150 : 80;
    const targetScroll = selectedIndex * itemHeight;
    vimContent.scrollTop = targetScroll;
}

function openVimViewer(filename, content) {
    const wasInteractive = interactiveMode;
    const preservedType = interactiveType;
    const preservedList = [...interactiveList];
    const preservedIndex = selectedIndex;
    
    interactiveMode = false;
    vimViewer.classList.remove('hidden');
    document.querySelector('.vim-filename').textContent = filename;
    vimContent.innerHTML = `<pre>${content}</pre>`;
    vimContent.scrollTop = 0;
    
    // Update help text - add back option if came from list
    if (wasInteractive && preservedList.length > 0) {
        document.querySelector('.vim-help').textContent = 'Press b to go back, q to quit, ↑↓ or j/k to scroll';
        // Store the list info so we can go back
        vimViewer.dataset.fromList = 'true';
        vimViewer.dataset.listType = preservedType;
        vimViewer.dataset.listIndex = preservedIndex;
    } else {
        document.querySelector('.vim-help').textContent = 'Press q to quit, ↑↓ or j/k to scroll';
        vimViewer.dataset.fromList = 'false';
    }
    
    updateVimStatus();
}

function closeVimViewer() {
    vimViewer.classList.add('hidden');
    interactiveMode = false;
    interactiveList = [];
    selectedIndex = 0;
    terminalInput.focus();
}

function handleVimKeypress(e) {
    if (vimViewer.classList.contains('hidden')) return;

    if (e.key === 'q' || e.key === 'Escape') {
        e.preventDefault();
        closeVimViewer();
    } else if (e.key === 'b' && vimViewer.dataset.fromList === 'true') {
        // Go back to the interactive list
        e.preventDefault();
        const listType = vimViewer.dataset.listType;
        const listIndex = parseInt(vimViewer.dataset.listIndex) || 0;
        
        interactiveMode = true;
        interactiveType = listType;
        selectedIndex = listIndex;
        interactiveList = Object.entries(content[listType].files);
        
        document.querySelector('.vim-help').textContent = 'Use ↑↓ or j/k to navigate, Enter to select, q to quit';
        displayInteractiveList();
    } else if (interactiveMode) {
        // Interactive list navigation
        if (e.key === 'j' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < interactiveList.length - 1) {
                selectedIndex++;
                displayInteractiveList();
            }
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                selectedIndex--;
                displayInteractiveList();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            // Open the selected item
            const [filename, fileData] = interactiveList[selectedIndex];
            const formattedContent = formatFileContent(filename, fileData);
            openVimViewer(filename, formattedContent);
        } else if (e.key === 'g') {
            e.preventDefault();
            selectedIndex = 0;
            displayInteractiveList();
        } else if (e.key === 'G') {
            e.preventDefault();
            selectedIndex = interactiveList.length - 1;
            displayInteractiveList();
        }
    } else {
        // Regular vim-style scrolling
        if (e.key === 'j' || e.key === 'ArrowDown') {
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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mini game portal containing multiple HTML5 games built with vanilla JavaScript, HTML, and CSS. The portal serves as a collection hub for browser-based games with a responsive design supporting both desktop and mobile devices.

## Project Structure

```
my_game_portal/
├── index.html           # Main portal homepage
├── style.css            # Portal main styles
├── script.js            # Portal main JavaScript
├── README.md            # Project documentation
└── games/               # Individual game directories
    ├── snake/           # Snake game implementation
    │   ├── index.html
    │   ├── snake_game.css
    │   └── snake_game.js
    ├── memory/          # Memory card game (in development)
    │   ├── index.html   # Currently shows "coming soon" page
    │   ├── style.css
    │   └── script.js
    └── 2048/            # 2048 puzzle game
        ├── index.html
        ├── style.css
        └── script.js
```

## Development Commands

This project uses vanilla HTML/CSS/JavaScript with no build system. Development is done by:

1. **Local Development**: Use any local web server
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server package)
   npx http-server
   ```

2. **Testing**: Open browser to `http://localhost:8000` and test manually

3. **Deployment**: Static files deployed to GitHub Pages

## Game Architecture

Each game follows a consistent structure:
- **index.html**: Game page with canvas/game area and UI elements
- **style.css**: Game-specific styles with responsive design
- **script.js**: Game logic, controls, and state management

Common patterns:
- Games use `localStorage` for high scores and settings
- Responsive design with mobile touch controls
- Back navigation to main portal (`../../`)
- Canvas-based games for pixel-perfect rendering
- CSS Grid/Flexbox for layouts

## Code Conventions

- **Languages**: Korean comments and UI text, English variable/function names
- **File Naming**: lowercase with underscores (snake_case)
- **CSS**: BEM-like methodology, mobile-first responsive design
- **JavaScript**: ES6+ features, no external libraries/frameworks
- **Game State**: Use objects to manage game state, avoid global variables
- **Controls**: Support both keyboard and touch input for mobile compatibility

## Key Features

- Multi-game portal with unified navigation
- Responsive design supporting all device sizes
- Local high score storage using localStorage
- Touch controls for mobile devices
- Progressive difficulty levels where applicable
- Game statistics tracking on main portal

## Adding New Games

1. Create new directory in `games/` folder
2. Follow existing structure (index.html, style.css, script.js)
3. Include back navigation link to `../../`
4. Add game card to main portal `index.html`
5. Implement responsive design and touch controls
6. Use localStorage for persistent data

## Deployment

- Hosted on GitHub Pages
- All assets are static files
- No server-side processing required
- Cross-browser compatibility with modern browsers
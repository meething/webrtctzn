# Copilot Instructions for webRTCTZN

## Project Overview

webRTCTZN is a decentralized peer-to-peer WebRTC application for audio/video chat, whiteboarding, image sharing, and screen sharing. It uses the Trystero library for multi-network peer discovery and provides a minimal, user-friendly interface.

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **WebRTC Library**: [Trystero](https://github.com/dmotz/trystero) via ESM imports
- **Styling**: Custom CSS with Tailwind-like utility classes
- **Icons**: Fork Awesome icon library
- **Alerts**: SweetAlert2
- **Caching**: quick-lru for efficient caching
- **Deployment**: Static site hosted on GitHub Pages

## Architecture

- **Single Page Application**: No build tools or bundlers required
- **Module System**: ES6 modules loaded directly in browser
- **P2P Communication**: Uses Trystero for decentralized peer discovery and WebRTC connections
- **Real-time Features**: Canvas drawing, chat, video/audio streaming, screen sharing

## File Structure

- `index.html` - Main entry point with UI layout
- `script.js` - Core application logic and WebRTC handling (main module)
- `utils.js` - Utility functions for drag-and-drop, navigation, and image handling
- `style.css` - Main stylesheet (Tailwind-like utilities)
- `styler.css` - Additional custom styles
- `rooms.html` - Room selection interface
- `manifest.json` - PWA manifest
- `static/` - Static assets (images, icons)
- `.github/workflows/static.yml` - GitHub Pages deployment workflow

## Code Conventions

### JavaScript

1. **Variable Declarations**: Prefer `const` by default, use `let` when reassignment is needed. The existing code uses `var` in some places, but new code should follow modern JavaScript best practices
2. **Naming**: Use camelCase for variables and functions (e.g., `userName`, `getUserName`, `sendChat`)
3. **ES6 Features**: Use arrow functions, destructuring, and template literals where appropriate
4. **Module Imports**: Use ES6 import syntax from CDNs (e.g., `import { joinRoom } from "https://esm.run/trystero"`)
5. **Comments**: Include comments for complex logic; keep them concise
6. **Event Handlers**: Use `addEventListener` for DOM events
7. **Async/Await**: Use for asynchronous operations like media device access

### HTML

1. **Semantic HTML**: Use appropriate semantic tags
2. **Accessibility**: Include `aria-*` attributes for icons and interactive elements
3. **Classes**: Use utility-first CSS classes similar to Tailwind CSS
4. **IDs**: Use descriptive IDs for elements accessed via JavaScript

### CSS

1. **Utility Classes**: Follow utility-first approach (e.g., `flex`, `bg-blue-500`)
2. **Custom Styles**: Add custom styles in `styler.css` for specific components
3. **Responsive Design**: Use flexible layouts and viewport-relative units

## Key Dependencies

- **Trystero**: WebRTC peer-to-peer library - primary dependency for all networking
- **quick-lru**: LRU cache with a max size parameter
- **SweetAlert2**: Beautiful, responsive alerts
- **Fork Awesome**: Icon library (fork of Font Awesome)
- **Space Mono**: Google Font for typography

## Development Guidelines

### Adding Features

1. **Keep it Simple**: This is a vanilla JS project with no build step
2. **P2P First**: All real-time features should use Trystero's peer-to-peer channels
3. **Minimal Dependencies**: Only add new dependencies if absolutely necessary
4. **CDN Imports**: Use ESM CDN imports (esm.run, cdn.skypack.dev, cdn.jsdelivr.net)

### WebRTC Patterns

1. **Room Management**: Rooms are created using Trystero's `joinRoom()` with unique namespace
2. **Peer Communication**: Use Trystero's `makeAction()` to create sender/receiver pairs
3. **Stream Handling**: Add/remove streams using `room.addStream()` and `room.removeStream()`
4. **Peer Tracking**: Maintain peer state using JavaScript objects and maps

### Canvas and Drawing

1. **Whiteboard**: Uses HTML5 canvas with 2D context
2. **Coordinate System**: Use relative positioning (0-1) for cross-device compatibility
3. **Drawing Events**: Track mouse events for real-time collaborative drawing
4. **Image Sharing**: Convert images to blobs before sending over P2P connection

### State Management

1. **Local Storage**: Store user preferences like username
2. **URL Parameters**: Use query parameters for room, username, and video settings
3. **Global Variables**: Module-level variables for room state and peer connections
4. **LRU Cache**: Use for efficient caching of frequently accessed data

## Testing and Deployment

- **No Test Suite**: This project does not have automated tests
- **Manual Testing**: Test in browser with multiple tabs/devices
- **Deployment**: Automated via GitHub Actions to GitHub Pages on push to `master` branch
- **No Build Step**: Direct deployment of source files

## Security Considerations

1. **P2P Only**: No server-side code or APIs
2. **Media Permissions**: Request camera/microphone access only when needed
3. **XSS Prevention**: Be careful with user-generated content in chat and drawing features
4. **HTTPS Required**: WebRTC requires secure context for media access

## Browser Compatibility

- **Modern Browsers**: Requires ES6 module support and WebRTC APIs
- **Target**: Chrome, Firefox, Safari, Edge (recent versions)
- **PWA Support**: Configured as installable Progressive Web App

## Common Tasks

### Adding a New P2P Action

```javascript
const [sendAction, getAction] = room.makeAction('action-name');
getAction((data, peerId) => {
  // Handle received data
});
// Send data
sendAction(payload);
```

### Adding a New UI Button

```html
<button id="my-button" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full">
  <i class="fa fa-icon-name fa-2x" aria-hidden="true"></i>
</button>
```

### Handling Media Streams

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
room.addStream(stream);
```

## License

MIT License - See LICENSE file for details.

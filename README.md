
# Aura Habit Tracker (iOS 26 Liquid Glass)

A premium, production-ready habit tracker PWA with frosted glass aesthetics and fluid animations.

## Architecture Overview
- **Storage**: Local-only persistence using IndexedDB (via `idb` library). All your data stays on your device.
- **Visuals**: Tailwind CSS for "Liquid Glass" effects (`backdrop-filter`, saturations, layered shadows).
- **PWA**: Configured for standalone mode with safe-area inset awareness for Dynamic Island and home indicators.
- **Logic**: Built with React 18 and TypeScript for type-safe habit scheduling and check-in tracking.

## Installation Instructions

### iOS (iPhone/iPad)
1. Open the app URL in **Safari**.
2. Tap the **Share** button (box with arrow) at the bottom.
3. Scroll down and tap **Add to Home Screen**.
4. Open the "Aura" icon from your home screen.

### Android
1. Open the app URL in **Chrome**.
2. Tap the **Three Dots** (⋮) menu in the top-right.
3. Tap **Install App** or **Add to Home Screen**.
4. Launch from your app drawer.

### Desktop (Chrome/Edge)
1. Click the **Install Icon** in the URL bar.
2. Launch as a standalone window.

## iOS PWA Limitations
- **Notifications**: Requires "Add to Home Screen" to function.
- **Haptics**: Supported via Vibration API in modern iOS versions.
- **Safe Area**: Uses `viewport-fit=cover` to ensure the background flows under the notch/dynamic island while keeping content safe.

## Local Development
1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `localhost:5173`.

# Movie App - React Native with Expo

This is a React Native movie application built with [Expo](https://expo.dev), created using [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). The app allows users to browse movies, search for specific titles, and save favorites to a watchlist.

## Features

- Browse popular and recent movies
- Search for movies by title
- View detailed movie information
- Save movies to a watchlist using BookmarkContext
- Dark and light mode support with custom theming

## Project Structure

- `components/` - Reusable UI components including themed components
- `constants/` - App constants including color schemes
- `context/` - React contexts including BookmarkContext for watchlist functionality
- `hooks/` - Custom hooks including theme and color scheme hooks

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd movie-app
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

### Running the App

#### Development Mode

Start the development server:
```bash
npx expo start
```

This will open the Expo Developer Tools in your browser. From there, you can:
- Run on an iOS simulator (requires macOS and Xcode)
- Run on an Android emulator (requires Android Studio)
- Run on a physical device by scanning the QR code with the Expo Go app

#### Running on Physical Devices

1. Install the Expo Go app on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code from the Expo Developer Tools with your device's camera (iOS) or the Expo Go app (Android)

### Building for Production

To create a production build:
```
expo build:android # For Android
expo build:ios # For iOS
```
## Customization

### Theming

The app supports both light and dark themes. Theme settings are managed through the `useThemeColor` hook and the color constants in `constants/Colors.ts`.

### Watchlist

The watchlist functionality is implemented using React Context (`BookmarkContext.tsx`). This allows users to save their favorite movies across the app.

# Vision Assist

Vision Assist is an Expo and React Native prototype for an accessible banknote-checking experience. It provides a camera preview, spoken feedback, haptic feedback, and a small set of guided screens.

> **Current status:** Currency recognition and saved scan history are not implemented. The camera screen is a live preview only; it does not identify a banknote or save an image. Do not use this prototype to make financial decisions.

## What works today

- Home, camera, history, and preferences screens with a warm ivory, navy, and brass theme.
- Camera permission is requested only after the user chooses to allow it.
- Live camera preview when permission is granted.
- Voice and touch feedback controls. Their values apply across the app while it is open and reset to on after restarting.
- Camera-ready pulse, home-card depth response, and feature-card entrance motion.
- Clear empty states for recognition and history features that are not available yet.

## Run the app

### Requirements

- Node.js 22 or newer.
- npm.
- Expo Go on an Android or iOS device, or a configured native development environment.

### Install and start

```sh
npm install
npm start
```

Scan the Expo QR code with Expo Go. For a physical phone, keep the phone and development computer on the same network. If Expo Go appears to show an older bundle, stop the server and restart with a clean Metro cache:

```sh
npx expo start --clear
```

Platform shortcuts are available as `npm run android`, `npm run ios`, and `npm run web`. The app configuration currently lists Android and iOS as supported Expo platforms; web is a convenience script and is not part of the verified release targets.

## Project layout

```text
App.tsx                  Navigation, app-wide feedback settings, navigation theme
src/theme.ts             Shared colors and feedback context
src/screens/HomeScreen.tsx
src/screens/CameraScreen.tsx
src/screens/HistoryScreen.tsx
src/screens/SettingsScreen.tsx
assets/                  Expo app, splash, and adaptive icons
app.json                 Expo identity, platforms, and native permission config
package.json             Scripts and direct dependencies
package-lock.json        Reproducible npm dependency tree
SECURITY.md              Vulnerability reporting and security notes
docs/architecture.md     Screen behavior, data flow, and known limitations
```

## Architecture and data

The app is a single React Native entry point registered by `index.ts`. `App.tsx` owns the bottom-tab navigator and the in-memory voice and haptic preferences. Screens use `src/theme.ts` for the shared palette and feedback context. More detail is in [docs/architecture.md](docs/architecture.md).

There is no server, account system, analytics, or network API in the current implementation. The history screen is informational only. `expo-sqlite` was removed because the app does not currently persist scan history or settings.

## Permissions and privacy

- Camera access is requested when the user taps the camera permission action.
- Android audio recording is explicitly disabled in the Expo Camera plugin configuration.
- The current code renders a camera preview but does not capture, upload, or store an image.
- Voice and haptic preferences are held in memory and are not persisted.
- No credentials or API keys are required. Local `.env` files are ignored by Git.
- Dependabot is configured to check npm dependencies weekly and open update pull requests.

If recognition or history is added later, document where image processing runs, whether images leave the device, what is stored, retention periods, and how users can delete their data before shipping that feature.

## Checks

```sh
npm run typecheck
npm run security:check
npx expo install --check
npx expo export --platform android
```

`npm run security:check` checks the installed dependency tree against npm's current advisory data. `npx expo install --check` verifies Expo SDK package compatibility. Android bundle export verifies Metro can produce the app bundle; it does not replace a device review.

During the 2026-11-04 review, Expo's compatibility check suggested newer patch releases (`expo@58.0.23` and `react-native-safe-area-context@5.11.1`). The registry connection failed while applying those updates, so the committed lockfile remains on Expo `58.0.22` and safe-area context `5.10.1`. The other Expo native modules are aligned to SDK 58. Re-run `npx expo install --fix` and the checks above when npm registry access is available.

## Dependency security note

On 2026-11-02, `npm audit` reported 11 moderate advisories in Expo SDK 58's `glob@13` and `minimatch@10` build-tooling dependency ranges. The project now uses scoped npm overrides to resolve patched `glob@14.0.3` and `minimatch@11.0.4`, without downgrading Expo. The override is intentionally narrow and must be rechecked when upgrading Expo because it crosses the versions Expo currently requests. The successful audit reported zero vulnerabilities; a repeat audit on 2026-11-04 could not reach the npm registry advisory endpoint. The project passed TypeScript, Expo package compatibility, and Android bundle checks after the security changes; see the current patch-version note above.

## Current limitations

- The app does not recognize currencies. The scan action explains that no identification was made.
- The app does not save scan history.
- Feedback settings are not saved after the app closes.
- The camera flow and app have been bundle-checked, but still need hands-on testing on supported phones and with screen readers.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

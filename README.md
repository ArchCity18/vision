# Vision Assist

Vision Assist is an Expo and React Native prototype for an accessible banknote-checking experience. It provides a camera preview, spoken feedback, haptic feedback, and a small set of guided screens.

> **Current status:** Currency recognition and saved scan history are not implemented. The camera screen is a live preview only; it does not identify a banknote or save an image. Do not use this prototype to make financial decisions.

## What works today

- Home, camera, and preferences screens with a warm ivory, navy, and brass theme.
- Camera permission is requested only after the user chooses to allow it.
- Live camera preview when permission is granted.
- Voice and touch feedback controls. Their values apply across the app while it is open and reset to on after restarting.
- Spoken navigation announces each tab and gives short instructions when a screen opens. A repeat button is available on each screen.
- On-demand voice commands for Home, Camera, Settings, Repeat instructions, and Help. Listening starts only after the Voice button is pressed and ends after one command.
- Camera-ready pulse, home-card depth response, and feature-card entrance motion.
- A clear message explains that banknote recognition is not available yet.

## Run the app

### Requirements

- Node.js 22 or newer.
- npm.
- Expo Go for the earlier prototype. This version requires the custom development client because speech recognition adds native code.

### Install and start

```sh
npm install
npm start
```

Build an installable Android development client with `npx eas-cli build --profile development --platform android` (or iOS with `--platform ios`), then install it on the phone and start Metro with `npx expo start --dev-client`. A local build is also available with `npx expo run:android` or `npx expo run:ios` when the native toolchain is installed. Expo Go cannot run this version because it does not contain the speech-recognition native module. For a physical phone, keep the phone and development computer on the same network. If the app appears to show an older bundle, stop the server and restart with a clean Metro cache:

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
src/screens/SettingsScreen.tsx
src/hooks/useSpokenGuidance.ts  Spoken screen announcements and repeat guidance
assets/                  Expo app, splash, and adaptive icons
app.json                 Expo identity, platforms, and native permission config
package.json             Scripts and direct dependencies
package-lock.json        Reproducible npm dependency tree
SECURITY.md              Vulnerability reporting and security notes
docs/architecture.md     Screen behavior, data flow, and known limitations
```

## Architecture and data

The app is a single React Native entry point registered by `index.ts`. `App.tsx` owns the bottom-tab navigator and the in-memory voice and haptic preferences. Screens use `src/theme.ts` for the shared palette and feedback context. More detail is in [docs/architecture.md](docs/architecture.md).

There is no server, account system, analytics, or network API in the current implementation. Scan history and settings are not persisted. `expo-sqlite` was removed because the app does not currently store data.

## Permissions and privacy

- Camera access is requested when the user taps the camera permission action.
- Android audio recording is explicitly disabled in the Expo Camera plugin configuration.
- The current code renders a camera preview but does not capture, upload, or store an image.
- Voice and haptic preferences are held in memory and are not persisted.
- Spoken navigation uses text to speech. Voice commands use system speech recognition only after the user presses the Voice button and grants microphone/speech recognition access. The session ends after one command; the app does not listen in the background or save audio or transcripts. The system recognition service may process audio according to device and OS settings.
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
- The History tab was removed because scans are not saved.
- Voice commands need a development build and have not yet been exercised on a physical Android or iOS device. Expo Go does not include the required native speech-recognition module.
- Feedback settings are not saved after the app closes.
- The camera flow and app have been bundle-checked, but still need hands-on testing on supported phones and with screen readers.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

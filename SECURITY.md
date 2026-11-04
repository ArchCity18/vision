# Security policy

## Reporting a vulnerability

Please report security issues privately through GitHub's **Security** tab using **Report a vulnerability**. Avoid posting exploit details, credentials, or personal data in public issues. This project has no separate security contact or published response-time commitment.

## Current security boundaries

- The mobile app has no backend, user accounts, authentication, analytics, or network API.
- Camera access is user initiated. The current camera screen displays a preview and does not capture, transmit, or store images.
- Audio recording is disabled in the Android Expo Camera plugin configuration.
- Voice and haptic preferences are in-memory only.
- `.env`, `.env.*`, signing keys, and native signing artifacts are excluded by `.gitignore`; do not commit secrets or production signing credentials.
- Dependabot is configured for weekly npm dependency update pull requests. GitHub repository vulnerability alerts and automated security updates are enabled.

These statements describe the current source. Revisit this section if remote inference, telemetry, accounts, persistent history, or image storage is added.

## Dependency checks and overrides

Run these from the repository root:

```sh
npm ci
npm run security:check
npx expo install --check
npm run typecheck
npx expo export --platform android
```

The current lockfile has scoped overrides for `glob@^13.0.0` and `@expo/fingerprint`'s `minimatch` dependency. They resolve to patched `glob@14.0.3` and `minimatch@11.0.4` for two moderate advisories:

- [GHSA-3g3m-2fjr-6pw4: glob abort handling](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)
- [GHSA-g3hv-75wg-m249: minimatch pattern amplification](https://github.com/advisories/GHSA-g3hv-75wg-m249)

The overrides address SDK 58 dependency ranges that still request the vulnerable major versions. They move beyond Expo's requested ranges, so verify the Expo CLI, config loading, fingerprinting, and Metro behavior whenever Expo or these overrides change. Do not remove the overrides until the Expo dependency ranges resolve to patched versions and `npm audit` is clean.

The last successful audit, on 2026-11-02, reported zero vulnerabilities after the overrides. A repeat run on 2026-11-04 could not contact the npm advisory endpoint (`ENOTFOUND registry.npmjs.org`), so the current advisory state could not be refreshed. Advisory data changes over time; rerun the audit before releases.

## Ashra Reader - AI tutor extension

Ashra Reader a awesome text-to-speech browser extension for reader your blog, article and many more...

### ✨ Features

- 🎇 High-Quality Text-to-Speech: Enjoy clear and natural-sounding voices that make listening to text a pleasure.
- 🎇 Easy-to-Use Interface: Simple and intuitive controls ensure a hassle-free user experience.
- 🎇 Supports Multiple Languages: Access text-to-speech functionality in various languages, enhancing your ability to consume content from around the globe.
- 🎇 Customizable Voice Settings: Adjust speech speed, pitch, and volume to suit your personal preferences.
- 🎇 Seamless Integration: Works effortlessly with your favorite web browsers, requiring no additional software or hardware.
- 🎇 Offline Mode: Access text-to-speech capabilities even when you’re not connected to the internet (feature availability may vary based on browser capabilities).

### Implementation

- [x] Create a nodejs server for communicate `openai` [text to speech](https://platform.openai.com/docs/guides/text-to-speech) API.
- [x] Make a cros platfrom extension with **React TypeScript**
- [x] From the extension user can making request to the server with text and get back speech data.
- [x] Play Audio with real-time highlighting (**Important**)

## Setup

1. Clone this repository
2. Enter the project and install all dependences (I'm using `pnpm package manager`)

```console
cd ashra-reader && pnpm install && cd server && pnpm install && cd ..
```

3. Run your `extension` and `server` in your local mechine
   1. For server (**makesure your are in your `server` directory**)
   ```console
   pnpm server:dev
   ```
   2. For extension (**Make sure you are in `root` directory**)
   ```console
   pnpm dev
   ```

###

4. Load extension on Chrome
   1. Open - Chrome Browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpackaed extension
   5. Select - `dist` folder in this project (after dev or build)
5. To build our extension for production, just run `pnpm build`
6. For server `pnpm server:build`

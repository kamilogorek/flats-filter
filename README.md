# Flats Filter

Client-side filter for Morizon, Otodom and OLX.
This extension adds "Hide" button to every listing and persists the filtering across page reloads.
It's using specific sites listing ID for filtering and a bunch of dumb JS code. Don't expect anything fancy.

![screenshot](screenshot.jpg)

## Installation

1. Go to `chrome://extensions`
2. Turn on `Developer mode`
3. `Load unpacked`
4. Drag-n-drop the repo

## Config

1. Open details for `Flats Filter` in `chrome://extensions`
2. Change `Site access` to `On specific sites`
3. Add `https://www.morizon.pl`, `https://www.otodom.pl` and `https://www.olx.pl`

## Restoring data

1. Open DevTools
2. Go to `Application`
3. `Local Storage` in `Storage` section of the sidebar
4. Remove or edit `FLATS_FILTER` key

or

1. Open DevTools
2. `localStorage.removeItem('FLATS_FILTER')`
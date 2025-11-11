# App Icon Creation Guide

Since I cannot create image files directly, here's how to create the app icon:

## Option 1: Use Online Tool (Fastest - 5 minutes)

1. **Go to:** https://www.appicon.co or https://icon.kitchen
2. **Upload:** Your BookMate logo (yellow BM logo on dark background)
3. **Generate:** iOS icons package
4. **Download:** icon.png (1024×1024)
5. **Place:** Save as `assets/icon.png`

## Option 2: Use Figma/Design Tool (10 minutes)

1. Create 1024×1024 canvas
2. Add dark background (#000000 or #121212)
3. Center yellow BookMate logo
4. Export as PNG at 1024×1024
5. Save as `assets/icon.png`

## Option 3: Use LogoBM SVG (Export)

Since you already have LogoBM component:

1. Open `src/components/LogoBM.tsx`
2. The SVG can be exported to PNG using a tool
3. Or use React Native SVG to PNG converter

## Required Specifications

- **Size:** 1024×1024 pixels
- **Format:** PNG (24-bit or 32-bit with alpha)
- **Background:** Dark (#000000) or transparent
- **Logo:** Centered yellow BookMate logo
- **No text:** Just the logo icon
- **No padding:** Logo should fill most of the square

## After Creating Icon

Add to `app.json`:
```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```

Then commit:
```bash
git add assets/icon.png app.json
git commit -m "Add app icon for iOS App Store"
git push origin main
```

## Temporary Workaround

If you need to build NOW without a custom icon:
- EAS will generate a default icon
- You can add custom icon later via App Store Connect
- Not ideal but won't block submission

## Recommended

Create the icon before production build tomorrow (Nov 12) for best results.

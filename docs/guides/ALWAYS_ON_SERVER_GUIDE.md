# Always-On Expo Server Setup Guide

## Goal
Run the Expo development server continuously so you can access your app from anywhere, even away from home WiFi.

---

## Option 1: Prevent Computer Sleep (Recommended for Development)

### On macOS:

#### 1. Use `caffeinate` Command
This keeps your Mac awake while the server runs:

```bash
caffeinate -disu npm start
```

Or with Expo specifically:
```bash
caffeinate -disu npx expo start --tunnel
```

**What the flags mean:**
- `-d` = prevent display sleep
- `-i` = prevent system idle sleep
- `-s` = prevent system sleep
- `-u` = prevent user idle system sleep

#### 2. Create a Convenience Script

Create a new file: `start-server-always-on.sh`

```bash
#!/bin/bash
# Keep Mac awake and run Expo server with tunnel

echo "🚀 Starting BookMate Expo server (always-on mode)..."
echo "📱 Access from anywhere using Expo Go app"
echo "⚠️  Keep this terminal window open"
echo ""

caffeinate -disu npx expo start --tunnel
```

Make it executable:
```bash
chmod +x start-server-always-on.sh
```

Run it:
```bash
./start-server-always-on.sh
```

---

## Option 2: Using Expo Tunnel (Access from Anywhere)

### What is Tunnel Mode?
Expo tunnel creates a publicly accessible URL using ngrok, allowing you to access your app from anywhere with internet.

### Start with Tunnel:

```bash
npx expo start --tunnel
```

**Benefits:**
- ✅ Access from any WiFi network
- ✅ Access from cellular data
- ✅ Share with teammates remotely
- ✅ No local network required

**Note:** First time may ask you to install `@expo/ngrok`

---

## Option 3: macOS System Settings

### Prevent Sleep Automatically:

1. **System Settings** → **Lock Screen**
2. Set "Turn display off on battery when inactive" to **Never**
3. Set "Turn display off on power adapter when inactive" to **Never**

4. **System Settings** → **Battery**
5. Disable "Put hard disks to sleep when possible"
6. Enable "Prevent automatic sleeping on power adapter when the display is off"

---

## Recommended Setup for Always-On Server

### Complete Workflow:

1. **Keep Mac plugged in** (power adapter)
2. **Prevent sleep** using caffeinate or system settings
3. **Use tunnel mode** for remote access

```bash
# Run this command and leave it running:
caffeinate -disu npx expo start --tunnel
```

### What You'll See:

```
Metro waiting on exp://[tunnel-url]
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Metro waiting on [tunnel-url]
```

### On Your Phone (Expo Go):
- Scan the QR code
- Or manually enter the tunnel URL
- Works from anywhere with internet!

---

## Production Alternative: Expo Application Services (EAS)

For a true production setup (not development server):

### Build a Standalone App:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile preview

# Build for Android
eas build --platform android --profile preview
```

This creates an actual installable app that doesn't need the dev server.

---

## Troubleshooting

### Server Closes When Mac Sleeps

**Problem:** Server stops when Mac goes to sleep
**Solution:** Use `caffeinate` command or change system sleep settings

### Can't Access from Different WiFi

**Problem:** QR code doesn't work on different network
**Solution:** Use `--tunnel` mode instead of local network

### Tunnel is Slow

**Problem:** Tunnel mode has performance lag
**Solution:** 
- For local testing, use same WiFi without tunnel
- For remote access, tunnel is necessary trade-off
- Consider building a standalone preview build

### Connection Lost

**Problem:** Loses connection randomly
**Solution:**
- Keep Mac plugged into power
- Disable WiFi sleep: System Settings → WiFi → Details → Low Power Mode → Off
- Use Ethernet cable instead of WiFi for Mac

---

## Best Practices

### For Daily Development:
```bash
# Same WiFi (faster)
npx expo start
```

### For Remote Testing:
```bash
# Different WiFi/location (slower but accessible)
caffeinate -disu npx expo start --tunnel
```

### For Long Running (overnight, etc):
```bash
# Keep Mac awake + tunnel mode
caffeinate -disu npx expo start --tunnel --lan
```

---

## Quick Reference

| Command | Use Case |
|---------|----------|
| `npx expo start` | Local WiFi only |
| `npx expo start --tunnel` | Access from anywhere |
| `caffeinate npx expo start` | Prevent sleep, local WiFi |
| `caffeinate npx expo start --tunnel` | **Best for always-on** |
| `npx expo start --lan` | Local network (faster than tunnel) |

---

## Energy Settings Checklist

- [ ] Mac plugged into power adapter
- [ ] Display sleep disabled (or set to long duration)
- [ ] System sleep disabled for power adapter
- [ ] Hard disk sleep disabled
- [ ] Low Power Mode disabled for WiFi
- [ ] Terminal window stays open
- [ ] `caffeinate` command running

---

## Next Steps

1. **For immediate use:**
   ```bash
   caffeinate -disu npx expo start --tunnel
   ```

2. **Test from your phone:**
   - Open Expo Go app
   - Scan QR code
   - Verify app loads

3. **Test from different WiFi:**
   - Turn off WiFi on phone
   - Use cellular data or different WiFi
   - Should still connect via tunnel

4. **For production:**
   - Consider building preview/production builds with EAS
   - Deploy actual installable apps
   - No dev server needed

---

**Created:** November 8, 2025  
**Status:** Ready to use  
**Recommended Command:** `caffeinate -disu npx expo start --tunnel`

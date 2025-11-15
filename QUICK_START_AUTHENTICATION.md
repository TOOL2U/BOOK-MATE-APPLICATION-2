# 🚀 QUICK START: Test Your New Authentication System

**Ready in 5 minutes!**

---

## Step 1: Get Test Account Password

**Contact your webapp team** and ask for the password for:
```
Email: shaun@siamoon.com
Company: Sia Moon Company Limited
```

---

## Step 2: Start the App

```bash
cd "/Users/shaunducker/Desktop/BookMate Mobile Application/BOOK-MATE-APPLICATION-2"
npx expo start
```

---

## Step 3: Test Login

1. **App opens to login screen** (new!)
2. **Enter credentials:**
   - Email: `shaun@siamoon.com`
   - Password: `[from webapp team]`
3. **Tap "Log In"**
4. **Success!** You'll see the Balance screen

---

## Step 4: Explore the App

Navigate through tabs:
- ✅ **Manual** - Add expenses manually
- ✅ **Upload** - Scan receipts
- ✅ **Balance** - See your balance
- ✅ **P&L** - Profit & loss reports
- ✅ **Activity** - Transaction inbox
- ⭐ **Settings** - NEW! Your profile + logout button

---

## Step 5: Test Logout

1. **Go to Settings tab** (far right)
2. **See your profile:**
   - Your name
   - Your email (shaun@siamoon.com)
   - Company (Sia Moon Company Limited)
   - Account ID
3. **Scroll to bottom**
4. **Tap red "Logout" button**
5. **Confirm "Logout"**
6. **You're back at login screen!** ✅

---

## Step 6: Test Session Persistence

1. **Login again** (shaun@siamoon.com + password)
2. **Navigate around the app**
3. **Force quit app** (swipe up, close completely)
4. **Reopen app**
5. **Expected:** App opens directly to Balance (no login needed!)
6. **Why?** Session is saved and still valid

---

## Step 7: Test Multi-Tenant (Optional)

If you have a second test account:

1. **Logout from shaun@siamoon.com**
2. **Login as maria@siamoon.com** (different account)
3. **Check Balance screen**
4. **Expected:** Different company name and balance
5. **Check P&L screen**
6. **Expected:** Different data (not shaun's data)
7. **Success!** Multi-tenant isolation working ✅

---

## ✅ What to Look For

### Login Screen ✅
- BookMate logo and title
- Email and password fields
- "Log In" button
- Info text about contacting admin

### Settings Screen ✅
- User avatar with initial
- Display name
- Email address
- Company name
- Account ID
- App version (1.1.0)
- API endpoint (accounting.siamoon.com)
- Red "Logout" button

### After Logout ✅
- Returns to login screen
- Session cleared
- Can't access app without login

---

## 🐛 Common Issues

### "Invalid email or password"
- **Check:** Email is exactly `shaun@siamoon.com` (no typos)
- **Check:** Password from webapp team is correct
- **Check:** Internet connection working

### App crashes after login
- **Check:** Look at console logs
- **Report:** Error message to developer
- **Workaround:** Clear app data and try again

### Can't see Settings tab
- **Check:** App.tsx was updated correctly
- **Solution:** Restart Expo dev server (`npx expo start`)

### Logout doesn't work
- **Check:** Press and hold to see confirmation dialog
- **Check:** Tap "Logout" (not "Cancel")
- **Expected:** Return to login screen

---

## 📞 Need Help?

1. **Check console logs** (Expo dev tools)
2. **Check this document:** [AUTHENTICATION_SYSTEM_COMPLETE.md](./AUTHENTICATION_SYSTEM_COMPLETE.md)
3. **Read webapp team docs:** [MOBILE_APP_INTEGRATION_COMPLETE_GUIDE.md](./MOBILE_APP_INTEGRATION_COMPLETE_GUIDE.md)

---

## 🎯 Success Checklist

- [ ] Got test account password from webapp team
- [ ] Started Expo (`npx expo start`)
- [ ] Saw login screen on app launch
- [ ] Logged in with shaun@siamoon.com
- [ ] Saw Balance screen (not login screen)
- [ ] Navigated to Settings tab
- [ ] Saw profile info (name, email, company)
- [ ] Tapped Logout button
- [ ] Confirmed logout
- [ ] Returned to login screen
- [ ] Force quit and reopened app
- [ ] Logged in again
- [ ] Session persisted after force quit/reopen

**All checked?** Your authentication system is working perfectly! 🎉

---

## 🚀 What's Next?

1. **Test all existing features** with authentication
2. **Test with second account** (multi-tenant isolation)
3. **Update version** to 1.1.0
4. **Build for production** (`eas build`)
5. **Submit to Apple** with new authentication feature

---

**You're ready to test! Start Expo and login!** 🚀

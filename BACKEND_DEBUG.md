# 🔧 Backend Error Troubleshooting Guide

## Error: "invalid response from server"

This error means the backend is either:
1. ❌ Not running
2. ❌ Returning HTML error instead of JSON
3. ❌ Not accessible from your device
4. ❌ Endpoint doesn't exist

---

## 🧪 Diagnostics Added

Your app now shows the backend status on the payment form:
- ✅ Green: Backend is working
- ⚠️ Yellow: Backend responding but with warnings
- ❌ Red: Backend is down or unreachable

---

## 🔍 How to Diagnose

### Step 1: Check Backend Status
When you open the payment page, you'll see a status message showing if the backend is accessible.

### Step 2: Check Console Logs
Open browser/mobile console and look for logs like:
```
📍 Step 1: Reserving boxes...
📍 Reserve response status: 200/404/500
📍 Reserve response body: {...}
```

### Step 3: Verify Backend URL
The backend URL in your app is:
```
https://diya-backenddiya-backend.onrender.com
```

**Check these URLs in your browser:**
- Health: `https://diya-backenddiya-backend.onrender.com/health`
- Reserve: `https://diya-backenddiya-backend.onrender.com/reserve-boxes`
- Create Order: `https://diya-backenddiya-backend.onrender.com/create-order`

---

## 🛠️ Common Issues & Fixes

### Issue 1: Backend Not Running
**Error**: `connected refused` or `ERR_NAME_NOT_RESOLVED`

**Fix**:
```bash
# Start the backend
npm start
# or for production
node index.js
```

**Or for Render deployment:**
1. Go to https://render.com
2. Find your backend service
3. Check if it's still running
4. Redeploy if needed

---

### Issue 2: Wrong Endpoint Names
**Error**: `Status 404` in console

**The app expects these endpoints:**
- `POST /reserve-boxes` - Request: `{ boxes: [1,2,3] }`
- `POST /create-order` - Request: `{ boxes: [1,2,3], packageMode: "regular" }`
- `POST /verify-payment` - Request: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, ... }`
- `GET /health` - For health check

**Fix:** Make sure your backend has these exact endpoints

---

### Issue 3: Backend Returning HTML
**Error**: Response starts with `<html>` instead of `{`

**Possible causes:**
- Backend crashed and Render is showing error page
- Wrong URL
- Endpoint doesn't exist (returns 404 HTML)

**Fix:**
1. Check backend logs on Render
2. Verify all endpoints exist
3. Check if environment variables are set

---

### Issue 4: CORS Error
**Error**: `Cross-Origin Request Blocked`

**Fix in backend (index.js):**
```javascript
const cors = require('cors');
app.use(cors());
```

---

### Issue 5: Response Format Wrong
**Error**: `Backend returned invalid response`

**The backend must return JSON:**
```json
// Correct format
{ "id": "order_123", "amount": 60000, "currency": "INR" }

// Wrong format
"Order created"
<html>...</html>
```

---

## 🧪 Manual Testing

### Test Backend Connection (in browser console)
```javascript
// Test health endpoint
fetch('https://diya-backenddiya-backend.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d))
  .catch(e => console.error('❌ Error:', e))

// Test reserve endpoint
fetch('https://diya-backenddiya-backend.onrender.com/reserve-boxes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ boxes: [1, 2] })
})
  .then(r => r.json())
  .then(d => console.log('✅ Reserve:', d))
  .catch(e => console.error('❌ Error:', e))
```

---

## 📋 Checklist

- [ ] Backend is running (`npm start`)
- [ ] Backend URL is correct in constants/packages.ts
- [ ] All required endpoints exist:
  - [ ] `/health`
  - [ ] `/reserve-boxes`
  - [ ] `/create-order`
  - [ ] `/verify-payment`
- [ ] Endpoints return valid JSON
- [ ] CORS is enabled
- [ ] Supabase credentials are correct
- [ ] Backend can connect to database

---

## 🆘 If Still Not Working

### Check Backend Logs
```bash
# Local backend
npm start
# Watch for errors

# Render backend
# Go to Dashboard → Services → [backend-name] → Logs
```

### Check Expected Response Format
Add this to backend (temporary):
```javascript
app.post('/reserve-boxes', (req, res) => {
  console.log('Reserve request:', req.body);
  // Your logic here...
  res.json({ success: true, message: "Boxes reserved" });
});
```

### Test with curl
```bash
curl -X POST https://diya-backenddiya-backend.onrender.com/reserve-boxes \
  -H "Content-Type: application/json" \
  -d '{"boxes":[1,2,3]}'
```

---

## 📞 Quick Fixes

1. **App shows "❌ Backend not reachable"**
   - ✅ Start backend server
   - ✅ Check internet connection
   - ✅ Verify URL is correct

2. **App shows "Status 404"**
   - ✅ Check endpoint names match exactly
   - ✅ Check endpoint is defined in backend

3. **App shows "Status 500"**
   - ✅ Check backend logs for error
   - ✅ Check database connection
   - ✅ Check all environment variables

4. **Payment goes through but "invalid response"**
   - ✅ Verify `/verify-payment` endpoint exists
   - ✅ Check it returns valid JSON response

---

## 🎯 Expected Success Flow

1. ✅ App shows "✅ Backend connected"
2. ✅ Fill form and tap Pay
3. ✅ Console shows: "📍 Step 1: Reserving boxes..."
4. ✅ Console shows: "✅ Boxes reserved successfully"
5. ✅ Console shows: "📍 Step 2: Creating Razorpay order..."
6. ✅ Console shows: "✅ Order created successfully"
7. ✅ Razorpay modal opens
8. ✅ Complete payment
9. ✅ See "🎉 Booking Confirmed!"

---

## 📝 Example Backend Endpoints

### `/reserve-boxes` (POST)
```javascript
app.post('/reserve-boxes', async (req, res) => {
  const { boxes } = req.body;
  // Update Supabase grid_boxes status to 'reserved'
  res.json({ success: true, message: "Boxes reserved" });
});
```

### `/create-order` (POST)
```javascript
app.post('/create-order', async (req, res) => {
  const { boxes, packageMode } = req.body;
  const amount = PACKAGE_CONFIG[packageMode].price * 100; // in paise
  
  // Create Razorpay order
  res.json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: "INR"
  });
});
```

### `/verify-payment` (POST)
```javascript
app.post('/verify-payment', async (req, res) => {
  // Verify signature and save payment
  res.json({ success: true, message: "Payment verified" });
});
```

---

## 🚀 Next Steps

1. Start backend server
2. Verify endpoints are working
3. Test payment flow
4. Check console logs
5. If still failing, check backend logs for specific error

Good luck! 🎯

# Troubleshooting Deployment Issues

## Login/API Connection Issues

If you're seeing "Login failed" or connection errors in production, follow these steps:

### 1. Check Environment Variables in Vercel

**Critical**: You MUST set the `VITE_API_URL` environment variable in Vercel.

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend-api.vercel.app/api`)
   - **Environment**: Production (and Preview if needed)
4. **Redeploy** your application after adding the variable

### 2. Verify Backend is Deployed and Accessible

- Make sure your backend server is deployed and running
- Test the backend API directly by visiting: `https://your-backend-api.vercel.app/api/auth/login` (should return an error about missing credentials, not a 404)
- Check backend logs for any errors

### 3. Check Browser Console

Open browser DevTools (F12) → Console tab and look for:
- API Base URL logs (shows what URL is being used)
- Network errors (CORS, timeout, etc.)
- API Error Response logs (shows detailed error information)

### 4. Common Issues and Solutions

#### Issue: "Unable to connect to server"
**Cause**: Backend is not accessible or URL is incorrect
**Solution**: 
- Verify backend is deployed
- Check `VITE_API_URL` is set correctly in Vercel
- Ensure backend URL includes `/api` at the end (e.g., `https://api.example.com/api`)

#### Issue: CORS Errors
**Cause**: Backend CORS configuration doesn't allow your frontend domain
**Solution**: Update backend CORS to include your Vercel domain:
```javascript
// In your backend server code
app.use(cors({
  origin: ['https://campus-sphere-chi.vercel.app', 'https://your-domain.vercel.app'],
  credentials: true
}));
```

#### Issue: "Login failed" (generic error)
**Cause**: Backend responded with an error (invalid credentials, server error, etc.)
**Solution**: 
- Check browser console for detailed error logs
- Verify user credentials are correct
- Check backend logs for server-side errors

### 5. Testing Locally

To test with your production backend locally:

1. Create `.env` file in `client` directory:
```
VITE_API_URL=https://your-backend-api.vercel.app/api
```

2. Run `npm run dev` in the client directory
3. Try logging in - this will use your production backend

### 6. Debug Information

The app now logs helpful debug information:
- API Base URL being used
- Environment mode (development/production)
- Detailed error responses from the API
- Network error details

Check the browser console to see these logs.

### 7. Quick Checklist

- [ ] `VITE_API_URL` environment variable is set in Vercel
- [ ] Backend is deployed and accessible
- [ ] Backend CORS allows your frontend domain
- [ ] Application was redeployed after setting environment variables
- [ ] Browser console shows the correct API URL
- [ ] Backend API endpoints are working (test with Postman/curl)

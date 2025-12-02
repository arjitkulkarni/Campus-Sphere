# Deployment Guide

## Environment Variables

For the frontend to connect to your backend API in production, you need to set the `VITE_API_URL` environment variable.

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend-api.vercel.app/api` or `https://api.yourdomain.com/api`)
   - **Environment**: Production (and Preview if needed)

### Local Development

For local development, create a `.env` file in the `client` directory:

```
VITE_API_URL=http://localhost:5000/api
```

The app will automatically use `http://localhost:5000/api` if `VITE_API_URL` is not set.

### Important Notes

- Environment variables prefixed with `VITE_` are exposed to the client-side code
- After setting environment variables in Vercel, you need to redeploy for changes to take effect
- Make sure your backend API is deployed and accessible at the URL you specify
- The backend should have CORS configured to allow requests from your frontend domain

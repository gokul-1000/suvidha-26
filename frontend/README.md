# Suvidha Frontend

## API Configuration

### Production (Vercel)
The frontend uses relative URLs (`/api/*`) which are proxied to the backend via `vercel.json` rewrites configuration.

**Important**: The `vercel.json` file contains the backend URL for production. If the backend URL changes, update the `destination` field in `vercel.json` manually. Vercel rewrites do not support environment variable substitution in the destination field.

For dynamic backend URLs, consider using Vercel Edge Functions or a custom proxy server.

### Development
Set the backend URL using environment variables:

```sh
VITE_API_URL=              # Leave empty to use relative URLs (recommended)
VITE_BACKEND_URL=http://your-backend-url:4000  # Backend URL for dev proxy
```

If `VITE_BACKEND_URL` is not set, the dev proxy defaults to the production backend URL.

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `VITE_API_URL`: Leave empty for relative URLs
- `VITE_BACKEND_URL`: Backend URL for development proxy
- Firebase and Razorpay credentials

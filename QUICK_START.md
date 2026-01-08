# Quick Start Guide - Authentication Setup

## Prerequisites

1. **Backend Running**: Ensure your Django backend is running on `http://localhost:8000`
2. **CORS Configured**: Backend must allow requests from your frontend origin
3. **Database Ready**: All migrations applied and database accessible

## Installation

The project already has all required dependencies installed:
- ✅ `axios` - HTTP client
- ✅ `@tanstack/react-query` - Data fetching
- ✅ `@tanstack/react-router` - Routing
- ✅ `zustand` - State management
- ✅ `zod` - Validation
- ✅ `react-hook-form` - Form handling

## Running the Application

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

## Testing Authentication

### 1. Register a New User

1. Navigate to `http://localhost:5173/sign-up`
2. Fill in:
   - Username (3+ characters, letters/numbers/@/./+/-/_)
   - Email (valid email address)
   - Password (8+ characters)
   - Confirm Password (must match)
3. Click "Create Account"
4. On success, you'll be automatically logged in and redirected to the dashboard

### 2. Login

1. Navigate to `http://localhost:5173/sign-in`
2. Enter either:
   - Your email address, OR
   - Your username
3. Enter your password
4. Click "Sign in"
5. On success, you'll be redirected to the dashboard

### 3. Logout

1. Click on your user avatar/menu in the top right
2. Click "Sign out"
3. Confirm the logout dialog
4. You'll be redirected to the login page

### 4. Password Reset

1. Navigate to `http://localhost:5173/forgot-password`
2. Enter your email address
3. Click "Continue"
4. Check your email for the reset link (or check backend logs in development)

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

**Backend (Django) - Add to `settings.py`:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

### 401 Unauthorized Errors

- Check that the backend is running
- Verify the API endpoints match the documentation
- Check browser cookies (should see `aiuthor-access` and `aiuthor-refresh`)

### Network Errors

- Verify backend URL is `http://localhost:8000`
- Check that backend is accessible: `curl http://localhost:8000/api/user/me/`
- Ensure no firewall blocking the connection

### Token Not Persisting

- Check browser cookies are enabled
- Verify cookies are being set (check DevTools → Application → Cookies)
- Check that backend is setting cookies with correct domain

## Development Tips

### Viewing Network Requests

1. Open Browser DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform authentication actions
5. Inspect request/response details

### Checking Auth State

Add this to any component to debug auth state:

```tsx
import { useAuthStore } from '@/stores/auth-store'

function DebugAuth() {
  const { auth } = useAuthStore()
  
  console.log('User:', auth.user)
  console.log('Token:', auth.accessToken)
  
  return null
}
```

### Clearing Auth State

If you need to manually clear authentication:

```javascript
// In browser console
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
localStorage.clear();
location.reload();
```

## API Endpoints Reference

All endpoints use base URL: `http://localhost:8000/api/`

### Auth Endpoints
- `POST /auth/user/login/` - Login
- `POST /auth/user/registration/` - Register
- `POST /auth/user/logout/` - Logout
- `POST /auth/user/password/reset/` - Request password reset
- `POST /auth/user/password/change/` - Change password

### User Endpoints
- `GET /user/me/` - Get current user
- `GET /user/all` - Get all users

## Next Steps

1. ✅ Test registration flow
2. ✅ Test login flow
3. ✅ Test logout flow
4. ✅ Test password reset
5. ⬜ Implement Google OAuth
6. ⬜ Add user profile page
7. ⬜ Add avatar upload

## Support

For issues or questions:
1. Check the `IMPLEMENTATION_SUMMARY.md` for detailed implementation info
2. Check the `src/features/auth/README.md` for API documentation
3. Review the browser console for error messages
4. Check the backend logs for API errors

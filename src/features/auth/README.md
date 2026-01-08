# Authentication Implementation

This directory contains the complete authentication implementation for the frontend application, integrated with the Django backend API.

## Overview

The authentication system uses:
- **JWT tokens** for authentication (access & refresh tokens)
- **Cookie-based** authentication (preferred for web)
- **Header-based** authentication (for mobile/external clients)
- **Axios** for API requests
- **TanStack Query** for data fetching and mutations
- **Zustand** for client-side state management

## File Structure

```
auth/
├── api.ts              # API service functions
├── hooks.ts            # React Query hooks
├── types.ts            # TypeScript type definitions
├── index.ts            # Barrel export file
├── auth-layout.tsx     # Layout for auth pages
├── sign-in/            # Sign-in page and components
├── sign-up/            # Sign-up page and components
└── forgot-password/    # Password reset page and components
```

## API Endpoints

All endpoints are prefixed with `http://localhost:8000/api/`

### Authentication Endpoints

- `POST /auth/user/login/` - Login with username/email and password
- `POST /auth/user/registration/` - Register new user
- `POST /auth/user/google/` - Google OAuth login
- `POST /auth/user/logout/` - Logout (blacklists refresh token)
- `POST /auth/user/password/reset/` - Request password reset email
- `POST /auth/user/password/reset/confirm/` - Confirm password reset
- `POST /auth/user/password/change/` - Change password (authenticated)

### User Endpoints

- `GET /user/me/` - Get current user profile
- `GET /user/all` - Get all users list

## Usage Examples

### Login

```tsx
import { useLogin } from '@/features/auth/hooks'

function LoginForm() {
  const loginMutation = useLogin()

  const handleSubmit = (data) => {
    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate({ to: '/' })
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loginMutation.isPending}>
        Sign in
      </button>
    </form>
  )
}
```

### Register

```tsx
import { useRegister } from '@/features/auth/hooks'

function RegisterForm() {
  const registerMutation = useRegister()

  const handleSubmit = (data) => {
    registerMutation.mutate({
      username: data.username,
      email: data.email,
      password1: data.password,
      password2: data.confirmPassword,
    })
  }
}
```

### Get Current User

```tsx
import { useCurrentUser } from '@/features/auth/hooks'

function UserProfile() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) return <div>Loading...</div>

  return <div>Welcome, {user?.username}!</div>
}
```

### Logout

```tsx
import { useLogout } from '@/features/auth/hooks'

function LogoutButton() {
  const logoutMutation = useLogout()

  return (
    <button onClick={() => logoutMutation.mutate()}>
      Logout
    </button>
  )
}
```

## Authentication Flow

1. **Login**: User submits credentials → API returns access & refresh tokens → Tokens stored in cookies and Zustand store → User data fetched and stored
2. **Authenticated Requests**: Axios interceptor adds `Authorization: Bearer <token>` header to all requests
3. **Token Refresh**: If access token expires (401 error), interceptor automatically attempts to refresh using the refresh token cookie
4. **Logout**: Refresh token is blacklisted on backend → Cookies and local state cleared → User redirected to login

## State Management

### Auth Store (Zustand)

Located in `src/stores/auth-store.ts`

```typescript
interface AuthUser {
  id: string
  username: string
  email: string
  avatar_url?: string | null
}

// Usage
const { auth } = useAuthStore()

auth.user           // Current user data
auth.accessToken    // Current access token
auth.setUser(user)  // Set user data
auth.setAccessToken(token) // Set access token
auth.reset()        // Clear all auth data
```

## Error Handling

- **401 Unauthorized**: Automatically triggers token refresh or logout
- **403 Forbidden**: User doesn't have permission
- **500 Server Error**: Shows error toast and redirects to error page (in production)
- **Field Errors**: Displayed inline in forms via React Hook Form

## Security Features

- HttpOnly cookies for token storage
- Automatic token refresh
- CSRF protection (via cookies)
- Secure cookies in production
- Token blacklisting on logout

## TODO

- [ ] Implement GitHub OAuth
- [ ] Implement Facebook OAuth  
- [ ] Add password reset confirmation page
- [ ] Add email verification flow
- [ ] Add remember me functionality
- [ ] Add rate limiting feedback

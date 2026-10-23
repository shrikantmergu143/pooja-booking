import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '../types/index.ts';

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialSession = (): AuthState => {
  try {
    const raw = localStorage.getItem('POOJA_ADMIN_SESSION');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.user && parsed.token) {
        return {
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: true,
        };
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialSession();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AdminUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('POOJA_ADMIN_SESSION', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('POOJA_ADMIN_SESSION');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

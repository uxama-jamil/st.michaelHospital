export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  EMAIL_SENT: '/email-sent',
  SET_PASSWORD: '/set-password',
  TWO_FACTOR_AUTH: '/verify-otp',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  // Module routes
  MODULES: {
    BASE: '/modules',
    ADD: '/add-module',
    EDIT: '/edit-module/:id',
    CONTENT: {
      BASE: '/content/:id',
      ADD: '/add-content/:categoryId',
      EDIT: '/edit-content/:id/category/:categoryId',
    },
  },

  // Playlist routes
  PLAYLIST: {
    BASE: '/playlist',
    ADD: '/add-playlist',
    EDIT: '/edit-playlist/:id',
    DETAIL: '/playlist-detail/:id',
  },

  // User routes
  USER_MANAGEMENT: {
    BASE: '/user-management',
    ADD: '/user-management/add-user',
    EDIT: '/user-management/edit-user/:id',
  },

  WILDCARD: '*',
} as const;

export type AppRoutePaths = typeof ROUTE_PATHS;

export const AUTH_ROUTES = {
  LOGIN: ROUTE_PATHS.LOGIN,
  FORGOT_PASSWORD: ROUTE_PATHS.FORGOT_PASSWORD,
  EMAIL_SENT: ROUTE_PATHS.EMAIL_SENT,
  SET_PASSWORD: ROUTE_PATHS.SET_PASSWORD,
  TWO_FACTOR_AUTH: ROUTE_PATHS.TWO_FACTOR_AUTH,
} as const;

export const MODULES_ROUTES = ROUTE_PATHS.MODULES;
export const PLAYLIST_ROUTES = ROUTE_PATHS.PLAYLIST;
export const USER_ROUTES = ROUTE_PATHS.USER_MANAGEMENT;

export interface RouteConfig {
  path?: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

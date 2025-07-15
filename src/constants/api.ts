export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const MODULES_ORDER = Order.DESC;
export const MODULES_PAGE_SIZE = 20;

export const USER_MANAGEMENT_ORDER = Order.DESC;
export const USER_MANAGEMENT_PAGE_SIZE = 20;

export const MODULE_CONTENT_ORDER = Order.ASC;
export const MODULE_CONTENT_PAGE_SIZE = 12;

export const CONTENT_DROP_DOWN_ORDER = Order.DESC;
export const CONTENT_DROP_DOWN_PAGE_SIZE = 50;

export const PLAYLIST_ORDER = Order.DESC;
export const PLAYLIST_PAGE_SIZE = 20;

export const PLAYLIST_CONTENT_ORDER = Order.DESC;
export const PLAYLIST_CONTENT_PAGE_SIZE = 20;

export const MAX_VISIBLE_TAGS = 2;

export const KEYWORDS_API = '/keyword';
export const AUTH_API_LOGIN = '/auth/login';
export const AUTH_API_OTP = '/auth/otp';
export const AUTH_API_OTP_RESEND = '/auth/resend-otp';
export const AUTH_API_FORGOT = '/auth/forgot';
export const AUTH_API_RESET = '/auth/reset';
export const AUTH_API_TOKEN_STATUS = '/auth/tokenstatus';

export const MODULES_API_LIST = '/categories/list';
export const MODULES_API = '/categories/:id';
export const MODULES_API_BASE = '/categories';
export const MODULES_API_STATUS = '/categories/:id/status';

export const CONTENT_API_BASE = '/content';
export const CONTENT_API = '/content/:id';
export const CONTENT_API_UPDATE = '/content/update';
export const CONTENT_API_ALL = '/content/list/all';
export const CONTENT_API_ADMIN_LIST = '/content/admin-list';

export const S3_API_BASE = '/s3/upload-url';

export const USER_MANAGEMENT_API_BASE = '/users';
export const USER_MANAGEMENT_API_ADMINS = '/users/admins';
export const USER_MANAGEMENT_API_ID = '/users/:id';
export const USER_MANAGEMENT_API_CREATE = '/auth/register';
export const USER_MANAGEMENT_API_FORGOT = '/auth/forgot';
export const USER_DASIGNATION_API = '/users/designation/list';

export const RESET_PASSWORD_API = '/auth/update/password';

export const PLAYLIST_API_BASE = '/playlists';
export const PLAYLIST_API_CONTENT = '/playlists/:id/content';
export const PLAYLIST_API_ID = '/playlists/:id';
export const PLAYLIST_API_STATUS = '/playlists/:id/status';

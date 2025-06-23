export interface UserDetails {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  designation?: string | null;
  role: string;
  isActive: boolean;
  resend: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  data: UserDetails[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  [key: string]: any;
}

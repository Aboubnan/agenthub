export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

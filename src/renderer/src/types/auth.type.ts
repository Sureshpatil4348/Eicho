export interface USER_DETAILS {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  profileImage?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthLoginType {
  username: string;
  password: string;
}

export interface AuthForgotPasswordType {
  email: string;
}

export interface AuthForgotPasswordSecondStepType {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface AUTH_REGISTRATION {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: number;
  password: string;
  confirmPassword: string | null;
}

export interface AUTH_FORGOT_PASSWORD {
  username: string;
}

export interface AUTH_RESET_PASSWORD {
  password: string;
  confirmPassword: string | null;
}

export interface AUTH_CONTEXT {
  isAuthorized: boolean;
  userDetails: USER_DETAILS | null;
  setUserDetails: React.Dispatch<React.SetStateAction<USER_DETAILS | null>>;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

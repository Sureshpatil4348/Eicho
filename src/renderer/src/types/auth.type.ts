export interface USER_DETAILS {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cc: string;
  profileImage?: string;
  userType: string;
  colorCode: string;
  userStatus: string;
  createdAt: string;
  address: string;
}

export interface AUTH_LOGIN {
  userName: string;
  password: string;
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
  userName: string;
}

export interface AUTH_RESET_PASSWORD {
  password: string;
  confirmPassword: string | null;
}

export interface AUTH_CONTEXT {
  isAuthorized: boolean;
  userDetails: USER_DETAILS | null;
  setUserDetails: React.Dispatch<React.SetStateAction<USER_DETAILS | null>>;
}

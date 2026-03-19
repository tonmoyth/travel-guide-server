export type TMember = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  profilePhoto?: string;
  role: string;
  bio?: string;
  address?: string;
  gender?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type TSignupPayload = {
  email: string;
  password: string;
  name: string;
  profilePhoto?: string;
  bio?: string;
  address?: string;
  gender?: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TSignupResponse = {
  user: TMember;
};

export type TLoginResponse = {
  user: TMember;
  session: any;
};

export type TAuthResponse = TSignupResponse | TLoginResponse;

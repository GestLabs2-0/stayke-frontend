export type RegisterUser = {
  owner: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  address: string;
  phone: string;
  identity: string | null;
  reputation: string;
  userProfile: string;
  lending: number;
  deposited: number;
  staked: number;
  isVerified: boolean;
  listings: number;
  activeStay: string | null;
  email?: string | undefined;
};

export type UserProfileResponse = {
  owner: string;
  name: string;
  lastName: string;
  email?: string;
  isVerified: boolean;
};

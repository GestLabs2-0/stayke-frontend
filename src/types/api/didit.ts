export type DiditSessionStatus =
  | "Not Started"
  | "In Progress"
  | "Approved"
  | "Declined"
  | "In Review"
  | "Expired"
  | "Abandoned"
  | "Kyc Expired"
  | "Resubmitted"
  | "Awaiting User";

export type DiditSessionResponse = {
  sessionId: string;
  url: string;
  status: string;
};

export type DiditProgressResponse = {
  isVerified: boolean;
  identity: string | null;
  diditSessionStatus: DiditSessionStatus;
};

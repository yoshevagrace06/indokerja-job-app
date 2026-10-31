import api from "./axios";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: "JOB_SEEKER" | "COMPANY";
  createdAt: string;
  company?: {
    id: string;
    companyName: string;
    description?: string | null;
  } | null;
}

export const getMyProfile = async (): Promise<Profile> => {
  const res = await api.get("/users/me");
  return res.data;
};
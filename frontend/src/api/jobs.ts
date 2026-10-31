import api from "./axios";

export interface CreateJobPayload {
  title: string;
  description: string;
  location: string;
  salary: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
}

export const createJob = async (payload: CreateJobPayload) => {
  const res = await api.post("/jobs", payload);
  return res.data;
};
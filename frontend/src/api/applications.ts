import api from "./axios";

export interface Applicant {
  id: string;
  status: "APPLIED" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";
  appliedAt: string;
  jobSeeker: {
    id: string;
    name: string;
    email: string;
  };
}

export const getApplicantsByJob = async (jobId: string): Promise<Applicant[]> => {
  const res = await api.get(`/applications/job/${jobId}`);
  return res.data;
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const res = await api.patch(`/applications/${applicationId}/status`, { status });
  return res.data;
};
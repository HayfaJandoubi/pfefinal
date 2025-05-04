import axios from "axios";

export interface TechnicianData {
  fullName: string;
  email: string;
  phone: string;
  region: string;
  managerId: string;
  password: string;
}

export const addTechnician = async (technicianData: TechnicianData): Promise<void> => {
  await axios.post("http://localhost:5000/api/technicians", technicianData);
};

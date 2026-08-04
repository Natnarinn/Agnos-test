import StaffDashboard from "@/presentation/staff/patientUpdate";
import { PatientProvider } from "@/presentation/patient/patientProvider";


export default function Home() {
  return (
    <PatientProvider>
        <StaffDashboard />
    </PatientProvider>
  );
}
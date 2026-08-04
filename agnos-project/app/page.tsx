"use client";

import { PatientProvider } from "@/presentation/patient/patientProvider";
import PatientForm from "@/presentation/patient/patientForm";
import StaffDashboard from "@/presentation/staff/patientUpdate";

export default function Home() {
  return (
    <PatientProvider>
      
        <PatientForm />
      
    </PatientProvider>
  );
}
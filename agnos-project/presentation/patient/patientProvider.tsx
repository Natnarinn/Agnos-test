"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export type PatientStatus = "idle" | "typing" | "submitted";

export interface Patient {
  id: string;
  createdAt: number;
  lastUpdated: number;

  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  religion: string;
  language: string;
  emergencyName: string;
  emergencyRelation: string;

  progress: number;
  updatedField: string;
  status: PatientStatus;
}

interface PatientContextType {
  patients: Patient[];
  patient: Patient;
  updateField: (field: keyof Patient, value: string) => void;
  markSubmitted: () => void;
  resetPatient: () => void;
  deletePatient: (id: string) => void;
  clearAllPatients: () => void;
}

const PatientContext = createContext<PatientContextType | null>(null);

const FIELDS_FOR_PROGRESS: (keyof Patient)[] = [
  "firstName",
  "lastName",
  "dob",
  "gender",
  "phone",
  "email",
  "address",
  "nationality",
];

const STORAGE_KEY_LIST = "agnos_patients_list";
const SESSION_KEY_ID = "agnos_current_patient_id";
const CHANNEL_NAME = "agnos_patient_sync";

function computeProgress(p: Patient) {
  const filled = FIELDS_FOR_PROGRESS.filter(
    (f) => String(p[f] || "").trim().length > 0
  ).length;
  return Math.round((filled / FIELDS_FOR_PROGRESS.length) * 100);
}

function createInitialPatient(id: string): Patient {
  const now = Date.now();
  return {
    id,
    createdAt: now,
    lastUpdated: now,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    nationality: "",
    religion: "",
    language: "",
    emergencyName: "",
    emergencyRelation: "",

    progress: 0,
    updatedField: "",
    status: "idle",
  };
}

function generatePatientId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `pat_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `pat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patientsMap, setPatientsMap] = useState<Record<string, Patient>>({});
  const [currentId, setCurrentId] = useState<string>("");
  const channelRef = useRef<BroadcastChannel | null>(null);

  // โหลด session ID + โหลดข้อมูลผู้ป่วยทั้งหมดจาก localStorage และฟัง BroadcastChannel
  useEffect(() => {
    let sessId = sessionStorage.getItem(SESSION_KEY_ID);
    if (!sessId) {
      sessId = generatePatientId();
      sessionStorage.setItem(SESSION_KEY_ID, sessId);
    }
    setCurrentId(sessId);

    const saved = localStorage.getItem(STORAGE_KEY_LIST);
    let initialMap: Record<string, Patient> = {};
    if (saved) {
      try {
        initialMap = JSON.parse(saved);
      } catch {
        initialMap = {};
      }
    }

    setPatientsMap(initialMap);

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<Record<string, Patient>>) => {
      if (event.data && typeof event.data === "object") {
        setPatientsMap(event.data);
      }
    };

    // ลบ draft ที่ยังไม่กดส่ง (unsubmitted) เมื่อผู้ป่วยปิดหน้าจอ/แท็บ
    const handleUnload = () => {
      const activeSessId = sessionStorage.getItem(SESSION_KEY_ID);
      if (!activeSessId) return;

      const raw = localStorage.getItem(STORAGE_KEY_LIST);
      if (raw) {
        try {
          const currentMap: Record<string, Patient> = JSON.parse(raw);
          if (
            currentMap[activeSessId] &&
            currentMap[activeSessId].status !== "submitted"
          ) {
            delete currentMap[activeSessId];
            localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(currentMap));
            channel.postMessage(currentMap);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      channel.close();
    };
  }, []);

  const broadcast = (newMap: Record<string, Patient>) => {
    localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(newMap));
    channelRef.current?.postMessage(newMap);
  };

  const currentPatient =
    (currentId && patientsMap[currentId]) ||
    createInitialPatient(currentId || "temp");

  const updateField = (field: keyof Patient, value: string) => {
    if (!currentId) return;

    setPatientsMap((prev) => {
      const existing = prev[currentId] || createInitialPatient(currentId);
      const updated: Patient = {
        ...existing,
        [field]: value,
        updatedField: field as string,
        status: "typing",
        lastUpdated: Date.now(),
      };
      updated.progress = computeProgress(updated);

      const nextMap = { ...prev, [currentId]: updated };
      broadcast(nextMap);
      return nextMap;
    });
  };

  const markSubmitted = () => {
    if (!currentId) return;

    setPatientsMap((prev) => {
      const existing = prev[currentId] || createInitialPatient(currentId);
      const updated: Patient = {
        ...existing,
        status: "submitted",
        lastUpdated: Date.now(),
      };
      const nextMap = { ...prev, [currentId]: updated };
      broadcast(nextMap);
      return nextMap;
    });
  };

  const resetPatient = () => {
    const newId = generatePatientId();
    sessionStorage.setItem(SESSION_KEY_ID, newId);
    setCurrentId(newId);
  };

  const deletePatient = (id: string) => {
    setPatientsMap((prev) => {
      const nextMap = { ...prev };
      delete nextMap[id];
      broadcast(nextMap);
      return nextMap;
    });
  };

  const clearAllPatients = () => {
    const newId = generatePatientId();
    sessionStorage.setItem(SESSION_KEY_ID, newId);
    setCurrentId(newId);

    const freshMap: Record<string, Patient> = {};
    setPatientsMap(freshMap);
    broadcast(freshMap);
  };

  const sortedPatients = Object.values(patientsMap).sort(
    (a, b) => b.lastUpdated - a.lastUpdated
  );

  return (
    <PatientContext.Provider
      value={{
        patients: sortedPatients,
        patient: currentPatient,
        updateField,
        markSubmitted,
        resetPatient,
        deletePatient,
        clearAllPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be inside PatientProvider");
  }
  return context;
}
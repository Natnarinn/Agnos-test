"use client";

import React, { useState } from "react";
import {
  Activity,
  Bell,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Heart,
  ShieldAlert,
  Languages,
  Calendar,
  VenetianMask,
  CheckCircle2,
  Search,
  Trash2,
  Eye,
  Users,
  X,
  Clock,
} from "lucide-react";

import { usePatient, Patient, PatientStatus } from "../patient/patientProvider";

function StatusBadge({ status }: { status: PatientStatus }) {
  const styles = {
    submitted: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/60",
    typing: "bg-amber-100 text-amber-800 ring-1 ring-amber-300/80 animate-pulse",
    idle: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  const label = {
    submitted: "Submitted",
    typing: "Actively Filling In",
    idle: "Inactive",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "typing" && (
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
      )}
      {status === "submitted" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {label[status]}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-blue-50 text-blue-600",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  bgColor?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-2.5 ${bgColor}`}>{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        highlight
          ? "border-blue-300 bg-blue-50/80 ring-2 ring-blue-200/50"
          : "border-slate-200/80 bg-slate-50/50"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-semibold text-slate-800 break-words text-sm">
        {value || "—"}
      </p>
    </div>
  );
}

export default function StaffDashboard() {
  const { patients, deletePatient, clearAllPatients } = usePatient();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PatientStatus>("all");

  // คำนวณสถิติ
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === "typing").length;
  const submittedPatients = patients.filter((p) => p.status === "submitted").length;
  const avgProgress =
    totalPatients > 0
      ? Math.round(
          patients.reduce((sum, p) => sum + (p.progress || 0), 0) / totalPatients
        )
      : 0;

  // กรองผู้ป่วยตามการค้นหาและสถานะ
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.middleName} ${p.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      fullName.includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.phone.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100/80 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                AGNOS Staff Dashboard
              </h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                Live Sync
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time monitoring of all patient registrations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Active
            </div>

            {totalPatients > 0 && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear all patient logs?")) {
                    clearAllPatients();
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100/70 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Registered"
            value={totalPatients}
            subtitle="All sessions tracked"
            icon={<Users className="h-5 w-5" />}
            bgColor="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Actively Typing"
            value={activePatients}
            subtitle="Patients filling form right now"
            icon={<Activity className="h-5 w-5" />}
            bgColor="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Completed Submissions"
            value={submittedPatients}
            subtitle="Successfully submitted forms"
            icon={<CheckCircle2 className="h-5 w-5" />}
            bgColor="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Average Progress"
            value={`${avgProgress}%`}
            subtitle="Completion rate across sessions"
            icon={<Bell className="h-5 w-5" />}
            bgColor="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 transition ${
                statusFilter === "all"
                  ? "bg-white text-slate-800 shadow-sm font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              All ({totalPatients})
            </button>
            <button
              onClick={() => setStatusFilter("typing")}
              className={`rounded-lg px-3 py-1.5 transition ${
                statusFilter === "typing"
                  ? "bg-white text-amber-700 shadow-sm font-semibold"
                  : "hover:text-amber-800"
              }`}
            >
              Actively Typing ({activePatients})
            </button>
            <button
              onClick={() => setStatusFilter("submitted")}
              className={`rounded-lg px-3 py-1.5 transition ${
                statusFilter === "submitted"
                  ? "bg-white text-emerald-700 shadow-sm font-semibold"
                  : "hover:text-emerald-800"
              }`}
            >
              Submitted ({submittedPatients})
            </button>
          </div>
        </div>

        {/* Patient Grid / List */}
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/80">
            <Users className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No Patients Found</h3>
            <p className="mt-1 text-sm text-slate-400">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search query or status filter."
                : "Waiting for patients to open the form and start filling..."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((p) => {
              const fullName =
                `${p.firstName} ${p.middleName} ${p.lastName}`
                  .replace(/\s+/g, " ")
                  .trim() || "New Patient / Unnamed";

              return (
                <div
                  key={p.id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition duration-200 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Name + Status */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg line-clamp-1">
                          {fullName}
                        </h3>
                        <p className="mt-0.5 text-xs font-mono font-medium text-slate-400">
                          ID: {p.id}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                        <span>Progress</span>
                        <span className="font-bold text-slate-800">{p.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            p.status === "submitted"
                              ? "bg-emerald-500"
                              : "bg-blue-600"
                          }`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Metadata */}
                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.phone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.email || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          Last edited:{" "}
                          <strong className="text-slate-800 font-medium">
                            {p.updatedField || "None"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setSelectedPatient(p)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove record for ${fullName}?`)) {
                          deletePatient(p.id);
                        }
                      }}
                      className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete patient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {`${selectedPatient.firstName} ${selectedPatient.middleName} ${selectedPatient.lastName}`
                    .replace(/\s+/g, " ")
                    .trim() || "Patient Profile"}
                </h2>
                <p className="mt-0.5 text-xs font-mono font-medium text-slate-400">
                  Session ID: {selectedPatient.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-6">
              {/* Status and Progress */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div>
                  <p className="text-xs font-medium text-slate-500">Current Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedPatient.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">Progress</p>
                  <p className="text-xl font-bold text-slate-800">
                    {selectedPatient.progress}%
                  </p>
                </div>
              </div>

              {/* Patient Fields Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem
                  icon={<User className="h-4 w-4" />}
                  label="Full Name"
                  value={`${selectedPatient.firstName} ${selectedPatient.middleName} ${selectedPatient.lastName}`}
                  highlight={["firstName", "middleName", "lastName"].includes(selectedPatient.updatedField)}
                />
                <DetailItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Date of Birth"
                  value={selectedPatient.dob}
                  highlight={selectedPatient.updatedField === "dob"}
                />
                <DetailItem
                  icon={<VenetianMask className="h-4 w-4" />}
                  label="Gender"
                  value={selectedPatient.gender}
                  highlight={selectedPatient.updatedField === "gender"}
                />
                <DetailItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone Number"
                  value={selectedPatient.phone}
                  highlight={selectedPatient.updatedField === "phone"}
                />
                <DetailItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email Address"
                  value={selectedPatient.email}
                  highlight={selectedPatient.updatedField === "email"}
                />
                <DetailItem
                  icon={<Globe className="h-4 w-4" />}
                  label="Nationality"
                  value={selectedPatient.nationality}
                  highlight={selectedPatient.updatedField === "nationality"}
                />
                <DetailItem
                  icon={<Languages className="h-4 w-4" />}
                  label="Preferred Language"
                  value={selectedPatient.language}
                  highlight={selectedPatient.updatedField === "language"}
                />
                <DetailItem
                  icon={<Heart className="h-4 w-4" />}
                  label="Religion"
                  value={selectedPatient.religion}
                  highlight={selectedPatient.updatedField === "religion"}
                />
                <div className="md:col-span-2">
                  <DetailItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Address"
                    value={selectedPatient.address}
                    highlight={selectedPatient.updatedField === "address"}
                  />
                </div>
                <div className="md:col-span-2">
                  <DetailItem
                    icon={<ShieldAlert className="h-4 w-4" />}
                    label="Emergency Contact"
                    value={
                      selectedPatient.emergencyName
                        ? `${selectedPatient.emergencyName}${
                            selectedPatient.emergencyRelation
                              ? ` (${selectedPatient.emergencyRelation})`
                              : ""
                          }`
                        : "—"
                    }
                    highlight={["emergencyName", "emergencyRelation"].includes(selectedPatient.updatedField)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
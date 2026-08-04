"use client"

import { useState } from "react"
import { usePatient } from "./patientProvider"

type Errors = Partial<Record<string, string>>

const PHONE_REGEX = /^[0-9+()\-\s]{9,15}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function PatientForm() {
  const { patient, updateField, markSubmitted, resetPatient } = usePatient()
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const validate = (): Errors => {
    const e: Errors = {}

    if (!patient.firstName.trim()) e.firstName = "First name is required"
    if (!patient.lastName.trim()) e.lastName = "Last name is required"
    if (!patient.dob) e.dob = "Date of birth is required"
    if (!patient.gender) e.gender = "Please select a gender"
    if (!patient.nationality.trim()) e.nationality = "Nationality is required"
    if (!patient.address.trim()) e.address = "Address is required"

    if (!patient.phone.trim()) {
      e.phone = "Phone number is required"
    } else if (!PHONE_REGEX.test(patient.phone)) {
      e.phone = "Invalid phone number format"
    }

    if (!patient.email.trim()) {
      e.email = "Email is required"
    } else if (!EMAIL_REGEX.test(patient.email)) {
      e.email = "Invalid email format"
    }

    return e
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    setSubmitted(true)

    if (Object.keys(e).length === 0) {
      markSubmitted()
      setIsSaving(true)

      setTimeout(() => {
        setIsSaving(false)
        setSubmitted(false)
        setErrors({})
        resetPatient()
      }, 5000)
    }
  }

  const fieldError = (name: string) =>
    submitted && errors[name] ? (
      <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
    ) : null

  const inputClass = (name: string) =>
    `w-full rounded-xl border p-3 focus:ring-2 focus:outline-none ${
      submitted && errors[name]
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
    }`

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6 relative">
      {/* Saving overlay */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-lg font-semibold text-slate-700">
              Saving patient information...
            </p>
            <p className="text-sm text-slate-500">Please wait a moment</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Patient Registration
            </h1>
            <p className="text-slate-500 mt-2">
              Complete patient information before proceeding.
            </p>
          </div>
          {patient?.id && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-200/70 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Session ID: {patient.id}
            </div>
          )}
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Personal */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-slate-700">
              Personal Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass("firstName")}
                  value={patient.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("firstName")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Middle Name{" "}
                  <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  className="w-full rounded-xl border p-3 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={patient.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass("lastName")}
                  value={patient.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("lastName")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={inputClass("dob")}
                  value={patient.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("dob")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClass("gender")}
                  value={patient.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  disabled={isSaving}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {fieldError("gender")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass("nationality")}
                  value={patient.nationality}
                  onChange={(e) => updateField("nationality", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("nationality")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClass("phone")}
                  maxLength={10}
                  placeholder="+66 xxx xxx xxxx"
                  value={patient.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("phone")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={inputClass("email")}
                  placeholder="example@email.com"
                  value={patient.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("email")}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className={inputClass("address")}
                  value={patient.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  disabled={isSaving}
                />
                {fieldError("address")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Preferred Language
                </label>
                <input
                  className="w-full rounded-xl border p-3 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={patient.language}
                  onChange={(e) => updateField("language", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Religion
                </label>
                <input
                  className="w-full rounded-xl border p-3 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={patient.religion}
                  onChange={(e) => updateField("religion", e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Emergency */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-slate-700">
              Emergency Contact (optional)
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contact Name
                </label>
                <input
                  className="w-full rounded-xl border p-3 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={patient.emergencyName}
                  onChange={(e) => updateField("emergencyName", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Relationship
                </label>
                <input
                  className="w-full rounded-xl border p-3 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={patient.emergencyRelation}
                  onChange={(e) =>
                    updateField("emergencyRelation", e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

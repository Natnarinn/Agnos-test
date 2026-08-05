# 🏥 AGNOS — Patient Registration & Live Monitoring System

**🇹🇭 [ภาษาไทย](#-ภาษาไทย)** | **🇬🇧 [English](#-english)**

---

## 🇹🇭 ภาษาไทย

### 👋 แนะนำโปรเจค

**AGNOS** — ระบบนี้ทำให้ทุกการพิมพ์ของผู้ป่วย **sync แบบ real-time** ไปยังหน้าจอของเจ้าหน้าที่ทันที ช่วยให้ติดตามสถานะ จัดการคิว และเห็นความคืบหน้าของแต่ละคนได้แบบไม่ต้องรีเฟรชหน้าเว็บ

โปรเจคนี้ประกอบด้วย **2 หน้าหลัก**:

| หน้า | ผู้ใช้งาน | หน้าที่ |
|---|---|---|
| `/` | ผู้ป่วย | กรอกแบบฟอร์มลงทะเบียน |
| `/staff` | เจ้าหน้าที่ | ติดตามข้อมูลการลงทะเบียนแบบเรียลไทม์ |

---

### ✨ ฟีเจอร์หลัก

#### 📝 หน้าแรก — Patient Registration Form
- แบบฟอร์มลงทะเบียนสำหรับผู้ป่วย (ชื่อ, เบอร์โทร, อีเมล ฯลฯ)
- ข้อมูลที่กรอกจะถูกส่งขึ้นระบบแบบ real-time ทันทีที่พิมพ์ (ไม่ต้องกด "ส่ง" ก่อนถึงจะเห็นบน dashboard)

#### 📊 หน้า `/staff` — Staff Dashboard
- **Live Sync**: ดูข้อมูลผู้ป่วยที่กำลังกรอกฟอร์มแบบเรียลไทม์
- **สรุปภาพรวม**: จำนวนผู้ลงทะเบียนทั้งหมด, จำนวนคนที่กำลังพิมพ์อยู่, จำนวนที่ส่งฟอร์มสำเร็จ, และ % ความคืบหน้าเฉลี่ย
- **ค้นหา & กรองข้อมูล**: ค้นหาด้วยชื่อ, อีเมล, เบอร์โทร หรือ ID พร้อมตัวกรองสถานะ (ทั้งหมด / กำลังพิมพ์ / ส่งแล้ว)
- **การ์ดข้อมูลผู้ป่วยรายบุคคล**: แสดง progress bar, ข้อมูลติดต่อ, ฟิลด์ล่าสุดที่แก้ไข, ปุ่มดูรายละเอียดและลบข้อมูล
- **Real-time Active indicator**: แสดงสถานะการเชื่อมต่อแบบเรียลไทม์อยู่ตลอดเวลา

---

### 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: React / Next.js
- **Real-time sync**: BroadcastChannel API + localStorage — sync ข้อมูลข้าม tab/หน้าต่างแบบ real-time
- **Styling**: Tailwind CSS

### 🔗 เข้าใช้งานได้ที่

- หน้าผู้ป่วย: https://agnos-test-rho.vercel.app/
- หน้าเจ้าหน้าที่: https://agnos-test-rho.vercel.app/staff

---
---

## 🇬🇧 English

### 👋 Project Introduction

**AGNOS** syncs every keystroke a patient types into the registration form **in real time** to the staff's dashboard — letting staff track status, manage queues, and monitor each patient's progress without ever refreshing the page.

The project consists of **2 main pages**:

| Page | User | Purpose |
|---|---|---|
| `/` | Patient | Fill out the registration form |
| `/staff` | Staff | Monitor registration data in real time |

---

### ✨ Key Features

#### 📝 Home Page — Patient Registration Form
- Registration form for patients (name, phone, email, etc.)
- Every field is synced to the system in real time as the patient types — no need to hit "submit" before it appears on the dashboard

#### 📊 `/staff` Page — Staff Dashboard
- **Live Sync**: watch patients fill out the form in real time
- **Overview cards**: total registered, actively typing, completed submissions, and average completion rate
- **Search & filter**: search by name, email, phone, or ID, with status filters (all / actively typing / submitted)
- **Individual patient cards**: progress bar, contact info, last field edited, view details and delete buttons
- **Real-time Active indicator**: always-on connection status

---

### 🛠️ Tech Stack

- **Frontend**: React / Next.js
- **Real-time sync**: BroadcastChannel API + localStorage — syncs data across tabs/windows in real time
- **Styling**: Tailwind CSS

### 🔗 Live Demo

- Patient page: https://agnos-test-rho.vercel.app/
- Staff page: https://agnos-test-rho.vercel.app/staff

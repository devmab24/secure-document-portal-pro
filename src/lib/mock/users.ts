
import { Department, UserRole, User } from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "cmd@hospital.org",
    firstName: "James",
    lastName: "Wilson",
    role: UserRole.CMD,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "user-2",
    email: "radiology-hod@hospital.org",
    firstName: "Sarah",
    lastName: "Johnson",
    role: UserRole.HOD,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-3",
    email: "dental-hod@hospital.org",
    firstName: "Michael",
    lastName: "Chen",
    role: UserRole.HOD,
    department: Department.DENTAL,
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user-4",
    email: "radiology-staff@hospital.org",
    firstName: "Lisa",
    lastName: "Garcia",
    role: UserRole.STAFF,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "user-5",
    email: "antenatal-staff@hospital.org",
    firstName: "Robert",
    lastName: "Taylor",
    role: UserRole.STAFF,
    department: Department.ANTENATAL,
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "user-6",
    email: "admin@hospital.org",
    firstName: "Alex",
    lastName: "Morgan",
    role: UserRole.ADMIN,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "user-7",
    email: "eyeclinic-hod@hospital.org",
    firstName: "Emily",
    lastName: "Patel",
    role: UserRole.HOD,
    department: Department.EYE_CLINIC,
    avatarUrl: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: "user-8",
    email: "physio-staff@hospital.org",
    firstName: "David",
    lastName: "Okafor",
    role: UserRole.STAFF,
    department: Department.PHYSIOTHERAPY,
    avatarUrl: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: "user-9",
    email: "ae-hod@hospital.org",
    firstName: "Grace",
    lastName: "Thompson",
    role: UserRole.HOD,
    department: Department.A_AND_E,
    avatarUrl: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: "user-10",
    email: "ae-staff@hospital.org",
    firstName: "Marcus",
    lastName: "Wilson",
    role: UserRole.STAFF,
    department: Department.A_AND_E,
    avatarUrl: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "user-11",
    email: "pharmacy-hod@hospital.org",
    firstName: "Victoria",
    lastName: "Adekunle",
    role: UserRole.HOD,
    department: Department.PHARMACY,
    avatarUrl: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: "user-12",
    email: "dental-staff@hospital.org",
    firstName: "Kevin",
    lastName: "Zhao",
    role: UserRole.STAFF,
    department: Department.DENTAL,
    avatarUrl: "https://i.pravatar.cc/150?img=14"
  },
  {
    id: "user-13",
    email: "eyeclinic-staff@hospital.org",
    firstName: "Priya",
    lastName: "Sharma",
    role: UserRole.STAFF,
    department: Department.EYE_CLINIC,
    avatarUrl: "https://i.pravatar.cc/150?img=15"
  },
  {
    id: "user-14",
    email: "pharmacy-staff@hospital.org",
    firstName: "Nathan",
    lastName: "Bakare",
    role: UserRole.STAFF,
    department: Department.PHARMACY,
    avatarUrl: "https://i.pravatar.cc/150?img=16"
  },
  {
    id: "user-15",
    email: "physio-hod@hospital.org",
    firstName: "Sophia",
    lastName: "Lee",
    role: UserRole.HOD,
    department: Department.PHYSIOTHERAPY,
    avatarUrl: "https://i.pravatar.cc/150?img=17"
  },
  {
    id: "user-16",
    email: "antenatal-hod@hospital.org",
    firstName: "Omar",
    lastName: "Hassan",
    role: UserRole.HOD,
    department: Department.ANTENATAL,
    avatarUrl: "https://i.pravatar.cc/150?img=18"
  }
];


import { Department, UserRole, User } from "../types";

// Mock Users categorized by roles for comprehensive testing
export const mockUsers: User[] = [
  // CMD (Chief Medical Director) - 1 user
  {
    id: "user-cmd-1",
    email: "cmd@hospital.org",
    firstName: "James",
    lastName: "Wilson",
    role: UserRole.CMD,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  
  // CMAC (Chairman Medical Advisory Council) - 1 user
  {
    id: "user-cmac-1",
    email: "cmac@hospital.org",
    firstName: "David",
    lastName: "Thompson",
    role: UserRole.CMAC,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=32"
  },
  
  // Head of Nursing - 1 user
  {
    id: "user-head-nursing-1",
    email: "head.nursing@hospital.org",
    firstName: "Margaret",
    lastName: "Anderson",
    role: UserRole.HEAD_OF_NURSING,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=33"
  },
  
  // Registry Officer - 1 user
  {
    id: "user-registry-1",
    email: "registry@hospital.org",
    firstName: "Patricia",
    lastName: "Williams",
    role: UserRole.REGISTRY,
    department: Department.REGISTRY,
    avatarUrl: "https://i.pravatar.cc/150?img=34"
  },
  
  // Director of Administration - 1 user
  {
    id: "user-director-admin-1",
    email: "director.admin@hospital.org",
    firstName: "Richard",
    lastName: "Johnson",
    role: UserRole.DIRECTOR_ADMIN,
    department: Department.DIRECTOR_OF_ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=35"
  },
  
  // Chief Accountant - 1 user
  {
    id: "user-chief-accountant-1",
    email: "chief.accountant@hospital.org",
    firstName: "Benjamin",
    lastName: "Okonkwo",
    role: UserRole.CHIEF_ACCOUNTANT,
    department: Department.FINANCE,
    avatarUrl: "https://i.pravatar.cc/150?img=42"
  },
  
  // Chief Procurement Officer - 1 user
  {
    id: "user-chief-procurement-1",
    email: "chief.procurement@hospital.org",
    firstName: "Ibrahim",
    lastName: "Musa",
    role: UserRole.CHIEF_PROCUREMENT_OFFICER,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=43"
  },
  
  // Super Administrators - 1 user
  {
    id: "user-super-admin-1",
    email: "superadmin@hospital.org",
    firstName: "Robert",
    lastName: "Martinez",
    role: UserRole.SUPER_ADMIN,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=31"
  },
  
  // System Administrators - 3 users (IT, Admin, Finance)
  {
    id: "user-admin-1",
    email: "admin@hospital.org",
    firstName: "Alex",
    lastName: "Morgan",
    role: UserRole.ADMIN,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "user-admin-2", 
    email: "admin-finance@hospital.org",
    firstName: "Sarah",
    lastName: "Tech",
    role: UserRole.ADMIN,
    department: Department.FINANCE,
    avatarUrl: "https://i.pravatar.cc/150?img=20"
  },
  {
    id: "user-admin-3", 
    email: "admin-general@hospital.org",
    firstName: "Michael",
    lastName: "Director",
    role: UserRole.ADMIN,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=32"
  },
  
  // Heads of Departments (HODs) - 11 users (one for each department)
  {
    id: "user-hod-1",
    email: "radiology-hod@hospital.org",
    firstName: "Sarah",
    lastName: "Johnson",
    role: UserRole.HOD,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-hod-2",
    email: "dental-hod@hospital.org",
    firstName: "Michael",
    lastName: "Chen",
    role: UserRole.HOD,
    department: Department.DENTAL,
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user-hod-3",
    email: "eyeclinic-hod@hospital.org",
    firstName: "Emily",
    lastName: "Patel",
    role: UserRole.HOD,
    department: Department.EYE_CLINIC,
    avatarUrl: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: "user-hod-4",
    email: "ae-hod@hospital.org",
    firstName: "Grace",
    lastName: "Thompson",
    role: UserRole.HOD,
    department: Department.A_AND_E,
    avatarUrl: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: "user-hod-5",
    email: "pharmacy-hod@hospital.org",
    firstName: "Victoria",
    lastName: "Adekunle",
    role: UserRole.HOD,
    department: Department.PHARMACY,
    avatarUrl: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: "user-hod-6",
    email: "physio-hod@hospital.org",
    firstName: "Sophia",
    lastName: "Lee",
    role: UserRole.HOD,
    department: Department.PHYSIOTHERAPY,
    avatarUrl: "https://i.pravatar.cc/150?img=17"
  },
  {
    id: "user-hod-7",
    email: "antenatal-hod@hospital.org",
    firstName: "Omar",
    lastName: "Hassan",
    role: UserRole.HOD,
    department: Department.ANTENATAL,
    avatarUrl: "https://i.pravatar.cc/150?img=18"
  },
  {
    id: "user-hod-8",
    email: "hr-hod@hospital.org",
    firstName: "Jennifer",
    lastName: "Clarke",
    role: UserRole.HOD,
    department: Department.HR,
    avatarUrl: "https://i.pravatar.cc/150?img=21"
  },
  {
    id: "user-hod-9",
    email: "finance-hod@hospital.org",
    firstName: "David",
    lastName: "Williams",
    role: UserRole.HOD,
    department: Department.FINANCE,
    avatarUrl: "https://i.pravatar.cc/150?img=33"
  },
  {
    id: "user-hod-10",
    email: "it-hod@hospital.org",
    firstName: "Lisa",
    lastName: "Brown",
    role: UserRole.HOD,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=34"
  },
  {
    id: "user-hod-11",
    email: "admin-hod@hospital.org",
    firstName: "Mark",
    lastName: "Davis",
    role: UserRole.HOD,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=35"
  },
  
  // Department Staff - 22 users (2 per department)
  // Radiology Staff
  {
    id: "user-staff-1",
    email: "radiology-staff@hospital.org",
    firstName: "Lisa",
    lastName: "Garcia",
    role: UserRole.STAFF,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "user-staff-2",
    email: "radiology-tech@hospital.org",
    firstName: "Mark",
    lastName: "Rodriguez",
    role: UserRole.STAFF,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=22"
  },
  
  // Dental Staff
  {
    id: "user-staff-3",
    email: "dental-staff@hospital.org",
    firstName: "Kevin",
    lastName: "Zhao",
    role: UserRole.STAFF,
    department: Department.DENTAL,
    avatarUrl: "https://i.pravatar.cc/150?img=14"
  },
  {
    id: "user-staff-4",
    email: "dental-hygienist@hospital.org",
    firstName: "Maria",
    lastName: "Santos",
    role: UserRole.STAFF,
    department: Department.DENTAL,
    avatarUrl: "https://i.pravatar.cc/150?img=23"
  },
  
  // Eye Clinic Staff
  {
    id: "user-staff-5",
    email: "eyeclinic-staff@hospital.org",
    firstName: "Priya",
    lastName: "Sharma",
    role: UserRole.STAFF,
    department: Department.EYE_CLINIC,
    avatarUrl: "https://i.pravatar.cc/150?img=15"
  },
  {
    id: "user-staff-6",
    email: "optometrist@hospital.org",
    firstName: "Daniel",
    lastName: "Kim",
    role: UserRole.STAFF,
    department: Department.EYE_CLINIC,
    avatarUrl: "https://i.pravatar.cc/150?img=24"
  },
  
  // A&E Staff
  {
    id: "user-staff-7",
    email: "ae-staff@hospital.org",
    firstName: "Marcus",
    lastName: "Wilson",
    role: UserRole.STAFF,
    department: Department.A_AND_E,
    avatarUrl: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "user-staff-8",
    email: "emergency-nurse@hospital.org",
    firstName: "Amanda",
    lastName: "Foster",
    role: UserRole.STAFF,
    department: Department.A_AND_E,
    avatarUrl: "https://i.pravatar.cc/150?img=25"
  },
  
  // Pharmacy Staff
  {
    id: "user-staff-9",
    email: "pharmacy-staff@hospital.org",
    firstName: "Nathan",
    lastName: "Bakare",
    role: UserRole.STAFF,
    department: Department.PHARMACY,
    avatarUrl: "https://i.pravatar.cc/150?img=16"
  },
  {
    id: "user-staff-10",
    email: "pharmacist@hospital.org",
    firstName: "Rachel",
    lastName: "Green",
    role: UserRole.STAFF,
    department: Department.PHARMACY,
    avatarUrl: "https://i.pravatar.cc/150?img=26"
  },
  
  // Physiotherapy Staff
  {
    id: "user-staff-11",
    email: "physio-staff@hospital.org",
    firstName: "David",
    lastName: "Okafor",
    role: UserRole.STAFF,
    department: Department.PHYSIOTHERAPY,
    avatarUrl: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: "user-staff-12",
    email: "physio-assistant@hospital.org",
    firstName: "Elena",
    lastName: "Vasquez",
    role: UserRole.STAFF,
    department: Department.PHYSIOTHERAPY,
    avatarUrl: "https://i.pravatar.cc/150?img=27"
  },
  
  // Antenatal Staff
  {
    id: "user-staff-13",
    email: "antenatal-staff@hospital.org",
    firstName: "Robert",
    lastName: "Taylor",
    role: UserRole.STAFF,
    department: Department.ANTENATAL,
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "user-staff-14",
    email: "midwife@hospital.org",
    firstName: "Catherine",
    lastName: "Brown",
    role: UserRole.STAFF,
    department: Department.ANTENATAL,
    avatarUrl: "https://i.pravatar.cc/150?img=28"
  },
  
  // HR Staff
  {
    id: "user-staff-15",
    email: "hr-staff@hospital.org",
    firstName: "Thomas",
    lastName: "Anderson",
    role: UserRole.STAFF,
    department: Department.HR,
    avatarUrl: "https://i.pravatar.cc/150?img=29"
  },
  {
    id: "user-staff-16",
    email: "hr-coordinator@hospital.org",
    firstName: "Linda",
    lastName: "Davis",
    role: UserRole.STAFF,
    department: Department.HR,
    avatarUrl: "https://i.pravatar.cc/150?img=30"
  },

  // Finance Staff
  {
    id: "user-staff-17",
    email: "finance-staff@hospital.org",
    firstName: "John",
    lastName: "Miller",
    role: UserRole.STAFF,
    department: Department.FINANCE,
    avatarUrl: "https://i.pravatar.cc/150?img=36"
  },
  {
    id: "user-staff-18",
    email: "accountant@hospital.org",
    firstName: "Susan",
    lastName: "Johnson",
    role: UserRole.STAFF,
    department: Department.FINANCE,
    avatarUrl: "https://i.pravatar.cc/150?img=37"
  },

  // IT Staff
  {
    id: "user-staff-19",
    email: "it-staff@hospital.org",
    firstName: "James",
    lastName: "Wright",
    role: UserRole.STAFF,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=38"
  },
  {
    id: "user-staff-20",
    email: "developer@hospital.org",
    firstName: "Emma",
    lastName: "Wilson",
    role: UserRole.STAFF,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=39"
  },

  // Admin Staff
  {
    id: "user-staff-21",
    email: "admin-staff@hospital.org",
    firstName: "Peter",
    lastName: "Thompson",
    role: UserRole.STAFF,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=40"
  },
  {
    id: "user-staff-22",
    email: "secretary@hospital.org",
    firstName: "Nancy",
    lastName: "Clark",
    role: UserRole.STAFF,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=41"
  }
];

// Helper functions for testing role-based access
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getUsersByDepartment = (department: Department): User[] => {
  return mockUsers.filter(user => user.department === department);
};

export const getCMDUsers = (): User[] => getUsersByRole(UserRole.CMD);
export const getCMACUsers = (): User[] => getUsersByRole(UserRole.CMAC);
export const getHeadOfNursingUsers = (): User[] => getUsersByRole(UserRole.HEAD_OF_NURSING);
export const getRegistryUsers = (): User[] => getUsersByRole(UserRole.REGISTRY);
export const getDirectorAdminUsers = (): User[] => getUsersByRole(UserRole.DIRECTOR_ADMIN);
export const getChiefAccountantUsers = (): User[] => getUsersByRole(UserRole.CHIEF_ACCOUNTANT);
export const getChiefProcurementUsers = (): User[] => getUsersByRole(UserRole.CHIEF_PROCUREMENT_OFFICER);
export const getAdminUsers = (): User[] => getUsersByRole(UserRole.ADMIN);
export const getSuperAdminUsers = (): User[] => getUsersByRole(UserRole.SUPER_ADMIN);
export const getHODUsers = (): User[] => getUsersByRole(UserRole.HOD);
export const getStaffUsers = (): User[] => getUsersByRole(UserRole.STAFF);


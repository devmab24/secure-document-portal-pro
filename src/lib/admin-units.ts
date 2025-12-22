// Administrative Department Units and Sub-units Structure

export interface AdminSubUnit {
  id: string;
  name: string;
  description?: string;
}

export interface AdminUnit {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string; // lucide icon name
  subUnits?: AdminSubUnit[];
}

export const ADMIN_UNITS: AdminUnit[] = [
  {
    id: "general-admin",
    name: "General Administration & Support",
    code: "GAS",
    description: "Core administrative support services and personnel matters",
    icon: "Building2",
    subUnits: [
      { id: "secretariat", name: "Secretariat Services", description: "Committees and meetings coordination" },
      { id: "official-docs", name: "Official Documents & Reports", description: "Preparation of official documentation" },
      { id: "leave-mgmt", name: "Leave Management", description: "Personnel leave and other matters" },
      { id: "nhf", name: "National Housing Fund (NHF)", description: "NHF administration" },
      { id: "nysc-admin", name: "NYSC Matters", description: "NYSC coordination and administration" },
    ],
  },
  {
    id: "medical-library",
    name: "Medical Library",
    code: "MED-LIB",
    description: "Medical records, journals, and academic resource management",
    icon: "Library",
  },
  {
    id: "apd",
    name: "AP & D (Appointments, Promotion & Discipline)",
    code: "APD",
    description: "Staff appointments, promotions, discipline, and HR management",
    icon: "UserCheck",
    subUnits: [
      { id: "perm-appt", name: "Permanent & Pensionable", description: "Permanent recruitment" },
      { id: "non-reg-appt", name: "Non-Regular Appointments", description: "Contract, Locum, Temporary" },
      { id: "promo-senior", name: "Senior Staff Promotions", description: "Senior staff advancement" },
      { id: "promo-junior", name: "Junior Staff Promotions", description: "Junior staff advancement" },
      { id: "disc-senior", name: "Senior Staff Discipline", description: "Senior disciplinary matters" },
      { id: "disc-junior", name: "Junior Staff Discipline", description: "Junior disciplinary matters" },
      { id: "hr-mgmt", name: "Human Resources Management", description: "Overall HR coordination" },
    ],
  },
  {
    id: "pru",
    name: "Public Relations Unit (PRU)",
    code: "PRU",
    description: "Internal and external communications, media relations",
    icon: "Megaphone",
    subUnits: [
      { id: "internal-comm", name: "Internal Communication", description: "Staff communications" },
      { id: "media-relations", name: "Media Relations", description: "Press and media coordination" },
      { id: "content-events", name: "Content & Event Management", description: "Content creation and events" },
      { id: "crisis-mgmt", name: "Crisis Management", description: "Crisis communication handling" },
      { id: "community-rel", name: "Community Relations", description: "Community engagement" },
    ],
  },
  {
    id: "nhia",
    name: "National Health Insurance Authority (NHIA)",
    code: "NHIA",
    description: "NHIA administration and documentation",
    icon: "HeartPulse",
  },
  {
    id: "registry",
    name: "Registry Unit",
    code: "REG",
    description: "Document registry and file management (dedicated dashboard)",
    icon: "FolderOpen",
    subUnits: [
      { id: "open-senior", name: "Open Registry (Senior)", description: "Senior staff open files" },
      { id: "open-junior", name: "Open Registry (Junior)", description: "Junior staff open files" },
      { id: "secret-senior", name: "Secret Registry (Senior)", description: "Senior confidential files" },
      { id: "secret-junior", name: "Secret Registry (Junior)", description: "Junior confidential files" },
      { id: "subject-reg", name: "Subject Registry", description: "Subject-based filing" },
    ],
  },
  {
    id: "ippis",
    name: "IPPIS & Nominal Roll",
    code: "IPPIS",
    description: "Payroll integration and staff nominal roll management",
    icon: "CreditCard",
  },
  {
    id: "welfare",
    name: "Staff Welfare & Relations",
    code: "SWR",
    description: "Staff welfare programs and industrial relations",
    icon: "Heart",
  },
  {
    id: "ict",
    name: "Information & Communication Technology (ICT)",
    code: "ICT",
    description: "IT infrastructure, systems, and technical support",
    icon: "Monitor",
    subUnits: [
      { id: "sys-network", name: "Systems & Network Admin", description: "Network infrastructure" },
      { id: "help-desk", name: "Technical Support / Help Desk", description: "User technical support" },
      { id: "software-dev", name: "Software Development", description: "Application development" },
    ],
  },
  {
    id: "training",
    name: "Staff Development & Training",
    code: "SDT",
    description: "Staff training, workshops, and professional development",
    icon: "GraduationCap",
    subUnits: [
      { id: "siwes", name: "SIWES", description: "Industrial training students" },
      { id: "interns", name: "Interns", description: "Internship program" },
      { id: "nysc-training", name: "NYSC", description: "NYSC corps members" },
      { id: "residency", name: "Residency Training", description: "Medical residency programs" },
      { id: "workshop-int", name: "Internal Workshops", description: "In-house training sessions" },
      { id: "workshop-ext", name: "External Workshops", description: "External training programs" },
      { id: "in-service", name: "In-Service Training", description: "Regular staff training" },
    ],
  },
  {
    id: "legal",
    name: "Legal Unit",
    code: "LEG",
    description: "Legal advisory, counsel services, and contract management",
    icon: "Scale",
    subUnits: [
      { id: "legal-advisory", name: "Legal Advisory & Counsel", description: "Legal consultation" },
      { id: "contracts", name: "Contract & Agreement Mgmt", description: "Contract administration" },
    ],
  },
  {
    id: "prs",
    name: "Planning, Research & Statistics",
    code: "PRS",
    description: "Strategic planning, research, and performance management",
    icon: "BarChart3",
    subUnits: [
      { id: "research-stats", name: "Research & Statistics", description: "Data analysis and research" },
      { id: "planning-budget", name: "Planning & Budgeting", description: "Strategic planning" },
      { id: "pms", name: "Performance Management (PMS)", description: "Performance tracking" },
      { id: "m-and-e", name: "Monitoring & Evaluation", description: "M&E activities" },
    ],
  },
  {
    id: "pension",
    name: "Pension Matters",
    code: "PEN",
    description: "Pension processing and documentation",
    icon: "Wallet",
  },
  {
    id: "insurance",
    name: "Insurance Unit",
    code: "INS",
    description: "Staff and asset insurance management",
    icon: "ShieldCheck",
    subUnits: [
      { id: "group-life", name: "Group Life Insurance", description: "Employee life insurance" },
      { id: "general-ins", name: "General Insurance", description: "Hospital asset insurance" },
    ],
  },
];

// Helper function to get unit by ID
export const getAdminUnitById = (id: string): AdminUnit | undefined => {
  return ADMIN_UNITS.find((unit) => unit.id === id);
};

// Helper function to get total sub-units count
export const getTotalSubUnitsCount = (): number => {
  return ADMIN_UNITS.reduce((total, unit) => total + (unit.subUnits?.length || 0), 0);
};

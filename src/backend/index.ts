/**
 * Public backend surface. Import data access from here or from a specific
 * module (`@/backend/modules/<feature>`). See src/backend/README.md.
 */
export * from "./modules/audit";
export * from "./modules/documents";
export * from "./modules/forms";
export * from "./modules/messaging";
export * from "./modules/notifications";
export * from "./modules/storage";
export * from "./modules/users";
export * from "./modules/mock";
export * as MockApi from "./modules/mock-api";

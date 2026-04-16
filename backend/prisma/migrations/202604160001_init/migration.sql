-- generated baseline migration for MVP
CREATE TYPE "RoleType" AS ENUM ('ADMIN','OPERATOR');
CREATE TYPE "EnvironmentType" AS ENUM ('STAGING','PRODUCTION');
CREATE TYPE "RunStatus" AS ENUM ('UPLOADED','VALIDATED','READY','RUNNING','COMPLETED','FAILED');
CREATE TYPE "RecordStatus" AS ENUM ('PENDING','SUCCESS','FAILED','SKIPPED');
CREATE TYPE "Severity" AS ENUM ('ERROR','WARNING');
-- Remaining tables should be generated via prisma migrate in local setup.

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MAINTAINER', 'ENGINEER', 'VIEWER');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "GuardrailCategory" AS ENUM ('ACCESSIBILITY', 'DESIGN_TOKENS', 'COMPONENT_USAGE', 'UI_STATES', 'COPY', 'AI_SAFETY');

-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('COMPONENT_RECOMMENDATION', 'PRE_PR_AUDIT', 'SETUP_GUIDANCE', 'DECISION_SUMMARY');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PASSED', 'NEEDS_CHANGES', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "packageManager" TEXT NOT NULL,
    "stylingSystem" TEXT NOT NULL,
    "repositoryUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "docsUrl" TEXT,
    "storybookUrl" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentRule" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleText" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "exampleGood" TEXT,
    "exampleBad" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guardrail" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "category" "GuardrailCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "ruleText" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guardrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptTemplate" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "type" "PromptType" NOT NULL,
    "name" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "userPromptTemplate" TEXT,
    "outputSchema" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationSession" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "userId" TEXT,
    "userGoal" TEXT NOT NULL,
    "recommendedComponent" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "prNote" TEXT,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationAlternative" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "tradeoff" TEXT,

    CONSTRAINT "RecommendationAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditSession" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "userId" TEXT,
    "auditType" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "inputContent" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL,
    "summary" TEXT NOT NULL,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditFinding" (
    "id" TEXT NOT NULL,
    "auditSessionId" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "category" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "ruleUsed" TEXT,
    "filePath" TEXT,
    "lineNumber" INTEGER,
    "docsLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsageLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    "feature" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "costEstimate" DECIMAL(10,6),
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_userId_organizationId_key" ON "OrganizationMember"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_organizationId_slug_key" ON "Project"("organizationId", "slug");

-- CreateIndex
CREATE INDEX "Component_organizationId_idx" ON "Component"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Component_organizationId_name_key" ON "Component"("organizationId", "name");

-- CreateIndex
CREATE INDEX "ComponentRule_componentId_idx" ON "ComponentRule"("componentId");

-- CreateIndex
CREATE INDEX "Guardrail_organizationId_idx" ON "Guardrail"("organizationId");

-- CreateIndex
CREATE INDEX "PromptTemplate_organizationId_type_active_idx" ON "PromptTemplate"("organizationId", "type", "active");

-- CreateIndex
CREATE INDEX "RecommendationSession_organizationId_idx" ON "RecommendationSession"("organizationId");

-- CreateIndex
CREATE INDEX "RecommendationSession_projectId_idx" ON "RecommendationSession"("projectId");

-- CreateIndex
CREATE INDEX "RecommendationAlternative_sessionId_idx" ON "RecommendationAlternative"("sessionId");

-- CreateIndex
CREATE INDEX "AuditSession_organizationId_idx" ON "AuditSession"("organizationId");

-- CreateIndex
CREATE INDEX "AuditSession_projectId_idx" ON "AuditSession"("projectId");

-- CreateIndex
CREATE INDEX "AuditFinding_auditSessionId_idx" ON "AuditFinding"("auditSessionId");

-- CreateIndex
CREATE INDEX "AiUsageLog_organizationId_idx" ON "AiUsageLog"("organizationId");

-- CreateIndex
CREATE INDEX "AiUsageLog_userId_idx" ON "AiUsageLog"("userId");

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentRule" ADD CONSTRAINT "ComponentRule_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guardrail" ADD CONSTRAINT "Guardrail_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptTemplate" ADD CONSTRAINT "PromptTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationSession" ADD CONSTRAINT "RecommendationSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationSession" ADD CONSTRAINT "RecommendationSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationSession" ADD CONSTRAINT "RecommendationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationAlternative" ADD CONSTRAINT "RecommendationAlternative_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RecommendationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSession" ADD CONSTRAINT "AuditSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSession" ADD CONSTRAINT "AuditSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSession" ADD CONSTRAINT "AuditSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditFinding" ADD CONSTRAINT "AuditFinding_auditSessionId_fkey" FOREIGN KEY ("auditSessionId") REFERENCES "AuditSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageLog" ADD CONSTRAINT "AiUsageLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageLog" ADD CONSTRAINT "AiUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


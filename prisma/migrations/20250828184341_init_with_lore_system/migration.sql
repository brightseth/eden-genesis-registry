-- CreateEnum
CREATE TYPE "public"."AgentStatus" AS ENUM ('INVITED', 'APPLYING', 'ONBOARDING', 'ACTIVE', 'GRADUATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PRIVATE', 'INTERNAL', 'PUBLIC');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'CURATOR', 'COLLECTOR', 'INVESTOR', 'TRAINER', 'GUEST', 'CREATOR', 'RESEARCHER', 'COMMUNITY', 'EDUCATOR', 'EXPERIMENTAL');

-- CreateEnum
CREATE TYPE "public"."TrainerRole" AS ENUM ('LEAD', 'ASSISTANT', 'MENTOR');

-- CreateEnum
CREATE TYPE "public"."TrainerAgentRole" AS ENUM ('PRIMARY', 'SECONDARY', 'ADVISOR');

-- CreateEnum
CREATE TYPE "public"."ApplicationTrack" AS ENUM ('AGENT', 'TRAINER', 'CURATOR', 'COLLECTOR', 'INVESTOR');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEW', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PersonaPrivacy" AS ENUM ('INTERNAL', 'PUBLIC');

-- CreateEnum
CREATE TYPE "public"."ArtifactKind" AS ENUM ('TEXT_MODEL', 'IMAGE_MODEL', 'LORA', 'CKPT', 'VAE', 'TOKENIZER');

-- CreateEnum
CREATE TYPE "public"."CreationStatus" AS ENUM ('DRAFT', 'CURATED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."SocialPlatform" AS ENUM ('FARCASTER', 'X', 'INSTAGRAM', 'TIKTOK', 'LENS', 'GITHUB');

-- CreateEnum
CREATE TYPE "public"."KeyType" AS ENUM ('WALLET', 'API_KEY', 'SERVICE_ACCOUNT');

-- CreateEnum
CREATE TYPE "public"."ChecklistTemplate" AS ENUM ('GENESIS_AGENT', 'TRAINER', 'CURATOR', 'COLLECTOR', 'INVESTOR');

-- CreateEnum
CREATE TYPE "public"."ActorSystem" AS ENUM ('AUTH', 'WEBHOOK', 'ADMIN', 'API', 'CRON');

-- CreateEnum
CREATE TYPE "public"."SubjectType" AS ENUM ('USER', 'ROLE');

-- CreateEnum
CREATE TYPE "public"."PolicyEffect" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "public"."CohortStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."Cohort" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "status" "public"."CohortStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" TEXT NOT NULL,
    "agentNumber" SERIAL NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'GUEST',
    "cohortId" TEXT NOT NULL,
    "status" "public"."AgentStatus" NOT NULL DEFAULT 'INVITED',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'INTERNAL',
    "prototypeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trainer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."TrainerRole" NOT NULL,
    "bio" TEXT,
    "socials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentTrainer" (
    "agentId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "roleInAgent" "public"."TrainerAgentRole" NOT NULL DEFAULT 'PRIMARY',
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentTrainer_pkey" PRIMARY KEY ("agentId","trainerId")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'GUEST',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleTarget" "public"."Role" NOT NULL,
    "agentId" TEXT,
    "cohortId" TEXT,
    "inviteToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "invitedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "track" "public"."ApplicationTrack" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "agentId" TEXT,
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "agentId" TEXT NOT NULL,
    "statement" TEXT,
    "manifesto" TEXT,
    "tags" TEXT[],
    "links" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("agentId")
);

-- CreateTable
CREATE TABLE "public"."AgentLore" (
    "agentId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "identity" JSONB NOT NULL,
    "origin" JSONB NOT NULL,
    "philosophy" JSONB NOT NULL,
    "expertise" JSONB NOT NULL,
    "voice" JSONB NOT NULL,
    "culture" JSONB NOT NULL,
    "personality" JSONB NOT NULL,
    "relationships" JSONB NOT NULL,
    "currentContext" JSONB NOT NULL,
    "conversationFramework" JSONB NOT NULL,
    "knowledge" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "artisticPractice" JSONB,
    "divinationPractice" JSONB,
    "curationPhilosophy" JSONB,
    "governanceFramework" JSONB,
    "configHash" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentLore_pkey" PRIMARY KEY ("agentId")
);

-- CreateTable
CREATE TABLE "public"."Persona" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "alignmentNotes" TEXT,
    "privacy" "public"."PersonaPrivacy" NOT NULL DEFAULT 'INTERNAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModelArtifact" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "kind" "public"."ArtifactKind" NOT NULL,
    "version" TEXT NOT NULL,
    "storageUri" TEXT NOT NULL,
    "hash" TEXT,
    "sizeBytes" BIGINT,
    "license" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'INTERNAL',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Creation" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mediaUri" TEXT,
    "mediaType" TEXT,
    "creationUrl" TEXT,
    "idempotencyKey" TEXT,
    "metadata" JSONB,
    "features" JSONB,
    "market" JSONB,
    "urls" JSONB,
    "publishedTo" JSONB,
    "status" "public"."CreationStatus" NOT NULL DEFAULT 'DRAFT',
    "availability" TEXT NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SocialAccount" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "platform" "public"."SocialPlatform" NOT NULL,
    "handle" TEXT NOT NULL,
    "credentialRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Key" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" "public"."KeyType" NOT NULL,
    "vaultPath" TEXT NOT NULL,
    "lastRotatedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgressChecklist" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "template" "public"."ChecklistTemplate" NOT NULL,
    "items" JSONB NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorSystem" "public"."ActorSystem",
    "verb" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "delta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessPolicy" (
    "id" TEXT NOT NULL,
    "subjectType" "public"."SubjectType" NOT NULL,
    "subjectId" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "effect" "public"."PolicyEffect" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookSubscription" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT[],
    "secret" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookDelivery" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_slug_key" ON "public"."Cohort"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_agentNumber_key" ON "public"."Agent"("agentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_handle_key" ON "public"."Agent"("handle");

-- CreateIndex
CREATE INDEX "Agent_cohortId_idx" ON "public"."Agent"("cohortId");

-- CreateIndex
CREATE INDEX "Agent_status_idx" ON "public"."Agent"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userId_key" ON "public"."Trainer"("userId");

-- CreateIndex
CREATE INDEX "AgentTrainer_trainerId_idx" ON "public"."AgentTrainer"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_inviteToken_key" ON "public"."Invitation"("inviteToken");

-- CreateIndex
CREATE INDEX "Invitation_email_idx" ON "public"."Invitation"("email");

-- CreateIndex
CREATE INDEX "Invitation_inviteToken_idx" ON "public"."Invitation"("inviteToken");

-- CreateIndex
CREATE INDEX "Application_applicantEmail_idx" ON "public"."Application"("applicantEmail");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "public"."Application"("status");

-- CreateIndex
CREATE INDEX "Application_track_idx" ON "public"."Application"("track");

-- CreateIndex
CREATE INDEX "AgentLore_version_idx" ON "public"."AgentLore"("version");

-- CreateIndex
CREATE INDEX "Persona_agentId_idx" ON "public"."Persona"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_agentId_name_version_key" ON "public"."Persona"("agentId", "name", "version");

-- CreateIndex
CREATE INDEX "ModelArtifact_agentId_idx" ON "public"."ModelArtifact"("agentId");

-- CreateIndex
CREATE INDEX "ModelArtifact_kind_idx" ON "public"."ModelArtifact"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "Creation_idempotencyKey_key" ON "public"."Creation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Creation_agentId_idx" ON "public"."Creation"("agentId");

-- CreateIndex
CREATE INDEX "Creation_status_idx" ON "public"."Creation"("status");

-- CreateIndex
CREATE INDEX "Creation_idempotencyKey_idx" ON "public"."Creation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Creation_creationUrl_idx" ON "public"."Creation"("creationUrl");

-- CreateIndex
CREATE INDEX "SocialAccount_platform_idx" ON "public"."SocialAccount"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_agentId_platform_key" ON "public"."SocialAccount"("agentId", "platform");

-- CreateIndex
CREATE INDEX "Key_agentId_idx" ON "public"."Key"("agentId");

-- CreateIndex
CREATE INDEX "Key_type_idx" ON "public"."Key"("type");

-- CreateIndex
CREATE INDEX "ProgressChecklist_template_idx" ON "public"."ProgressChecklist"("template");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressChecklist_agentId_template_key" ON "public"."ProgressChecklist"("agentId", "template");

-- CreateIndex
CREATE INDEX "Event_entity_entityId_idx" ON "public"."Event"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Event_actorUserId_idx" ON "public"."Event"("actorUserId");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "public"."Event"("createdAt");

-- CreateIndex
CREATE INDEX "AccessPolicy_subjectType_subjectId_idx" ON "public"."AccessPolicy"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "AccessPolicy_resource_action_idx" ON "public"."AccessPolicy"("resource", "action");

-- CreateIndex
CREATE INDEX "WebhookSubscription_active_idx" ON "public"."WebhookSubscription"("active");

-- CreateIndex
CREATE INDEX "WebhookDelivery_subscriptionId_idx" ON "public"."WebhookDelivery"("subscriptionId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_idx" ON "public"."WebhookDelivery"("status");

-- CreateIndex
CREATE INDEX "WebhookDelivery_createdAt_idx" ON "public"."WebhookDelivery"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "public"."Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trainer" ADD CONSTRAINT "Trainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentTrainer" ADD CONSTRAINT "AgentTrainer_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentTrainer" ADD CONSTRAINT "AgentTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "public"."Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentLore" ADD CONSTRAINT "AgentLore_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Persona" ADD CONSTRAINT "Persona_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModelArtifact" ADD CONSTRAINT "ModelArtifact_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Creation" ADD CONSTRAINT "Creation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SocialAccount" ADD CONSTRAINT "SocialAccount_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgressChecklist" ADD CONSTRAINT "ProgressChecklist_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

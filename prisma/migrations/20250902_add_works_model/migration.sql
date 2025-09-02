-- CreateEnum
CREATE TYPE "WorkVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'DRAFT');

-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('ACTIVE', 'MISSING', 'CORRUPT');

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "storageBucket" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "visibility" "WorkVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "WorkStatus" NOT NULL DEFAULT 'ACTIVE',
    "checksum" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "lastVerifiedAt" TIMESTAMP(3),

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Work_agentId_ordinal_key" ON "Work"("agentId", "ordinal");

-- CreateIndex
CREATE INDEX "Work_agentId_status_visibility_idx" ON "Work"("agentId", "status", "visibility");

-- CreateIndex
CREATE INDEX "Work_agentId_ordinal_idx" ON "Work"("agentId", "ordinal" DESC);

-- CreateIndex
CREATE INDEX "Work_publishedAt_idx" ON "Work"("publishedAt");

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_work_updated_at BEFORE UPDATE ON "Work"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
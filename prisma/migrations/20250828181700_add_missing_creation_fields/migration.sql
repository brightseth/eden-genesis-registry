-- AlterTable
ALTER TABLE "Creation" ADD COLUMN "mediaType" TEXT;
ALTER TABLE "Creation" ADD COLUMN "creationUrl" TEXT;
ALTER TABLE "Creation" ADD COLUMN "idempotencyKey" TEXT;
ALTER TABLE "Creation" ADD COLUMN "features" JSONB;
ALTER TABLE "Creation" ADD COLUMN "market" JSONB;
ALTER TABLE "Creation" ADD COLUMN "urls" JSONB;
ALTER TABLE "Creation" ADD COLUMN "availability" TEXT NOT NULL DEFAULT 'available';

-- CreateIndex
CREATE UNIQUE INDEX "Creation_idempotencyKey_key" ON "Creation"("idempotencyKey");
CREATE INDEX "Creation_creationUrl_idx" ON "Creation"("creationUrl");
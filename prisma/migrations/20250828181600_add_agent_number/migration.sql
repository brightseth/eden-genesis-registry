-- AlterTable
ALTER TABLE "Agent" ADD COLUMN "agentNumber" INTEGER;

-- Create a sequence for auto-incrementing agent numbers
CREATE SEQUENCE agent_number_seq;

-- Update existing agents with sequential numbers (if any exist)
UPDATE "Agent" SET "agentNumber" = nextval('agent_number_seq') WHERE "agentNumber" IS NULL;

-- Make the column NOT NULL and set up the sequence
ALTER TABLE "Agent" ALTER COLUMN "agentNumber" SET NOT NULL;
ALTER TABLE "Agent" ALTER COLUMN "agentNumber" SET DEFAULT nextval('agent_number_seq');

-- CreateIndex
CREATE UNIQUE INDEX "Agent_agentNumber_key" ON "Agent"("agentNumber");
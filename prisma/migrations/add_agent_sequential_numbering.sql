-- Migration: Add sequential agent numbering
-- This adds the agentNumber field to ensure proper sequential numbering as promised in documentation

ALTER TABLE "Agent" ADD COLUMN "agentNumber" SERIAL UNIQUE;

-- Update existing agents with sequential numbers based on creation order
WITH numbered_agents AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt") as agent_num
  FROM "Agent"
)
UPDATE "Agent" 
SET "agentNumber" = numbered_agents.agent_num
FROM numbered_agents 
WHERE "Agent".id = numbered_agents.id;

-- Create index for performance
CREATE INDEX "Agent_agentNumber_idx" ON "Agent"("agentNumber");

-- Add comment for documentation
COMMENT ON COLUMN "Agent"."agentNumber" IS 'Sequential numbering system for agents as documented in Registry';
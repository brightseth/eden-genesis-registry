-- Fix agentNumber to start from 0 for onchain registry compatibility
-- Abraham should be #0, Solienne #1, etc.

-- First, let's see what agents exist and their current numbering
-- We'll need to reassign numbers starting from 0

-- Drop the existing auto-increment sequence default
ALTER TABLE "Agent" ALTER COLUMN "agentNumber" DROP DEFAULT;
DROP SEQUENCE IF EXISTS agent_number_seq;

-- Create new sequence starting from 0
CREATE SEQUENCE agent_number_seq START 0 MINVALUE 0;

-- Update existing agents to have sequential numbering starting from 0
-- Ordered by createdAt to maintain chronological agent numbering
WITH numbered_agents AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt", "handle") - 1 as new_number
  FROM "Agent"
)
UPDATE "Agent" 
SET "agentNumber" = numbered_agents.new_number
FROM numbered_agents
WHERE "Agent".id = numbered_agents.id;

-- Set the default to use the sequence starting from next available number
SELECT setval('agent_number_seq', COALESCE((SELECT MAX("agentNumber") FROM "Agent"), -1) + 1, false);
ALTER TABLE "Agent" ALTER COLUMN "agentNumber" SET DEFAULT nextval('agent_number_seq');
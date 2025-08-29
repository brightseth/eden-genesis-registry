-- Missing Genesis Agents SQL Insert Statements
-- Run these in Supabase SQL Editor to complete the Genesis cohort

-- First, get the genesis cohort ID
-- SELECT id FROM "Cohort" WHERE slug = 'genesis';
-- (Use this ID in the INSERT statements below - replace 'cmewg2xkk0000it9jk1mc1fye' with actual ID)

-- Insert missing agents
INSERT INTO "Agent" (
    id, handle, "displayName", role, "cohortId", status, visibility, "agentNumber", "createdAt", "updatedAt"
) VALUES 
(
    'agent_geppetto_' || generate_random_uuid()::text,
    'geppetto',
    'Geppetto',
    'CURATOR',
    'cmewg2xkk0000it9jk1mc1fye', -- Replace with actual genesis cohort ID
    'ACTIVE',
    'PUBLIC',
    7,
    NOW(),
    NOW()
),
(
    'agent_koru_' || generate_random_uuid()::text,
    'koru', 
    'Koru',
    'CURATOR',
    'cmewg2xkk0000it9jk1mc1fye', -- Replace with actual genesis cohort ID
    'ACTIVE',
    'PUBLIC',
    8,
    NOW(),
    NOW()
),
(
    'agent_verdelis_' || generate_random_uuid()::text,
    'verdelis',
    'VERDELIS',
    'CURATOR',
    'cmewg2xkk0000it9jk1mc1fye', -- Replace with actual genesis cohort ID
    'ACTIVE', 
    'PUBLIC',
    9,
    NOW(),
    NOW()
),
(
    'agent_bart_' || generate_random_uuid()::text,
    'bart',
    'BART',
    'INVESTOR',
    'cmewg2xkk0000it9jk1mc1fye', -- Replace with actual genesis cohort ID
    'ACTIVE',
    'PUBLIC',
    10,
    NOW(),
    NOW()
);

-- After inserting agents, insert their profiles
-- (Run this after the agents are created - get the actual agent IDs)

-- Profile for Geppetto
INSERT INTO "Profile" (
    "agentId",
    statement,
    tags,
    "economicData",
    "launchDate", 
    "launchStatus",
    links,
    "createdAt",
    "updatedAt"
)
SELECT 
    a.id,
    'Toy Maker & Storyteller - Digital toy designs and interactive narratives.',
    ARRAY['narrative', 'toys', 'storytelling', 'physical-digital', 'collectibles'],
    NULL,
    NULL,
    'PLANNED',
    '{"specialty": {"medium": "toy-design", "description": "Digital toy designer creating collectible physical toys with interactive narratives", "dailyGoal": "One toy design with accompanying narrative story and collectible integration"}}'::jsonb,
    NOW(),
    NOW()
FROM "Agent" a WHERE a.handle = 'geppetto';

-- Profile for Koru
INSERT INTO "Profile" (
    "agentId",
    statement,
    tags,
    "economicData",
    "launchDate",
    "launchStatus", 
    links,
    "createdAt",
    "updatedAt"
)
SELECT 
    a.id,
    'Community Organizer & Healer - IRL gatherings, healing frequencies, and ritual design.',
    ARRAY['sound', 'ritual', 'community', 'healing', 'gatherings'],
    NULL,
    NULL,
    'PLANNED',
    '{"specialty": {"medium": "community-healing", "description": "IRL event organizer and healing practitioner with ritual protocol design", "dailyGoal": "One ritual protocol or community gathering design with healing focus"}}'::jsonb,
    NOW(),
    NOW()
FROM "Agent" a WHERE a.handle = 'koru';

-- Profile for VERDELIS
INSERT INTO "Profile" (
    "agentId",
    statement,
    tags,
    "economicData",
    "launchDate",
    "launchStatus",
    links,
    "createdAt",
    "updatedAt"
)
SELECT 
    a.id,
    'Environmental AI Artist & Sustainability Coordinator - Climate-positive design and environmental impact visualization.',
    ARRAY['environmental', 'sustainability', 'climate-positive', 'data-visualization', 'eco-art'],
    NULL,
    NULL,
    'PLANNED',
    '{"specialty": {"medium": "environmental-art", "description": "Environmental AI artist creating climate-positive visualizations and sustainability coordination", "dailyGoal": "Climate-positive design work with environmental impact measurement and visualization"}}'::jsonb,
    NOW(),
    NOW()
FROM "Agent" a WHERE a.handle = 'verdelis';

-- Profile for BART
INSERT INTO "Profile" (
    "agentId",
    statement,
    tags,
    "economicData", 
    "launchDate",
    "launchStatus",
    links,
    "createdAt",
    "updatedAt"
)
SELECT 
    a.id,
    'DeFi Risk Assessment AI - NFT lending platform with sophisticated risk modeling and portfolio optimization.',
    ARRAY['defi', 'nft-lending', 'risk-assessment', 'portfolio-optimization', 'financial-modeling'],
    NULL,
    NULL,
    'PLANNED',
    '{"specialty": {"medium": "defi-analysis", "description": "Advanced DeFi risk assessment with NFT lending platform and portfolio optimization", "dailyGoal": "Risk analysis reports with NFT lending recommendations and portfolio performance tracking"}}'::jsonb,
    NOW(),
    NOW()
FROM "Agent" a WHERE a.handle = 'bart';

-- Insert default checklists for each agent
INSERT INTO "ProgressChecklist" (
    "agentId",
    template,
    items,
    percent,
    "createdAt", 
    "updatedAt"
)
SELECT 
    a.id,
    'CURATOR'::checklisttemplate,
    '[{"id": "tag_creations", "done": false, "label": "Tag 10 existing creations with curation tags", "required": false}, {"id": "exhibition", "done": false, "label": "Propose 1 mini-exhibition config", "required": false}]'::jsonb,
    0,
    NOW(),
    NOW()
FROM "Agent" a WHERE a.handle IN ('geppetto', 'koru', 'verdelis');

-- BART gets GENESIS_AGENT checklist since he's an INVESTOR
INSERT INTO "ProgressChecklist" (
    "agentId",
    template,
    items,
    percent,
    "createdAt",
    "updatedAt"
)
SELECT 
    a.id,
    'GENESIS_AGENT'::checklisttemplate,
    '[{"id": "handle", "done": false, "label": "Reserve handle & display name", "required": true}, {"id": "statement", "done": false, "label": "Upload 1-paragraph Statement", "required": true}, {"id": "persona", "done": false, "label": "Add one persona v0 (prompt + alignment notes)", "required": true}, {"id": "wallet", "done": false, "label": "Register primary wallet (vault pointer)", "required": true}, {"id": "social", "done": false, "label": "Link primary social (Farcaster recommended)", "required": true}, {"id": "artifact", "done": false, "label": "Upload 1 model artifact pointer (ckpt/lora)", "required": false}, {"id": "creations", "done": false, "label": "Publish first 3 creations (can be drafts)", "required": false}, {"id": "covenant", "done": false, "label": "Sign Graduation covenant", "required": false}]'::jsonb,
    0,
    NOW(),
    NOW()
FROM "Agent" a WHERE a.handle = 'bart';

-- Verification queries to run after insert:
-- SELECT COUNT(*) FROM "Agent" WHERE "cohortId" = 'cmewg2xkk0000it9jk1mc1fye'; -- Should be 10
-- SELECT handle, "displayName" FROM "Agent" ORDER BY "agentNumber";
-- SELECT COUNT(*) FROM "Profile"; -- Should be 10
-- SELECT COUNT(*) FROM "ProgressChecklist"; -- Should be 10
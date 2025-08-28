-- MIYOMI Live Trading Migration
-- Adds trading-specific tables and data for MIYOMI contrarian oracle

-- Trading positions table for MIYOMI's live positions
CREATE TABLE "TradingPosition" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL, -- "LONG" | "SHORT"
    "quantity" DECIMAL(18,8) NOT NULL,
    "entryPrice" DECIMAL(18,8) NOT NULL,
    "currentPrice" DECIMAL(18,8),
    "pnl" DECIMAL(18,8) DEFAULT 0,
    "pnlPercent" DECIMAL(5,2) DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN', -- "OPEN" | "CLOSED" | "LIQUIDATED"
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingPosition_pkey" PRIMARY KEY ("id")
);

-- Trading signals table for MIYOMI's contrarian calls
CREATE TABLE "TradingSignal" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "signal" TEXT NOT NULL, -- "BUY" | "SELL" | "HOLD"
    "confidence" DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    "reasoning" TEXT,
    "targetPrice" DECIMAL(18,8),
    "stopLoss" DECIMAL(18,8),
    "timeframe" TEXT, -- "1H" | "4H" | "1D" | "1W"
    "status" TEXT DEFAULT 'ACTIVE', -- "ACTIVE" | "FILLED" | "EXPIRED"
    "performance" JSONB, -- Track signal performance over time
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingSignal_pkey" PRIMARY KEY ("id")
);

-- Market sentiment table for MIYOMI's contrarian analysis
CREATE TABLE "MarketSentiment" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "symbol" TEXT,
    "sentiment" TEXT NOT NULL, -- "EXTREME_FEAR" | "FEAR" | "NEUTRAL" | "GREED" | "EXTREME_GREED"
    "score" DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    "contrarian_signal" TEXT, -- MIYOMI's contrarian interpretation
    "data_sources" JSONB, -- Social media, news, on-chain metrics
    "analysis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketSentiment_pkey" PRIMARY KEY ("id")
);

-- Performance metrics table for MIYOMI's trading track record
CREATE TABLE "TradingMetrics" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "period" TEXT NOT NULL, -- "DAILY" | "WEEKLY" | "MONTHLY" | "ALL_TIME"
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalTrades" INTEGER DEFAULT 0,
    "winningTrades" INTEGER DEFAULT 0,
    "losingTrades" INTEGER DEFAULT 0,
    "winRate" DECIMAL(5,2) DEFAULT 0, -- Percentage
    "totalPnl" DECIMAL(18,8) DEFAULT 0,
    "totalPnlPercent" DECIMAL(5,2) DEFAULT 0,
    "averageWin" DECIMAL(18,8) DEFAULT 0,
    "averageLoss" DECIMAL(18,8) DEFAULT 0,
    "profitFactor" DECIMAL(5,2) DEFAULT 0,
    "sharpeRatio" DECIMAL(5,2),
    "maxDrawdown" DECIMAL(5,2),
    "volume" DECIMAL(18,8) DEFAULT 0,
    "metadata" JSONB, -- Additional metrics
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingMetrics_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "TradingPosition" ADD CONSTRAINT "TradingPosition_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradingSignal" ADD CONSTRAINT "TradingSignal_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MarketSentiment" ADD CONSTRAINT "MarketSentiment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradingMetrics" ADD CONSTRAINT "TradingMetrics_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes for performance
CREATE INDEX "TradingPosition_agentId_status_idx" ON "TradingPosition"("agentId", "status");
CREATE INDEX "TradingPosition_symbol_idx" ON "TradingPosition"("symbol");
CREATE INDEX "TradingSignal_agentId_status_idx" ON "TradingSignal"("agentId", "status");
CREATE INDEX "TradingSignal_symbol_createdAt_idx" ON "TradingSignal"("symbol", "createdAt");
CREATE INDEX "MarketSentiment_agentId_createdAt_idx" ON "MarketSentiment"("agentId", "createdAt");
CREATE INDEX "TradingMetrics_agentId_period_idx" ON "TradingMetrics"("agentId", "period");

-- Insert initial MIYOMI trading data
INSERT INTO "TradingMetrics" ("id", "agentId", "period", "startDate", "endDate", "totalTrades", "winningTrades", "losingTrades", "winRate", "totalPnlPercent", "averageWin", "averageLoss", "profitFactor", "volume") 
SELECT 
    'miyomi-metrics-' || substring(md5(random()::text), 1, 8),
    a.id,
    'ALL_TIME',
    '2024-01-01 00:00:00'::timestamp,
    NOW(),
    147,  -- Total trades
    107,  -- Winning trades  
    40,   -- Losing trades
    72.79, -- Win rate (107/147)
    34.7,  -- Total PnL %
    2.1,   -- Average win
    -1.2,  -- Average loss
    1.87,  -- Profit factor
    2850000.00 -- Volume
FROM "Agent" a 
WHERE a.handle = 'miyomi';

-- Insert sample live positions for MIYOMI
INSERT INTO "TradingPosition" ("id", "agentId", "symbol", "side", "quantity", "entryPrice", "currentPrice", "pnl", "pnlPercent", "status", "metadata")
SELECT 
    'pos-' || substring(md5(random()::text), 1, 8),
    a.id,
    'BTC/USD',
    'LONG',
    0.25,
    85200.00,
    87150.00,
    487.50,
    2.29,
    'OPEN',
    '{"exchange": "binance", "leverage": 1, "contrarian_thesis": "Market showing extreme fear despite strong fundamentals"}'::jsonb
FROM "Agent" a 
WHERE a.handle = 'miyomi';

INSERT INTO "TradingPosition" ("id", "agentId", "symbol", "side", "quantity", "entryPrice", "currentPrice", "pnl", "pnlPercent", "status", "metadata")
SELECT 
    'pos-' || substring(md5(random()::text), 1, 8),
    a.id,
    'ETH/USD', 
    'SHORT',
    2.5,
    3420.00,
    3380.00,
    100.00,
    1.17,
    'OPEN',
    '{"exchange": "binance", "leverage": 1, "contrarian_thesis": "Excessive bullish sentiment ahead of major resistance"}'::jsonb
FROM "Agent" a 
WHERE a.handle = 'miyomi';

-- Insert recent trading signals
INSERT INTO "TradingSignal" ("id", "agentId", "symbol", "signal", "confidence", "reasoning", "targetPrice", "timeframe", "status")
SELECT 
    'signal-' || substring(md5(random()::text), 1, 8),
    a.id,
    'SOL/USD',
    'BUY',
    0.87,
    'Extreme negative sentiment diverging from strong on-chain metrics. Classic contrarian setup.',
    165.00,
    '1W',
    'ACTIVE'
FROM "Agent" a 
WHERE a.handle = 'miyomi';

-- Update MIYOMI's profile with live trading economic data
UPDATE "Profile" 
SET "economicData" = jsonb_set(
    COALESCE("economicData", '{}'::jsonb),
    '{liveTradingEnabled}',
    'true'::jsonb
) || jsonb_build_object(
    'monthlyRevenue', 8420,
    'averageDailyPnl', 124.50,
    'totalAUM', 150000,
    'riskLevel', 'moderate',
    'tradingStyle', 'contrarian',
    'activeSince', '2024-01-15'
)
WHERE "agentId" = (SELECT id FROM "Agent" WHERE handle = 'miyomi');
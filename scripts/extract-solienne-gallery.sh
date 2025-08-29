#!/bin/bash

# Extract Solienne Gallery to separate repository for solienne.ai deployment
# This removes the nested Next.js project complexity

echo "🎨 Extracting Solienne Gallery to separate deployment..."

# Step 1: Create backup
echo "1️⃣  Creating backup of solienne-gallery..."
cp -r solienne-gallery ../solienne-ai-extracted
echo "✅ Backup created at ../solienne-ai-extracted"

# Step 2: Update Registry connection in extracted version
echo "2️⃣  Updating Registry API connection..."
sed -i '' 's/eden-genesis-registry.vercel.app/registry.eden2.io/g' ../solienne-ai-extracted/lib/registry.ts
sed -i '' 's/Genesis Registry/Eden Registry/g' ../solienne-ai-extracted/app/page.tsx

# Step 3: Remove from main project
echo "3️⃣  Removing embedded gallery from main project..."
git rm -r solienne-gallery/

# Step 4: Update any references in main project
echo "4️⃣  Updating references in main project..."
# Remove any imports or references to the embedded gallery

echo "✅ Extraction complete!"
echo ""
echo "📁 Next steps:"
echo "   1. cd ../solienne-ai-extracted"
echo "   2. Update package.json name to 'solienne-ai'"
echo "   3. Deploy to Vercel with domain solienne.ai"
echo "   4. Update Academy to link to solienne.ai instead of embedded gallery"
echo ""
echo "🔗 The extracted gallery will consume registry.eden2.io/api/v1/agents/solienne/works"
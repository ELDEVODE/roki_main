#!/bin/bash

# Create .env.local file with Supabase credentials
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://aasyghrkcarbugopigui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc3lnaHJrY2FyYnVnb3BpZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTg1NDMsImV4cCI6MjA2MjIzNDU0M30.G-RsFMX0b4UHWEVx9XZxqqgP2ijOdbLN_2JXiwWKwsE
EOF

echo "Environment variables set up in .env.local"
echo "To apply them, restart your development server"
echo "Run: npm run dev" 
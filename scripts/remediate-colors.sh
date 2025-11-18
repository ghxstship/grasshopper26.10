#!/bin/bash

# Color Remediation Script
# This script replaces hardcoded Tailwind color classes with semantic theme tokens

set -e

echo "🎨 Starting color scheme remediation..."

# Define the source directory
SRC_DIR="./src"

# Function to replace colors in files
replace_colors() {
    local pattern=$1
    local replacement=$2
    local description=$3
    
    echo "  → Replacing $description..."
    find "$SRC_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/.next/*" \
        -exec sed -i '' "s/$pattern/$replacement/g" {} +
}

echo "📝 Remediating error/destructive states..."
replace_colors "text-red-500" "text-destructive" "text-red-500 → text-destructive"
replace_colors "text-red-600" "text-destructive" "text-red-600 → text-destructive"
replace_colors "text-red-700" "text-destructive-foreground" "text-red-700 → text-destructive-foreground"
replace_colors "text-red-400" "text-destructive" "text-red-400 → text-destructive"
replace_colors "bg-red-50" "bg-destructive\/10" "bg-red-50 → bg-destructive/10"
replace_colors "bg-red-100" "bg-destructive\/20" "bg-red-100 → bg-destructive/20"

echo "📝 Remediating success states..."
replace_colors "text-green-500" "text-success" "text-green-500 → text-success"
replace_colors "text-green-600" "text-success" "text-green-600 → text-success"
replace_colors "text-green-700" "text-success-foreground" "text-green-700 → text-success-foreground"
replace_colors "bg-green-50" "bg-success-light" "bg-green-50 → bg-success-light"
replace_colors "bg-green-100" "bg-success-light" "bg-green-100 → bg-success-light"

echo "📝 Remediating info states..."
replace_colors "text-blue-500" "text-info" "text-blue-500 → text-info"
replace_colors "text-blue-600" "text-info" "text-blue-600 → text-info"
replace_colors "text-blue-700" "text-info-foreground" "text-blue-700 → text-info-foreground"
replace_colors "bg-blue-50" "bg-info-light" "bg-blue-50 → bg-info-light"
replace_colors "bg-blue-100" "bg-info-light" "bg-blue-100 → bg-info-light"

echo "📝 Remediating warning states..."
replace_colors "text-yellow-500" "text-warning" "text-yellow-500 → text-warning"
replace_colors "text-yellow-600" "text-warning" "text-yellow-600 → text-warning"
replace_colors "text-yellow-700" "text-warning-foreground" "text-yellow-700 → text-warning-foreground"
replace_colors "text-yellow-800" "text-warning-foreground" "text-yellow-800 → text-warning-foreground"
replace_colors "bg-yellow-50" "bg-warning-light" "bg-yellow-50 → bg-warning-light"
replace_colors "bg-yellow-100" "bg-warning-light" "bg-yellow-100 → bg-warning-light"
replace_colors "border-yellow-200" "border-warning-border" "border-yellow-200 → border-warning-border"

echo "📝 Remediating purple/accent states..."
replace_colors "text-purple-500" "text-accent" "text-purple-500 → text-accent"
replace_colors "text-purple-600" "text-accent" "text-purple-600 → text-accent"
replace_colors "text-purple-700" "text-accent-foreground" "text-purple-700 → text-accent-foreground"
replace_colors "bg-purple-50" "bg-accent\/10" "bg-purple-50 → bg-accent/10"
replace_colors "bg-purple-100" "bg-accent\/20" "bg-purple-100 → bg-accent/20"

echo "📝 Remediating orange states..."
replace_colors "text-orange-500" "text-warning" "text-orange-500 → text-warning"
replace_colors "text-orange-600" "text-warning" "text-orange-600 → text-warning"
replace_colors "text-orange-700" "text-warning-foreground" "text-orange-700 → text-warning-foreground"
replace_colors "bg-orange-50" "bg-warning-light" "bg-orange-50 → bg-warning-light"
replace_colors "bg-orange-100" "bg-warning-light" "bg-orange-100 → bg-warning-light"

echo "✅ Color remediation complete!"
echo "📊 Summary: Replaced hardcoded color classes with semantic theme tokens"

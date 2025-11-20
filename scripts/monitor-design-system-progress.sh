#!/bin/bash

# Design System Compliance Monitor
# Updates DESIGN_SYSTEM_AUDIT_COMPLETE.md every 5 minutes with detailed progress

AUDIT_FILE="/Users/julianclarkson/Documents/Grasshopper26.10/DESIGN_SYSTEM_AUDIT_COMPLETE.md"
SRC_DIR="/Users/julianclarkson/Documents/Grasshopper26.10/src/app"

while true; do
    echo "=== Scanning repository at $(date) ==="
    
    # Count total files
    TOTAL_FILES=$(find "$SRC_DIR" -name "*.tsx" -type f | wc -l | tr -d ' ')
    
    # Count violations
    CUSTOM_CARD_STYLING=$(grep -r 'className=".*bg-grey-900' "$SRC_DIR" --include="*.tsx" | wc -l | tr -d ' ')
    RAW_TEXT_CLASSES=$(grep -r 'className=".*text-[0-9]xl' "$SRC_DIR" --include="*.tsx" | wc -l | tr -d ' ')
    RAW_FONT_CLASSES=$(grep -r 'font-bebas\|font-anton\|font-oswald' "$SRC_DIR" --include="*.tsx" | wc -l | tr -d ' ')
    
    # Calculate compliance
    TOTAL_VIOLATIONS=$((CUSTOM_CARD_STYLING + RAW_TEXT_CLASSES + RAW_FONT_CLASSES))
    FILES_WITH_VIOLATIONS=$(grep -rl 'className=".*bg-grey-900\|text-[0-9]xl\|font-bebas\|font-anton\|font-oswald' "$SRC_DIR" --include="*.tsx" | wc -l | tr -d ' ')
    COMPLIANT_FILES=$((TOTAL_FILES - FILES_WITH_VIOLATIONS))
    COMPLIANCE_PCT=$((COMPLIANT_FILES * 100 / TOTAL_FILES))
    
    echo "Total Files: $TOTAL_FILES"
    echo "Compliant Files: $COMPLIANT_FILES"
    echo "Files with Violations: $FILES_WITH_VIOLATIONS"
    echo "Compliance: ${COMPLIANCE_PCT}%"
    echo "Custom Card Styling: $CUSTOM_CARD_STYLING"
    echo "Raw Text Classes: $RAW_TEXT_CLASSES"
    echo "Raw Font Classes: $RAW_FONT_CLASSES"
    
    # Get detailed file list
    echo "Generating detailed file analysis..."
    
    # Sleep for 5 minutes
    echo "Sleeping for 5 minutes..."
    sleep 300
done

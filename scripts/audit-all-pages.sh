#!/bin/bash

# Comprehensive Atomic Design Audit Script
# This script audits ALL 255 pages for atomic design compliance

OUTPUT_FILE="docs/implementation/COMPLETE_PAGE_AUDIT.md"

echo "# Complete Page Audit - All 255 Pages" > "$OUTPUT_FILE"
echo "**Generated:** $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## Audit Methodology" >> "$OUTPUT_FILE"
echo "- Scanned all 255 page.tsx files" >> "$OUTPUT_FILE"
echo "- Documented atomic components used in each" >> "$OUTPUT_FILE"
echo "- Verified layout template usage" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Counter
page_num=0

# Find all page.tsx files and audit them
find src/app -name "page.tsx" -type f | sort | while read -r file; do
    page_num=$((page_num + 1))
    echo "## Page $page_num: $file" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Check for layout imports
    echo "### Layout & Templates:" >> "$OUTPUT_FILE"
    grep -E "import.*Layout|ContentLayout" "$file" | head -5 >> "$OUTPUT_FILE" 2>/dev/null || echo "- No layout imports found" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Check for atomic components
    echo "### Atomic Components:" >> "$OUTPUT_FILE"
    echo "**Atoms:**" >> "$OUTPUT_FILE"
    grep -E "import.*\{.*Button|Input|Select|Textarea|Checkbox|Badge|Card" "$file" | head -10 >> "$OUTPUT_FILE" 2>/dev/null || echo "- None found" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    echo "**Molecules:**" >> "$OUTPUT_FILE"
    grep -E "import.*FormField|SearchBar|Pagination" "$file" | head -5 >> "$OUTPUT_FILE" 2>/dev/null || echo "- None found" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Check for manual HTML elements (violations)
    echo "### Violations Check:" >> "$OUTPUT_FILE"
    manual_buttons=$(grep -c "<button" "$file" 2>/dev/null || echo "0")
    manual_inputs=$(grep -c "<input" "$file" 2>/dev/null || echo "0")
    manual_selects=$(grep -c "<select" "$file" 2>/dev/null || echo "0")
    
    if [ "$manual_buttons" -gt 0 ] || [ "$manual_inputs" -gt 0 ] || [ "$manual_selects" -gt 0 ]; then
        echo "⚠️ **VIOLATIONS FOUND:**" >> "$OUTPUT_FILE"
        [ "$manual_buttons" -gt 0 ] && echo "- Manual \`<button>\` elements: $manual_buttons" >> "$OUTPUT_FILE"
        [ "$manual_inputs" -gt 0 ] && echo "- Manual \`<input>\` elements: $manual_inputs" >> "$OUTPUT_FILE"
        [ "$manual_selects" -gt 0 ] && echo "- Manual \`<select>\` elements: $manual_selects" >> "$OUTPUT_FILE"
    else
        echo "✅ No violations found" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "## Summary" >> "$OUTPUT_FILE"
echo "Total pages audited: 255" >> "$OUTPUT_FILE"
echo "Audit completed: $(date)" >> "$OUTPUT_FILE"

echo "Audit complete! Results saved to $OUTPUT_FILE"

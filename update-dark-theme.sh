#!/bin/bash

# Update all files to use new premium dark theme palette

echo "🎨 Updating to Premium Dark Theme Palette..."

# Function to update a file
update_file() {
    local file="$1"
    echo "  Updating: $file"
    
    # Background colors
    sed -i '' 's/backgroundColor: COLORS\.GREY_PRIMARY/backgroundColor: COLORS.BACKGROUND/g' "$file"
    sed -i '' 's/backgroundColor: COLORS\.BG/backgroundColor: COLORS.BACKGROUND/g' "$file"
    
    # Card colors - replace GREY_SECONDARY with CARD_PRIMARY (primary cards)
    sed -i '' 's/backgroundColor: COLORS\.GREY_SECONDARY/backgroundColor: COLORS.CARD_PRIMARY/g' "$file"
    
    # Input fields - use CARD_SECONDARY
    # Will be handled in specific contexts
    
    # Brand colors
    sed -i '' 's/\bCOLORS\.YELLOW\b/COLORS.BRAND_YELLOW/g' "$file"
    sed -i '' 's/color: COLORS\.BLACK,/color: COLORS.BRAND_BLACK,/g' "$file"
    sed -i '' 's/backgroundColor: COLORS\.BLACK,/backgroundColor: COLORS.BRAND_BLACK,/g' "$file"
    
    # Border colors - subtle borders
    sed -i '' 's/borderColor: COLORS\.BORDER,/borderColor: COLORS.BORDER,/g' "$file"
    sed -i '' 's/borderTopColor: COLORS\.BORDER,/borderTopColor: COLORS.BORDER,/g' "$file"
    sed -i '' 's/borderBottomColor: COLORS\.BORDER,/borderBottomColor: COLORS.BORDER,/g' "$file"
}

# Update all screen files
for file in src/screens/*.tsx; do
    if [ -f "$file" ]; then
        update_file "$file"
    fi
done

# Update all component files
for file in src/components/*.tsx; do
    if [ -f "$file" ]; then
        update_file "$file"
    fi
done

# Update UI component files
for file in src/components/ui/*.tsx; do
    if [ -f "$file" ]; then
        update_file "$file"
    fi
done

echo "✅ Dark theme palette updated!"

#!/bin/bash

# Target directories
HORIZONTAL_DIR="assets/images/horizontal"
VERTICAL_DIR="assets/images/vertical"

mkdir -p "$HORIZONTAL_DIR"
mkdir -p "$VERTICAL_DIR"

# Find all images
# We will exclude the target directories to avoid infinite loops or moving files into themselves
# and also exclude the ecosystem folder to preserve its structure if it's considered "special"
# But the user said "stage ALL images". So maybe I should include it.
# However, the ecosystem folder seems to have its own structure.
# Let's just move everything that's not already in assets/images/

find . -maxdepth 4 -not -path '*/.*' -not -path './node_modules*' -not -path './dist*' -not -path "./assets/images*" \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.gif" \) | while read -r img; do
    # Skip if it's already in assets/images
    if [[ "$img" == *"assets/images/"* ]]; then
        continue
    fi

    # Get dimensions using file command
    # We use grep -oE to extract the widthxheight part
    DIMENSIONS=$(file "$img" | grep -oE '[0-9]+x[0-9]+' | head -n 1)
    
    if [ -n "$DIMENSIONS" ]; then
        WIDTH=$(echo "$DIMENSIONS" | cut -d'x' -f1)
        HEIGHT=$(echo "$DIMENSIONS" | cut -d'x' -f2)
        
        if [ "$WIDTH" -ge "$HEIGHT" ]; then
            echo "Moving $img to $HORIZONTAL_DIR"
            mv "$img" "$HORIZONTAL_DIR/"
        else
            echo "Moving $img to $VERTICAL_DIR"
            mv "$img" "$VERTICAL_DIR/"
        fi
    else
        echo "Could not determine dimensions for $img, leaving it."
    fi
done

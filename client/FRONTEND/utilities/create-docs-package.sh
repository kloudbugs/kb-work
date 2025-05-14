#!/bin/bash

# Create a docs package that includes both the "?" folder and the DOCUMENTATION folder
echo "Creating documentation package..."

# Create a docs folder to hold the package
mkdir -p docs_package

# Copy all relevant documentation
cp -R ?/*.md docs_package/
cp -R DOCUMENTATION/* docs_package/

# Create a README in the package
cat > docs_package/README.txt << 'EOL'
KLOUD BUGS MINING DOCUMENTATION PACKAGE

This package contains all the documentation files from both:
- The original "?" folder 
- The "DOCUMENTATION" folder (which contains copies of the same files)

These files explain how to set up, configure, and use the KLOUD BUGS MINING platform.
EOL

echo "Documentation package created in docs_package folder"
echo "You can now download this folder from Replit"
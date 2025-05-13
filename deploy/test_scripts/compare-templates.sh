#!/bin/bash
# Script to compare rendered templates with existing files on your server

# Colors for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Set the base directory to the current directory
BASE_DIR="$(pwd)"
RENDERED_DIR="${BASE_DIR}/rendered"

# Function to compare files
compare_file() {
    local rendered_file=$1
    local server_file=$2
    local file_name=$(basename "$rendered_file")
    local diff_output="${RENDERED_DIR}/diff_${file_name}.diff"
    
    # Create a temporary file with the server content
    local temp_file=$(mktemp)
    echo "$server_file" > "$temp_file"
    
    echo -e "${GREEN}Comparing ${file_name}...${NC}"
    
    # Compare the files
    diff -u "$temp_file" "$rendered_file" > "$diff_output"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Files are identical${NC}"
        rm "$diff_output" # Remove the diff file if there are no differences
    else
        echo -e "${RED}✗ Differences found. Check ${diff_output} for details${NC}"
        echo "Summary of differences:"
        diff --color -u "$temp_file" "$rendered_file" | head -n 30
        echo -e "\n... (See full diff in ${diff_output})\n"
    fi
    
    # Clean up
    rm "$temp_file"
    echo ""
}

# Function to compare all templates for a stage
compare_stage_templates() {
    local stage=$1
    local domain=$2
    
    echo -e "${GREEN}======================${NC}"
    echo -e "${GREEN}Comparing ${stage} templates${NC}"
    echo -e "${GREEN}======================${NC}"
    
    # You'll need to get the content from the server
    # This assumes you have SSH access to the server and the correct paths
    
    # Example for nginx config
    echo "Getting nginx config from server..."
    server_nginx=$(ssh deploy@${domain} "cat /mnt/persist/nginx/conf.d/${stage}.conf")
    compare_file "${RENDERED_DIR}/${stage}/nginx.conf" "$server_nginx"
    
    # Example for uwsgi config
    echo "Getting uwsgi config from server..."
    server_uwsgi=$(ssh deploy@${domain} "cat /mnt/persist/uwsgi/conf.d/${stage}.ini")
    compare_file "${RENDERED_DIR}/${stage}/uwsgi.ini" "$server_uwsgi"
    
    # Example for PM2 config
    echo "Getting PM2 config from server..."
    server_pm2=$(ssh deploy@${domain} "cat /mnt/persist/nodejs/${stage}.yml")
    compare_file "${RENDERED_DIR}/${stage}/pm2_config.yml" "$server_pm2"
}

# First make sure the templates have been rendered
if [ ! -d "${RENDERED_DIR}" ]; then
    echo "Rendered templates not found. Please run test-templates.sh first."
    exit 1
fi

# Compare stage templates
compare_stage_templates "stage" "stage.savima.org"

# Compare prod templates
compare_stage_templates "prod" "savima.org"

echo "Comparison complete. Check diff files for details."
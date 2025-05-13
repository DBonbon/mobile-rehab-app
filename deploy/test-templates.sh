#!/bin/bash
# Script to test all j2 templates with both stage and production variables

# Set the deploy directory to the parent of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="${SCRIPT_DIR}/rendered"

echo "Deploy directory: ${DEPLOY_DIR}"
echo "Output directory: ${OUTPUT_DIR}"

# Create the output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}/stage"
mkdir -p "${OUTPUT_DIR}/prod"

# Function to test a template
test_template() {
    local stage=$1
    local template_path=$2
    local template_name=$(basename "$template_path" .j2)
    local output_path="${OUTPUT_DIR}/${stage}/${template_name}"
    
    echo "Testing template: ${template_path} with ${stage} variables"
    python3 "${SCRIPT_DIR}/template-tester.py" \
        --stage "${stage}" \
        --template "${template_path}" \
        --output "${output_path}" \
        --deploy-dir "${DEPLOY_DIR}"
    
    if [ -f "${output_path}" ]; then
        echo "======================="
        echo "Rendered template: ${output_path}"
        echo "======================="
        cat "${output_path}"
        echo -e "\n\n"
    else
        echo "ERROR: Failed to render template to ${output_path}"
    fi
}

# Test all templates with stage variables
for template in "files/nginx.conf.j2" "files/uwsgi.ini.j2" "files/pm2_config.yml.j2"; do
    test_template "stage" "${DEPLOY_DIR}/${template}"
done

# Test all templates with prod variables
for template in "files/nginx.conf.j2" "files/uwsgi.ini.j2" "files/pm2_config.yml.j2"; do
    test_template "prod" "${DEPLOY_DIR}/${template}"
done

echo "All templates have been rendered to the '${OUTPUT_DIR}' directory"

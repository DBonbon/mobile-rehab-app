#!/usr/bin/env python3
import os
import re
import yaml

# Paths
DEPLOY_DIR = "/mnt/c/Users/yrfri/pycharmProjects/savima/deploy"
TEMPLATES_DIR = os.path.join(DEPLOY_DIR, "files")
TEST_VARS_FILE = os.path.join(DEPLOY_DIR, "test_scripts/test_vars.yml")

# Read existing variable files
with open(os.path.join(DEPLOY_DIR, "group_vars/webservers"), 'r') as f:
    group_vars = yaml.safe_load(f)

with open(os.path.join(DEPLOY_DIR, "stages/stage.yml"), 'r') as f:
    stage_vars = yaml.safe_load(f)

# Extract all variables from templates
def find_variables(template_path):
    with open(template_path, 'r') as f:
        content = f.read()
    
    # Find all {{ variable }} patterns
    matches = re.findall(r'{{[^}]*}}', content)
    
    # Clean up variable names
    variables = []
    for match in matches:
        # Remove {{ and }}
        var = match[2:-2].strip()
        # Remove filters and default values
        if '|' in var:
            var = var.split('|')[0].strip()
        if 'default' in var:
            var = var.split('default')[0].strip()
        variables.append(var)
    
    return variables

# Get all template files
template_files = [f for f in os.listdir(TEMPLATES_DIR) if f.endswith('.j2')]

# Find all variables used in templates
all_vars = set()
for template_file in template_files:
    template_path = os.path.join(TEMPLATES_DIR, template_file)
    template_vars = find_variables(template_path)
    all_vars.update(template_vars)

print(f"Found {len(all_vars)} variables in templates:")
print(sorted(all_vars))

# Merge existing variables
merged_vars = {}
merged_vars.update(group_vars)
if 'webservers' in stage_vars and 'hosts' in stage_vars['webservers']:
    first_host = next(iter(stage_vars['webservers']['hosts'].values()))
    merged_vars.update(first_host)

# Add missing variables with default test values
test_vars = merged_vars.copy()
for var in all_vars:
    if var not in test_vars and var.strip():
        test_vars[var] = f"test_{var}"

# Add specific values for known variables
if 'next_port' in all_vars and 'next_port' not in test_vars:
    test_vars['next_port'] = 3001
if 'uwsgi_port' in all_vars and 'uwsgi_port' not in test_vars:
    test_vars['uwsgi_port'] = 8000
if 'protocol' in all_vars and 'protocol' not in test_vars:
    test_vars['protocol'] = 'https'
if 'node_env' in all_vars and 'node_env' not in test_vars:
    test_vars['node_env'] = 'production'

# Save the test variables file
with open(TEST_VARS_FILE, 'w') as f:
    yaml.dump(test_vars, f, default_flow_style=False)

print(f"Created test variables file: {TEST_VARS_FILE}")
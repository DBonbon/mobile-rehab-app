#!/usr/bin/env python3
import os
import sys
import yaml
import jinja2
import argparse

def load_yaml_file(file_path):
    """Load YAML file and return its contents as a dictionary."""
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found")
        sys.exit(1)
    
    with open(file_path, 'r') as file:
        try:
            return yaml.safe_load(file)
        except yaml.YAMLError as e:
            print(f"Error parsing YAML file {file_path}: {e}")
            sys.exit(1)

def render_template(template_path, output_path, variables):
    """Render a Jinja2 template with given variables and save to output path."""
    if not os.path.exists(template_path):
        print(f"Error: Template {template_path} not found")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Load the template
    template_dir = os.path.dirname(template_path)
    template_file = os.path.basename(template_path)
    
    # Setup Jinja2 environment
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(template_dir),
        undefined=jinja2.StrictUndefined  # Raise error for undefined variables
    )
    
    try:
        template = env.get_template(template_file)
        rendered = template.render(**variables)
        
        with open(output_path, 'w') as f:
            f.write(rendered)
        
        print(f"Successfully rendered {template_path} to {output_path}")
        return True
    
    except jinja2.exceptions.UndefinedError as e:
        print(f"Error rendering template {template_path}: {e}")
        print("Missing variable in template. Check your variable files.")
        return False
    except Exception as e:
        print(f"Error rendering template {template_path}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Test Jinja2 templates with Ansible variables')
    parser.add_argument('--stage', required=True, choices=['prod', 'stage'], 
                      help='Stage to use (prod or stage)')
    parser.add_argument('--template', required=True, 
                      help='Template file to render (e.g., files/nginx.conf.j2)')
    parser.add_argument('--output', required=True, 
                      help='Output file path')
    args = parser.parse_args()
    
    # Fixed paths pointing directly to your deploy directory
    deploy_dir = "/mnt/c/Users/yrfri/pycharmProjects/savima/deploy"
    webservers_vars_path = os.path.join(deploy_dir, 'group_vars/webservers')
    stage_vars_path = os.path.join(deploy_dir, f'stages/{args.stage}.yml')
    
    # Load variables
    webservers_vars = load_yaml_file(webservers_vars_path)
    stage_vars = load_yaml_file(stage_vars_path)
    
    # Merge variables (stage-specific variables take precedence)
    vars_dict = {}
    if webservers_vars:
        vars_dict.update(webservers_vars)
    
    if stage_vars and 'webservers' in stage_vars and 'hosts' in stage_vars['webservers']:
        # Get the first host from the stage file
        first_host = next(iter(stage_vars['webservers']['hosts'].values()))
        vars_dict.update(first_host)
    
    # Add missing variables needed by templates
    vars_dict['next_port'] = 3001
    vars_dict['uwsgi_port'] = 8000
    vars_dict['protocol'] = 'https'
    vars_dict['node_env'] = 'production'
    vars_dict['secret_key'] = 'test_secret_key'
    vars_dict['database_password'] = 'test_password'
    
    # Render the template
    render_template(args.template, args.output, vars_dict)

if __name__ == "__main__":
    main()
# docs/issues/issue_manager.py
import os
import github
from dotenv import load_dotenv
import argparse
import subprocess
from datetime import datetime
import pathlib
import sys

class IssueManager:
    def __init__(self):
        """Initialize GitHub connection and repository."""
        load_dotenv()
        
        self.token = os.getenv("GITHUB_TOKEN")
        if not self.token:
            raise ValueError("GITHUB_TOKEN not found in environment variables")
        
        self.github = github.Github(self.token)
        
        # Get repository name
        self.repo_name = os.getenv("GITHUB_REPO")
        if not self.repo_name:
            try:
                remote_url = subprocess.check_output(['git', 'remote', 'get-url', 'origin']).decode('utf-8').strip()
                if remote_url.startswith('git@'):
                    self.repo_name = remote_url.split(':')[1].replace('.git', '')
                elif remote_url.startswith('https://'):
                    self.repo_name = remote_url.split('github.com/')[1].replace('.git', '')
            except Exception as e:
                print(f"Error getting remote URL: {str(e)}")
                raise ValueError("Could not determine repository name")
        
        try:
            self.repo = self.github.get_repo(self.repo_name)
            print(f"Connected to repository: {self.repo.full_name}")
        except Exception as e:
            print(f"Error connecting to repository: {str(e)}")
            raise

    def parse_template(self, template_path):
        """Parse the markdown template file."""
        # Get filename without extension as title
        title = pathlib.Path(template_path).stem
        
        with open(template_path, 'r') as f:
            content = f.readlines()

        tags = []
        body_lines = []
        in_tags_section = False

        # Add timestamp at the top
        timestamp = f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        body_lines.append(timestamp)

        # Process the template line by line
        for line in content:
            if line.startswith('# Debug Session Template'):
                continue
                
            # Handle tags section
            if line.startswith('## Tags'):
                in_tags_section = True
                continue
            
            if in_tags_section:
                if line.strip() and not line.startswith('##'):
                    tags_line = line.strip().rstrip(';')
                    tags.extend([tag.strip() for tag in tags_line.split(',')])
                in_tags_section = False
                continue

            # Skip date and ID lines from template
            if 'Date:' in line or 'Issue ID:' in line:
                continue

            # Add all other content to body
            if not in_tags_section:
                body_lines.append(line)

        # Format the body content
        body = ''.join(body_lines)

        # Add status checklist
        status_section = """
### Status
- [ ] Investigation started
- [ ] Solution identified
- [ ] Implemented
- [ ] Verified
"""
        full_body = f"{body}\n{status_section}"

        return {
            'title': title,
            'body': full_body,
            'tags': [tag for tag in tags if tag]
        }

    def create_issue(self, template_path):
        """Create a GitHub issue from template."""
        issue_data = self.parse_template(template_path)
        
        # Create labels if they don't exist
        labels = []
        for tag in issue_data['tags']:
            try:
                label = self.repo.get_label(tag)
            except github.UnknownObjectException:
                label = self.repo.create_label(name=tag, color='ffffff')
            labels.append(label.name)

        # Create issue first to get the issue number
        issue = self.repo.create_issue(
            title=issue_data['title'],
            body=issue_data['body'],
            labels=labels
        )
        
        # Find the position after the timestamp to insert the Issue ID
        body_lines = issue_data['body'].splitlines()
        new_body_lines = []
        timestamp_found = False
        
        for line in body_lines:
            new_body_lines.append(line)
            if '**Date:**' in line and not timestamp_found:
                new_body_lines.append(f"**Issue ID:** #{issue.number}")
                timestamp_found = True

        # Update issue with the modified body
        updated_body = '\n'.join(new_body_lines)
        issue.edit(body=updated_body)
        
        print(f"Created issue #{issue.number}: {issue.html_url}")
        return issue

    def create_subissue(self, parent_issue_number, template_path):
        """Create a subissue linked to a parent issue."""
        # First, verify the parent issue exists
        try:
            parent_issue = self.repo.get_issue(parent_issue_number)
            print(f"Found parent issue: #{parent_issue.number} - {parent_issue.title}")
        except github.UnknownObjectException:
            raise ValueError(f"Parent issue #{parent_issue_number} not found")
        
        # Parse template for subissue
        issue_data = self.parse_template(template_path)
        
        # Add parent reference to the subissue
        parent_reference = f"**Parent Issue:** #{parent_issue_number}\n\n"
        issue_data['body'] = parent_reference + issue_data['body']
        
        # Add subissue label
        issue_data['tags'].append('subissue')
        
        # Create labels if they don't exist
        labels = []
        for tag in issue_data['tags']:
            try:
                label = self.repo.get_label(tag)
            except github.UnknownObjectException:
                label = self.repo.create_label(name=tag, color='ffffff')
            labels.append(label.name)
        
        # Create the subissue with a prefixed title
        subissue = self.repo.create_issue(
            title=f"[Sub] {issue_data['title']}",
            body=issue_data['body'],
            labels=labels
        )
        
        # Update the subissue body to include its ID
        body_lines = issue_data['body'].splitlines()
        new_body_lines = []
        timestamp_found = False
        
        for line in body_lines:
            new_body_lines.append(line)
            if '**Date:**' in line and not timestamp_found:
                new_body_lines.append(f"**Issue ID:** #{subissue.number}")
                timestamp_found = True
        
        updated_body = '\n'.join(new_body_lines)
        subissue.edit(body=updated_body)
        
        # Update parent issue to reference this subissue if it doesn't already have a Subissues section
        parent_body = parent_issue.body
        if "### Subissues" not in parent_body:
            # Add subissues section
            subissue_section = f"\n\n### Subissues\n- #{subissue.number}: {subissue.title}"
            updated_parent_body = parent_body + subissue_section
        else:
            # Append to existing subissues section
            lines = parent_body.splitlines()
            for i, line in enumerate(lines):
                if line.strip() == "### Subissues":
                    lines.insert(i + 1, f"- #{subissue.number}: {subissue.title}")
                    break
            updated_parent_body = '\n'.join(lines)
        
        parent_issue.edit(body=updated_parent_body)
        
        print(f"Created subissue #{subissue.number}: {subissue.html_url}")
        print(f"Updated parent issue #{parent_issue.number} with reference to subissue")
        
        return subissue

    def update_issue(self, issue_number, update_template=None, status=None, comment=None):
        """
        Update an existing issue with:
        - New content from template (optional)
        - Status change (optional)
        - Add comment (optional)
        """
        try:
            issue = self.repo.get_issue(issue_number)
            print(f"Found issue to update: #{issue.number} - {issue.title}")
        except github.UnknownObjectException:
            raise ValueError(f"Issue #{issue_number} not found")
        
        # Update with new content from template
        if update_template:
            print(f"Updating issue content using template: {update_template}")
            
            # Parse the update template
            with open(update_template, 'r') as f:
                update_content = f.read()
            
            # Extract just the updates section
            if "## Updates" in update_content:
                update_sections = update_content.split("## Updates")[1].strip()
                
                # Format the update with a timestamp
                formatted_update = f"\n\n## Update {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n{update_sections}"
                
                # Find where to insert the update (before the Status section)
                if "### Status" in issue.body:
                    body_parts = issue.body.split("### Status")
                    updated_body = body_parts[0] + formatted_update + "\n\n### Status" + body_parts[1]
                else:
                    updated_body = issue.body + formatted_update
                
                issue.edit(body=updated_body)
                print("Issue content updated successfully")
            else:
                print("Warning: No '## Updates' section found in template. No content updates made.")
        
        # Update status checkboxes
        if status:
            valid_statuses = ['investigation', 'solution', 'implemented', 'verified']
            if status not in valid_statuses:
                print(f"Warning: Invalid status '{status}'. Must be one of {valid_statuses}")
            else:
                body_lines = issue.body.splitlines()
                status_section_index = None
                
                # Find the Status section
                for i, line in enumerate(body_lines):
                    if '### Status' in line:
                        status_section_index = i
                        break
                
                if status_section_index is not None:
                    # Map status to the checkbox line
                    status_map = {
                        'investigation': '- [ ] Investigation started',
                        'solution': '- [ ] Solution identified',
                        'implemented': '- [ ] Implemented',
                        'verified': '- [ ] Verified'
                    }
                    
                    # Find and update the status checkbox
                    for i in range(status_section_index + 1, min(status_section_index + 6, len(body_lines))):
                        for status_key, status_text in status_map.items():
                            if status_text in body_lines[i] and status_key in status:
                                body_lines[i] = body_lines[i].replace('[ ]', '[x]')
                    
                    updated_body = '\n'.join(body_lines)
                    issue.edit(body=updated_body)
                    print(f"Updated status to '{status}'")
                else:
                    print("Warning: No status section found in issue body")
        
        # Add a comment
        if comment:
            issue.create_comment(comment)
            print(f"Added comment to issue #{issue.number}")
        
        print(f"Issue #{issue.number} updated: {issue.html_url}")
        return issue

def main():
    parser = argparse.ArgumentParser(description='GitHub Issue Management Tool')
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Create issue command
    create_parser = subparsers.add_parser('create', help='Create a new GitHub issue')
    create_parser.add_argument('template_path', help='Path to the markdown template file')
    
    # Create subissue command
    subissue_parser = subparsers.add_parser('subissue', help='Create a subissue linked to a parent issue')
    subissue_parser.add_argument('parent_issue', type=int, help='Number of the parent issue')
    subissue_parser.add_argument('template_path', help='Path to the markdown template file')
    
    # Update issue command
    update_parser = subparsers.add_parser('update', help='Update an existing issue')
    update_parser.add_argument('issue_number', type=int, help='Number of the issue to update')
    update_parser.add_argument('--template', '-t', help='Path to the update template file')
    update_parser.add_argument('--status', '-s', choices=['investigation', 'solution', 'implemented', 'verified'], 
                             help='Update the issue status')
    update_parser.add_argument('--comment', '-c', help='Add a comment to the issue')
    
    args = parser.parse_args()
    
    try:
        manager = IssueManager()
        
        if args.command == 'create':
            manager.create_issue(args.template_path)
        elif args.command == 'subissue':
            manager.create_subissue(args.parent_issue, args.template_path)
        elif args.command == 'update':
            if not any([args.template, args.status, args.comment]):
                print("Error: At least one update option (--template, --status, or --comment) is required")
                sys.exit(1)
            manager.update_issue(args.issue_number, args.template, args.status, args.comment)
        else:
            parser.print_help()
            
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
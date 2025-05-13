# docs/issues/create_issue.py
import os
import github
from dotenv import load_dotenv
import argparse
import subprocess
from datetime import datetime
import pathlib

class IssueCreator:
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

def main():
    parser = argparse.ArgumentParser(description='Create a GitHub issue from a markdown template')
    parser.add_argument('template_path', help='Path to the markdown template file')
    args = parser.parse_args()

    try:
        creator = IssueCreator()
        creator.create_issue(args.template_path)
    except Exception as e:
        print(f"Error: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()
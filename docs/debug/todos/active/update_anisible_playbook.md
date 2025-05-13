# TODO Item Template
## Overview
Title: update the linode settings on the deploy and provision .yml so they run properly
Priority: Low
Status: New
Created: 20250214
Last Updated: [Date]

## Description
modify the deploy j2 templates accordiong the current structure in linode.

adjust the provision and the deploy script accordiong the online setting 

Consider how to set up a flow for SSL cert

## Requirements
- ensure online project backup
- understand Staging

## Dependencies
- Other tasks that must be completed first
- Required resources

## Notes
- Ensure online project backup
- Challenges encountered
- Decisions made

## Related
- Links to related issues
- Reference documents
- Related debug sessions


To capture your current working configuration:

1. First, create a backup of your working configuration:
```bash
# On your Linode server
sudo cp /etc/nginx/sites-available/your-app /path/to/backup/
sudo cp /etc/systemd/system/uwsgi.service /path/to/backup/
sudo cp /etc/systemd/system/pm2-app.service /path/to/backup/
```

2. Create a new branch in your deployment repository:
```bash
git checkout -b update-deployment-scripts
```

3. Update your Ansible playbooks to reflect the current working state:

```yaml
# deploy.yml
- name: Deploy Application
  hosts: web
  tasks:
    - name: Copy nginx configuration
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ app_name }}
      notify: restart nginx

    - name: Setup SSL certificates
      include_tasks: tasks/ssl.yml

    - name: Configure systemd services
      template:
        src: templates/{{ item }}.service.j2
        dest: /etc/systemd/system/{{ item }}.service
      loop:
        - uwsgi
        - pm2-app
      notify: restart services
```

4. Test the updated scripts on a staging environment first:
```bash
ansible-playbook -i staging deploy.yml --check
```

Recommended Workflow:

1. Start with CI/CD:
   - Set up GitHub Actions workflows
   - Configure secrets in GitHub
   - Test with a staging environment
   - Implement gradual deployment to production

2. Then update deployment scripts:
   - Create staging environment
   - Test updated scripts there
   - Document changes
   - Update production

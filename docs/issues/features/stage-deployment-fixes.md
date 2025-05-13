# Stage Environment Deployment Fixes

## Session Info
Related PRs: N/A
Epic: #9

## Context
During staging environment deployment, several issues were identified causing the environment to not function properly. These issues need to be fixed in the deployment scripts to ensure consistent and reliable deployments.

## Requirements
- Update deployment scripts to fix socket path inconsistencies
- Add collectstatic step to deployment process
- Address legacy path references (pipit vs teki)
- Fix systemd service configuration for staging
- Ensure nginx configuration consistency

## Technical Notes
1. Socket Path Consistency:
   - Standardize all socket paths to follow the pattern: `/run/uwsgi/app/{environment}/socket`
   - Ensure nginx, uwsgi config, and systemd service files all use the same path

2. Static Files Management:
   - Add explicit collectstatic step with --clear flag
   - Fix file permissions for static directories
   - Add version query parameter to CSS references in wagtail_hooks.py

3. Legacy Path References:
   - Search and replace "pipit" references with "teki"
   - Create appropriate symlinks for backward compatibility if needed

4. Systemd Service Configuration:
   - Use correct service name: `uwsgi-stage` for staging
   - Configure ExecStartPre commands to create correct socket directories

5. Nginx Configuration:
   - Ensure consistent configuration between environments
   - Standardize server names and SSL configuration

## Acceptance Criteria
- [x] Socket paths are consistent across all configuration files
- [x] collectstatic runs successfully during deployment
- [x] No more 500 errors when accessing the admin interface
- [x] pipit/teki path references are handled correctly
- [x] Systemd service starts without errors
- [x] Nginx configuration passes syntax validation

## Dependencies
- Access to staging server
- Proper permissions for the deploy user

## References
- Django documentation on static files: https://docs.djangoproject.com/en/stable/howto/static-files/
- uWSGI documentation: https://uwsgi-docs.readthedocs.io/en/latest/
- Nginx configuration best practices

## Tags
bugfix, deployment, django, uwsgi, nginx, static-files
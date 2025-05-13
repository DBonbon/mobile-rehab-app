# Epic Template

## Session Info
Related PRs: N/A

## Overview
Establish a comprehensive CI/CD pipeline for automated testing and deployment

## Objectives
- Set up automated deployment pipeline
- Implement automated testing for both frontend and backend
- Configure continuous deployment to Linode server
- Integrate with GitHub Actions
- Optional: CircleCI integration consideration

## Features/Tasks
1. Frontend Testing Implementation
   - Configure npm test:ci
   - Resolve NextJS router issues
   - Set up component testing

2. Backend Testing Setup
   - Configure Wagtail/Django tests
   - Set up test automation
   - Integrate with CI pipeline

3. Deployment Configuration
   - Set up GitHub Actions workflow
   - Configure deployment to Linode
   - Set up service management (PM2, uWSGI, Nginx)

## Dependencies
- GitHub Actions
- Node.js/npm
- Python/Django
- Linode server access

## References
- Project structure in .github/workflows/
- Current CI workflow configuration
- Frontend test configuration

## Tags
epic, ci-cd
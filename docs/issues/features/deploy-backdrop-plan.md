# Deployment Backdrop Implementation Plan

## Tags
deployment, systemd, staging, infrastructure, CI/CD, testing, wagtail, nextjs

## Description
This issue outlines the systematic approach for implementing a deployment backdrop system that allows multiple instances of our application stack to run simultaneously on the same server without conflicts.

## Objectives
* Ensure systemd job configurations support multiple application instances
* Create and test minimal deployment configurations
* Implement full staging environment
* Identify and document configuration differences

## Implementation Plan

### 1. Systemd Job Compatibility Check
- [ ] Examine current systemd job configurations
- [ ] Identify hard-coded paths, ports, or resources that prevent multiple applications
- [ ] Modify service files to use instance-specific variables
- [ ] Implement parameterized templates for systemd unit files
- [ ] Test modifications to ensure they don't affect production app

### 2. Minimal Test Applications
- [ ] Create bare-bones Wagtail application with essential features
- [ ] Create minimal NextJS application that connects to Wagtail API
- [ ] Configure deployment with similar structure to production
- [ ] Deploy minimal applications using modified systemd configurations
- [ ] Test basic functionality between components
- [ ] Verify API connections work correctly

### 3. Full Staging Deployment
- [ ] Create stage.savima.org DNS entry
- [ ] Copy production configuration with minimal domain changes
- [ ] Obtain new SSL certificates for the staging domain
- [ ] Configure Nginx for the staging domain
- [ ] Deploy full application stack to staging environment
- [ ] Verify all components work correctly in staging
- [ ] Test API integration between frontend and backend

### 4. Differential Analysis
- [ ] Compare working configurations with deployment scripts
- [ ] Document each discrepancy systematically
- [ ] Test changes one by one to isolate exact failure points
- [ ] Start with application files (wsgi.py, package.json)
- [ ] Continue with configuration files
- [ ] Update templates and deployment scripts based on findings
- [ ] Create comprehensive documentation of required changes

## Technical Considerations
* Systemd services may need parameterization using environment files
* Port configurations must be dynamic to avoid conflicts
* File paths should include instance identifiers
* Database connections need instance-specific configurations
* Media and static file paths should be instance-specific

## Benefits
* Validates systemd job compatibility early
* Minimal test apps verify infrastructure changes without risking production
* Full staging environment provides a complete testing ground
* Incremental changes help pinpoint exact configuration problems
* Creates foundation for robust deployment pipeline

## Dependencies
* Access to production server
* DNS configuration permissions
* SSL certificate issuance capability
* Current production configuration
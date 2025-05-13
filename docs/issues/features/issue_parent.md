# Parent Issue Template (parent_issue.md)
# CI Pipeline Failure

## Tags
ci, pipeline, failure

## Description
The CI pipeline has failed in the main branch. Need to investigate the root cause.

## Expected Behavior
The pipeline should complete successfully without any errors.

## Current Behavior
The pipeline is failing at the test stage.

## Steps to Reproduce
1. Push code to the main branch
2. CI pipeline starts automatically
3. Pipeline fails at the test stage

## Additional Information
Pipeline ID: CI-12345
Failure time: 2023-01-01T12:00:00Z

# Subissue Template (test_failures.md)
# Test Framework Issues

## Tags
ci, tests, failure, subissue

## Description
Tests are failing in the CI pipeline. Need to investigate which tests specifically are failing and why.

## Expected Behavior
All tests should pass successfully.

## Current Behavior
Several backend tests are failing with timeout errors.

## Investigation Notes
Initial investigation shows that the database connection might be timing out.

# Update Template (update_template.md)
## Updates
Found the root cause of the issue. The database connection string was changed in the latest commit but the environment variables in CI weren't updated.

### Solution
Update the CI environment variables to match the new connection string format.

### Steps Taken
1. Checked the database logs
2. Compared local and CI environment variables
3. Found discrepancy in connection string format
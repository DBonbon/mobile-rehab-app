# uwsgi service and configuration files


# Recap set up simple application isolated uwsgi test

## The Problem We Solved
We successfully configured uWSGI to run your staging environment and listen on port 4000. The key insight was discovering that your uWSGI version requires `http-socket = :4000` instead of `http = :4000`.

## Key Findings
1. Your uWSGI version (2.0.24-debian) requires the `http-socket` directive specifically
2. The service is now running and listening on port 4000 (confirmed with `lsof`)
3. We kept the Unix socket configuration for future Nginx integration
4. The permissions are correct for the application directories
5. The virtual environment is automatically activated by uWSGI's `virtualenv` directive

## Current Configuration
Your working configuration in `/mnt/persist/uwsgi/conf.d/savima-stage.ini` now includes:
```ini
# Socket Settings
http-socket = :4000             # This was the critical change
socket = /run/uwsgi/app/savima-stage/socket
```

## Next Steps
1. Test accessing your application: `curl http://localhost:4000`
2. If successful, test with domain: `curl -H "Host: stage.savima.org" http://localhost:4000`
3. When ready, proceed to Nginx configuration


## to test it with http just run:

    curl -H "Host: stage.savima.org" http://localhost:4000



runnitn now with nginx:

# Nginx Configuration Recap

We successfully configured Nginx to serve your staging Wagtail application. Here's a summary of what we did:

1. **Created a Nginx configuration file**:
   - Created `/mnt/persist/nginx/conf.d/savima-stage.conf`
   - Based it on your existing production configuration but simplified for the staging environment
   - Configured it to listen on ports 80 and 443

2. **Set up SSL/HTTPS**:
   - Reused your existing SSL certificate from savima.org
   - Configured proper SSL settings (protocols, ciphers, etc.)
   - Set up redirection from HTTP to HTTPS

3. **Configured reverse proxy to uWSGI**:
   - Connected Nginx to the uWSGI socket at `/run/uwsgi/app/savima-stage/socket`
   - Set appropriate headers for the proxy connection
   - Added static file handling for better performance

4. **Modified uWSGI configuration**:
   - Updated to use the Unix socket instead of HTTP port
   - This allows Nginx to communicate with uWSGI via the socket

5. **Set up proper permissions**:
   - Created necessary directories
   - Set up error page
   - Ensured proper file permissions for www-data user

6. **Enabled and tested the configuration**:
   - Linked the configuration to sites-enabled
   - Tested with `nginx -t`
   - Restarted both Nginx and uWSGI services

7. **Verified the setup**:
   - Confirmed HTTP redirects to HTTPS
   - Confirmed HTTPS serves the Wagtail application
   - Confirmed the application loads properly

Your staging environment is now accessible at https://stage.savima.org with a configuration that mirrors your production environment but is dedicated to staging purposes.


Project Setup Recap: Staging Environment for savima
Here's a summary of what we accomplished to set up your complete staging environment:
1. uWSGI Setup

Created a proper uWSGI configuration (savima-stage.ini) for the staging Wagtail application
Fixed the HTTP binding issue by using http-socket = :4000 instead of http = :4000
Created a systemd service for the uWSGI application
Set up proper directory permissions for the Wagtail application files

2. Nginx Configuration

Created a dedicated Nginx configuration for the staging site (savima-stage.conf)
Set up SSL using the existing certificate
Configured proper proxy settings to route traffic to the correct services
Added locations for static files and API endpoints

3. Next.js Frontend

Set up a minimal Next.js application for the staging environment
Created a simple API endpoint in the Wagtail backend
Configured the Next.js application to run on port 3002 to avoid conflicts with production
Created proper environment variables in the .env file
Built the application in standalone mode

4. PM2 Process Management

Created a PM2 configuration file (savima-stage.yml) for the staging frontend
Set up the proper environment variables in the PM2 configuration
Started and saved the PM2 process for automatic restart on server reboot

5. Integration

Connected all components (uWSGI, Nginx, Next.js) to work together
Set up proper routing between the frontend and backend
Ensured that the staging environment operates independently from production

The staging environment now mirrors your production setup but operates on different ports (3002 for Next.js, 4000 for uWSGI) and with separate configuration files, allowing you to test changes without affecting your production site.
The key insight was understanding how the different components need to be configured to communicate with each other properly, particularly:

The correct uWSGI HTTP socket configuration
The proper port assignment for the Next.js application
The correct Nginx proxy configuration to route traffic

Your staging site is now accessible at https://stage.savima.org and can be used for testing new features before deploying to production.
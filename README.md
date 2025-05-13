# Rehabilitation Support Application

A Wagtail-NextJS application designed to create a supportive network for rehabilitation journeys. This application connects the person in rehabilitation (the "fighter") with family and friends who can assist with daily tasks and provide encouragement.

## 🌟 Purpose

This application was developed to support rehabilitation efforts by creating a collaborative environment where loved ones can actively participate in the recovery process. It enables remote support and progress tracking, making the rehabilitation journey a shared experience.

## ✨ Key Features

- **Support Network**: Family and friends can create accounts and join the fighter's support network
- **Task Management**: Supporters ("tool-holders") can select and complete tasks to assist the fighter
- **Achievement System**: Reward system based on task completion, customizable by the fighter
- **Progress Tracking**: Comprehensive tracking and visualization of rehabilitation progress
- **Daily Challenges**: "Battle pages" focused on specific daily rehabilitation goals
- **Mobile Optimized**: Designed as a Progressive Web App (PWA) for easy mobile access
- **Multilingual Support**: Built-in support for multiple languages via Wagtail Locales

## 🛠️ Technical Stack

- **Backend**: Wagtail CMS (Python/Django)
- **Frontend**: NextJS (React)
- **Containerization**: Docker and docker-compose with nginx
- **Authentication**: Built-in user authentication system
- **Data Flow**: Two-way data exchange between frontend and backend

## 📱 Core Pages

- **Homepage**: Overview dashboard with rehabilitation statistics and progress visualization
- **Battle Pages**: Daily challenge pages for the fighter with task details
- **User Dashboard**: Personalized interface for task selection and completion
- **Administration**: Wagtail CMS admin interface for managing content and users

## 🚀 Getting Started

For detailed setup instructions, dependency information, and development guidelines, please refer to our [Getting Started Guide](docs/getting-started-guide.md).

### Quick Start

1. Visit the application on your mobile device
2. Add to home screen for app-like experience
3. Log in with your provided credentials
4. Use the dashboard to select and complete tasks

### Access Information

- **Application URL**: [Your deployed app URL]
- **Default Admin**: http://[your-domain]/wt/cms (username: admin, password: admin)
- **Support Contact**: [Your contact information]

## 📦 Deployment Options

The application can be deployed in several ways:

1. **Using Docker & Ansible**:
   - See the `deploy` directory for Ansible playbooks
   - Configure environment variables for production

2. **Separate Backend/Frontend Deployment**:
   - Deploy Wagtail backend on a Python-compatible server
   - Deploy NextJS frontend using Vercel, Netlify, or similar services
   - Ensure proper API configuration between services

3. **CI/CD with GitHub Actions**:
   - Preconfigured GitHub Actions workflows for automated deployment
   - Configure secrets in your GitHub repository settings

## 🔌 Extending the Application

### Adding New Pages

- **Backend**: Create new page types in Wagtail
- **Frontend**: Add corresponding React components and routes in NextJS

### Message System

- The application supports custom messages that can be configured through the admin interface
- Refer to backend documentation for message template setup

### Scaling Considerations

- The application is designed to be horizontally scalable
- Database optimizations may be needed for larger user bases
- Consider using a CDN for static assets in production

## 📚 Documentation

- Backend API documentation can be found in the `backend/docs` directory
- Frontend component documentation is available in the `frontend/docs` directory
- Additional documentation is included in the application zip file

## 🌐 Multi-language Support

The application comes with multi-language support through Wagtail Locales:

1. Access the Wagtail admin interface
2. Navigate to Settings > Locales
3. Add and configure desired languages
4. Translate content through the Wagtail translation interface

## 🤝 Contributing

Contributions to improve the application are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Specify your license here]

---

*This application was created to support rehabilitation journeys and bring people together in the healing process.*
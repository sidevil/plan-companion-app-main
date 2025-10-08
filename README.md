# SmartMirror - AI-Powered Smart Home Dashboard

A modern, intelligent dashboard application that brings together weather, news, calendar, smart home controls, and more in one beautiful interface.

## 🚀 Features

### Core Features
- **Real-time Weather** - Live weather updates with OpenWeatherMap integration
- **News Feed** - Latest headlines from NewsAPI with multiple categories
- **Calendar Integration** - Sync and manage your events
- **Stock Market** - Real-time stock quotes and portfolio tracking
- **Traffic & Routes** - Google Maps integration for live traffic updates
- **Smart Home Control** - Device management and scene automation

### Advanced Features
- **AI-Powered Voice Commands** - Natural language understanding with Lovable AI
- **Customizable Widgets** - Drag-and-drop widget management
- **Progressive Web App (PWA)** - Install on any device, works offline
- **Multi-device Sync** - Profile and preferences sync across devices
- **Responsive Design** - Beautiful on any screen size

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with JWT
- **AI**: Lovable AI (Gemini 2.5 Flash)
- **State Management**: React Context + TanStack Query
- **UI Components**: Radix UI + shadcn/ui

## Project info

**URL**: https://lovable.dev/projects/674f0cfa-ee90-46ea-8374-b687c5c816d5

## 📋 Prerequisites

Before you begin, you'll need:

1. **API Keys** (all have free tiers):
   - [OpenWeatherMap API Key](https://openweathermap.org/api) - Weather data
   - [NewsAPI Key](https://newsapi.org/) - News headlines
   - [Alpha Vantage API Key](https://www.alphavantage.co/support/#api-key) - Stock data
   - [Google Maps API Key](https://console.cloud.google.com/) - Traffic & routes

2. **Accounts**:
   - Supabase account (for backend & database)

## 🚀 Getting Started

### Configure API Keys

Add your API keys in the Supabase Dashboard:
- Go to Project Settings > Edge Functions
- Add the following secrets:
  - `OPENWEATHER_API_KEY`
  - `NEWS_API_KEY`
  - `ALPHA_VANTAGE_API_KEY`
  - `GOOGLE_MAPS_API_KEY`
  - `LOVABLE_API_KEY` (auto-configured)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/674f0cfa-ee90-46ea-8374-b687c5c816d5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend + Auth + Database)
- Lovable AI (Voice Commands)
- TanStack Query (Data Fetching)

## 📱 PWA Installation

The app can be installed as a Progressive Web App:

1. **Desktop**: Click the install button in your browser's address bar
2. **Mobile**: Tap "Add to Home Screen" in your browser menu

## 🎯 Usage Guide

### Voice Commands

Activate voice control by clicking the microphone button. Try these commands:

- **Navigation**: "Go to widgets", "Show me settings"
- **Device Control**: "Turn on the lights", "Set thermostat to 72"
- **Scenes**: "Activate morning scene"
- **Queries**: "What's the weather?", "What time is it?"

### Widget Management

1. Go to the Widgets page
2. Browse the widget gallery
3. Click "Add to Dashboard" on any widget
4. Drag and drop to reorder on the dashboard

### Smart Home Setup

1. Navigate to Smart Home page
2. Click "Discover Devices"
3. Follow the pairing instructions for your devices
4. Create scenes to automate multiple devices

## 🔒 Security

- All API keys are stored securely in Supabase Edge Functions
- Row Level Security (RLS) enabled on all database tables
- JWT-based authentication with auto-refresh
- No sensitive data exposed to client-side code

## 🎨 Customization

### Theme
Edit `src/index.css` to customize colors and design tokens.

### Widgets
Create new widgets by:
1. Adding component in `src/components/widgets/`
2. Registering in `src/components/widgets/registry.tsx`

### API Integration
Add new data sources by creating Edge Functions in `supabase/functions/`

## 📊 Performance

- **Lazy Loading**: Routes are code-split for faster initial load
- **Caching**: API responses cached with TanStack Query
- **Optimized Bundle**: Tree-shaking and minification enabled
- **Service Worker**: Offline functionality and resource caching

## 🐛 Troubleshooting

### Common Issues

**API Keys Not Working**
- Verify keys are added in Supabase Dashboard
- Check Edge Function logs for error messages

**Voice Commands Not Responding**
- Grant microphone permissions in browser
- Check browser console for errors
- Ensure LOVABLE_API_KEY is configured

**Widgets Not Loading**
- Check network tab for failed API calls
- Verify RLS policies allow authenticated access
- Clear browser cache and reload

For more help, see [Troubleshooting Documentation](https://docs.lovable.dev/tips-tricks/troubleshooting)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using [Lovable](https://lovable.dev)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/674f0cfa-ee90-46ea-8374-b687c5c816d5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

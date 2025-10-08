import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Cloud, 
  Calendar, 
  Newspaper, 
  Home, 
  User, 
  Settings,
  Lightbulb,
  Thermometer,
  Shield,
  ArrowRight
} from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🪞</div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to SmartMirror
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform any display into an intelligent hub for your daily information, 
            smart home control, and personal productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?tab=signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth?tab=signin">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <Clock className="h-8 w-8" />,
              title: "Real-time Information",
              description: "Live updates for time, weather, calendar events, and news headlines",
              color: "text-blue-500"
            },
            {
              icon: <Home className="h-8 w-8" />,
              title: "Smart Home Control",
              description: "Control lights, thermostats, and security devices from one interface",
              color: "text-green-500"
            },
            {
              icon: <User className="h-8 w-8" />,
              title: "Voice Commands",
              description: "Hands-free interaction with voice recognition and control",
              color: "text-purple-500"
            },
            {
              icon: <Calendar className="h-8 w-8" />,
              title: "Calendar Integration",
              description: "Sync with Google Calendar, Outlook, and other popular services",
              color: "text-orange-500"
            },
            {
              icon: <Newspaper className="h-8 w-8" />,
              title: "News & Updates",
              description: "Customizable news feeds from your favorite sources",
              color: "text-red-500"
            },
            {
              icon: <Settings className="h-8 w-8" />,
              title: "Customizable Widgets",
              description: "Drag-and-drop interface with modular widget system",
              color: "text-indigo-500"
            }
          ].map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-md hover:scale-105">
              <CardHeader>
                <div className={`${feature.color} mb-2`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Smart Home Preview */}
        <Card className="mb-16 overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Smart Home Integration</CardTitle>
            <CardDescription>
              Control all your smart devices from one beautiful interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Living Room Lights</span>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Main Thermostat</span>
                </div>
                <Badge variant="secondary">72°F</Badge>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Security System</span>
                </div>
                <Badge variant="secondary">Armed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Create your account and start building your smart mirror experience today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/auth?tab=signup">
              <Button size="lg" className="text-lg px-8">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
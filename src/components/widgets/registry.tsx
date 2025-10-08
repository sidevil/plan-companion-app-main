import { WidgetType } from '@/contexts/WidgetContext';
import { DigitalClock } from './DigitalClock';
import { WeatherWidget } from './WeatherWidget';
import { CalendarPreview } from './CalendarPreview';
import { NewsTicker } from './NewsTicker';
import { StockWidget } from './StockWidget';
import { TrafficWidget } from './TrafficWidget';
import { SocialMediaWidget } from './SocialMediaWidget';
import { TaskManagementWidget } from './TaskManagementWidget';
import { PhotoSlideshowWidget } from './PhotoSlideshowWidget';
import { StreamingServicesWidget } from './StreamingServicesWidget';

export const WIDGET_REGISTRY: WidgetType[] = [
  {
    id: 'clock',
    name: 'Digital Clock',
    description: 'Display current time and date',
    category: 'Time & Date',
    defaultSize: 'large',
    component: DigitalClock,
    configurable: false
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Current weather conditions and forecast',
    category: 'Information',
    defaultSize: 'medium',
    component: WeatherWidget,
    configurable: true
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Upcoming events and appointments',
    category: 'Productivity',
    defaultSize: 'medium',
    component: CalendarPreview,
    configurable: true
  },
  {
    id: 'news',
    name: 'News Ticker',
    description: 'Latest news headlines',
    category: 'Information',
    defaultSize: 'large',
    component: NewsTicker,
    configurable: true
  },
  {
    id: 'stocks',
    name: 'Stock Market',
    description: 'Stock prices and market data',
    category: 'Finance',
    defaultSize: 'medium',
    component: StockWidget,
    configurable: true
  },
  {
    id: 'traffic',
    name: 'Traffic & Routes',
    description: 'Commute times and traffic conditions',
    category: 'Transportation',
    defaultSize: 'medium',
    component: TrafficWidget,
    configurable: true
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Social media feed and updates',
    category: 'Social',
    defaultSize: 'medium',
    component: SocialMediaWidget,
    configurable: true
  },
  {
    id: 'tasks',
    name: 'Task Management',
    description: 'To-do list and task tracking',
    category: 'Productivity',
    defaultSize: 'medium',
    component: TaskManagementWidget,
    configurable: false
  },
  {
    id: 'photos',
    name: 'Photo Slideshow',
    description: 'Personal photo slideshow',
    category: 'Entertainment',
    defaultSize: 'medium',
    component: PhotoSlideshowWidget,
    configurable: true
  },
  {
    id: 'streaming',
    name: 'Streaming Services',
    description: 'Access YouTube, Netflix, Prime, Hotstar and more',
    category: 'Entertainment',
    defaultSize: 'large',
    component: StreamingServicesWidget,
    configurable: false
  }
];
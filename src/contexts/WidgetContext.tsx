import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Widget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  enabled: boolean;
  page: number;
  config?: Record<string, any>;
}

interface WidgetState {
  widgets: Widget[];
  availableWidgets: WidgetType[];
}

export interface WidgetType {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultSize: 'small' | 'medium' | 'large';
  component: React.ComponentType<any>;
  configurable: boolean;
}

type WidgetAction =
  | { type: 'SET_WIDGETS'; payload: Widget[] }
  | { type: 'ADD_WIDGET'; payload: Widget }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'UPDATE_WIDGET'; payload: { id: string; updates: Partial<Widget> } }
  | { type: 'REORDER_WIDGETS'; payload: Widget[] }
  | { type: 'RESET_TO_DEFAULT' };

const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'SET_WIDGETS':
      return { ...state, widgets: action.payload };
    case 'ADD_WIDGET':
      return { ...state, widgets: [...state.widgets, action.payload] };
    case 'REMOVE_WIDGET':
      return { ...state, widgets: state.widgets.filter(w => w.id !== action.payload) };
    case 'UPDATE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.map(w =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        )
      };
    case 'REORDER_WIDGETS':
      return { ...state, widgets: action.payload };
    case 'RESET_TO_DEFAULT':
      return { ...state, widgets: getDefaultWidgets() };
    default:
      return state;
  }
};

const getDefaultWidgets = (): Widget[] => [
  { id: 'clock', type: 'clock', title: 'Digital Clock', size: 'large', position: 0, enabled: true, page: 1 },
  { id: 'weather', type: 'weather', title: 'Weather', size: 'medium', position: 1, enabled: true, page: 1 },
  { id: 'calendar', type: 'calendar', title: 'Calendar', size: 'medium', position: 2, enabled: true, page: 1 },
  { id: 'news', type: 'news', title: 'News Ticker', size: 'large', position: 3, enabled: true, page: 1 },
  { id: 'streaming', type: 'streaming', title: 'Streaming Services', size: 'large', position: 0, enabled: true, page: 4 },
];

interface WidgetContextType {
  widgets: Widget[];
  availableWidgets: WidgetType[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (widgets: Widget[]) => void;
  resetToDefault: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const WidgetContext = createContext<WidgetContextType | null>(null);

export const useWidgets = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
};

export const WidgetProvider: React.FC<{ children: React.ReactNode; availableWidgets: WidgetType[] }> = ({
  children,
  availableWidgets
}) => {
  const [state, dispatch] = useReducer(widgetReducer, {
    widgets: getDefaultWidgets(),
    availableWidgets
  });

  const saveToLocalStorage = () => {
    localStorage.setItem('smartmirror-widgets', JSON.stringify(state.widgets));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('smartmirror-widgets');
    if (saved) {
      try {
        const widgets = JSON.parse(saved);
        dispatch({ type: 'SET_WIDGETS', payload: widgets });
      } catch (error) {
        console.error('Failed to load widgets from localStorage:', error);
      }
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [state.widgets]);

  const addWidget = (widget: Widget) => {
    dispatch({ type: 'ADD_WIDGET', payload: widget });
  };

  const removeWidget = (id: string) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: id });
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    dispatch({ type: 'UPDATE_WIDGET', payload: { id, updates } });
  };

  const reorderWidgets = (widgets: Widget[]) => {
    dispatch({ type: 'REORDER_WIDGETS', payload: widgets });
  };

  const resetToDefault = () => {
    dispatch({ type: 'RESET_TO_DEFAULT' });
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets: state.widgets,
        availableWidgets: state.availableWidgets,
        addWidget,
        removeWidget,
        updateWidget,
        reorderWidgets,
        resetToDefault,
        saveToLocalStorage,
        loadFromLocalStorage
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};
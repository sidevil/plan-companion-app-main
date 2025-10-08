export class GestureHandler {
  private element: HTMLElement;
  private onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  private onPinch: (scale: number) => void;
  private onLongPress: (element: HTMLElement) => void;
  
  private startX = 0;
  private startY = 0;
  private initialDistance = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private isLongPressing = false;

  constructor(
    element: HTMLElement,
    callbacks: {
      onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
      onPinch?: (scale: number) => void;
      onLongPress?: (element: HTMLElement) => void;
    }
  ) {
    this.element = element;
    this.onSwipe = callbacks.onSwipe || (() => {});
    this.onPinch = callbacks.onPinch || (() => {});
    this.onLongPress = callbacks.onLongPress || (() => {});
    
    this.attachEventListeners();
  }

  private attachEventListeners() {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

    // Mouse events for desktop
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseUp.bind(this));
  }

  private handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      // Single touch - potential swipe or long press
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.startLongPressTimer();
    } else if (e.touches.length === 2) {
      // Two touches - potential pinch
      this.clearLongPressTimer();
      this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
    }
  }

  private handleTouchMove(e: TouchEvent) {
    this.clearLongPressTimer();
    
    if (e.touches.length === 2 && this.initialDistance > 0) {
      // Handle pinch gesture
      const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / this.initialDistance;
      this.onPinch(scale);
      e.preventDefault();
    }
  }

  private handleTouchEnd(e: TouchEvent) {
    this.clearLongPressTimer();
    
    if (e.changedTouches.length === 1 && !this.isLongPressing) {
      // Handle swipe gesture
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      this.detectSwipe(this.startX, this.startY, endX, endY);
    }
    
    this.isLongPressing = false;
    this.initialDistance = 0;
  }

  private handleMouseDown(e: MouseEvent) {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startLongPressTimer();
  }

  private handleMouseMove(e: MouseEvent) {
    this.clearLongPressTimer();
  }

  private handleMouseUp(e: MouseEvent) {
    this.clearLongPressTimer();
    
    if (!this.isLongPressing) {
      this.detectSwipe(this.startX, this.startY, e.clientX, e.clientY);
    }
    
    this.isLongPressing = false;
  }

  private startLongPressTimer() {
    this.longPressTimer = setTimeout(() => {
      this.isLongPressing = true;
      this.onLongPress(this.element);
      
      // Add visual feedback for long press
      this.element.style.transform = 'scale(0.95)';
      this.element.style.transition = 'transform 0.1s ease';
      
      setTimeout(() => {
        this.element.style.transform = '';
        this.element.style.transition = '';
      }, 150);
    }, 500); // 500ms for long press
  }

  private clearLongPressTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private detectSwipe(startX: number, startY: number, endX: number, endY: number) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        this.onSwipe(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        this.onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    }
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public destroy() {
    this.clearLongPressTimer();
    
    // Remove all event listeners
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.element.removeEventListener('mouseleave', this.handleMouseUp.bind(this));
  }
}
/**
 * Focus Management Utilities
 * Handle focus trapping, restoration, and keyboard navigation
 * Required for WCAG 2.2 AAA compliance
 */

export class FocusManager {
  private previousFocus: HTMLElement | null = null;
  
  /**
   * Trap focus within a container (for modals, dialogs)
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  /**
   * Save current focus to restore later
   */
  saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }
  
  /**
   * Restore previously saved focus
   */
  restoreFocus(): void {
    this.previousFocus?.focus();
    this.previousFocus = null;
  }
  
  /**
   * Get all focusable elements within a container
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    return Array.from(container.querySelectorAll(selector));
  }
  
  /**
   * Move focus to first error in a form
   */
  focusFirstError(formElement: HTMLElement): void {
    const errorElement = formElement.querySelector('[aria-invalid="true"]') as HTMLElement;
    errorElement?.focus();
  }
}

// Singleton instance
export const focusManager = new FocusManager();

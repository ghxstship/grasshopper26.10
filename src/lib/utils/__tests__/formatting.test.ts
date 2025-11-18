import { formatCurrency, formatDate, formatDateTime, truncateText } from '../formatting';

describe('formatting utilities', () => {
  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const date = '2024-12-01';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec/);
      expect(formatted).toMatch(/2024/);
    });

    it('should format Date object', () => {
      const date = new Date('2024-12-01');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec/);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = '2024-12-01T14:30:00';
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Dec/);
      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/:/);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exact';
      expect(truncateText(text, 5)).toBe('Exact');
    });
  });
});

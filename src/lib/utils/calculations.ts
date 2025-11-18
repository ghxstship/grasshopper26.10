/**
 * Calculation Utilities
 * Mathematical and business logic calculations
 */

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate average of an array of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Calculate median of an array of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Calculate sum of an array of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map(num => Math.pow(num - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount: number, taxRate: number): number {
  return amount * (taxRate / 100);
}

/**
 * Calculate total with tax
 */
export function calculateTotalWithTax(amount: number, taxRate: number): number {
  return amount + calculateTax(amount, taxRate);
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(amount: number, discountPercent: number): number {
  return amount * (discountPercent / 100);
}

/**
 * Calculate price after discount
 */
export function calculateDiscountedPrice(amount: number, discountPercent: number): number {
  return amount - calculateDiscount(amount, discountPercent);
}

/**
 * Calculate compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  frequency: number = 1
): number {
  return principal * Math.pow(1 + rate / (frequency * 100), frequency * time);
}

/**
 * Calculate simple interest
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): number {
  return principal * (rate / 100) * time;
}

/**
 * Calculate tip amount
 */
export function calculateTip(amount: number, tipPercent: number): number {
  return amount * (tipPercent / 100);
}

/**
 * Calculate total with tip
 */
export function calculateTotalWithTip(amount: number, tipPercent: number): number {
  return amount + calculateTip(amount, tipPercent);
}

/**
 * Calculate distance between two points (Pythagorean theorem)
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate area of a circle
 */
export function calculateCircleArea(radius: number): number {
  return Math.PI * Math.pow(radius, 2);
}

/**
 * Calculate area of a rectangle
 */
export function calculateRectangleArea(width: number, height: number): number {
  return width * height;
}

/**
 * Calculate area of a triangle
 */
export function calculateTriangleArea(base: number, height: number): number {
  return (base * height) / 2;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate ROI (Return on Investment)
 */
export function calculateROI(gain: number, cost: number): number {
  if (cost === 0) return 0;
  return ((gain - cost) / cost) * 100;
}

/**
 * Calculate break-even point
 */
export function calculateBreakEven(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): number {
  const contribution = pricePerUnit - variableCostPerUnit;
  if (contribution === 0) return 0;
  return fixedCosts / contribution;
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

/**
 * Calculate markup percentage
 */
export function calculateMarkup(cost: number, sellingPrice: number): number {
  if (cost === 0) return 0;
  return ((sellingPrice - cost) / cost) * 100;
}

/**
 * Calculate weighted average
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length || values.length === 0) return 0;
  const totalWeight = sum(weights);
  if (totalWeight === 0) return 0;
  const weightedSum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
  return weightedSum / totalWeight;
}

/**
 * Calculate growth rate
 */
export function calculateGrowthRate(startValue: number, endValue: number, periods: number): number {
  if (startValue === 0 || periods === 0) return 0;
  return (Math.pow(endValue / startValue, 1 / periods) - 1) * 100;
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, total: number): number {
  return calculatePercentage(conversions, total);
}

/**
 * Calculate churn rate
 */
export function calculateChurnRate(lost: number, total: number): number {
  return calculatePercentage(lost, total);
}

/**
 * Calculate retention rate
 */
export function calculateRetentionRate(retained: number, total: number): number {
  return calculatePercentage(retained, total);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Convert month number to 3-letter abbreviation
 * @param monthNumber - Month number (1-12)
 * @returns Month abbreviation (Jan, Feb, Mar, etc.)
 */
export const getMonthAbbreviation = (monthNumber: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthNumber - 1] || 'Jan';
};

/**
 * Convert month abbreviation to number
 * @param monthAbbr - Month abbreviation (Jan, Feb, Mar, etc.)
 * @returns Month number (1-12)
 */
export const getMonthNumber = (monthAbbr: string): string => {
  const months = {
    'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'May': '5', 'Jun': '6',
    'Jul': '7', 'Aug': '8', 'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  return months[monthAbbr as keyof typeof months] || '1';
};

/**
 * Get current date formatted for transaction form
 * @returns Object with day, month (abbreviated), and year as strings
 */
export const getCurrentDateForTransaction = () => {
  const today = new Date();
  return {
    day: today.getDate().toString(),
    month: getMonthAbbreviation(today.getMonth() + 1),
    year: today.getFullYear().toString(),
  };
};

/**
 * Format date for display
 * @param dateString - Date string in ISO format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = getMonthAbbreviation(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
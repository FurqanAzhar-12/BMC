/**
 * Formats a date string to a readable format.
 * @param {string|Date} dateValue - ISO date string or Date object
 * @returns {string} Formatted date (e.g. "Mar 28, 2026")
 */
export const formatDate = (dateValue) => {
  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date to a relative time string (e.g. "2 hours ago").
 * @param {string|Date} dateValue - ISO date string or Date object
 * @returns {string}
 */
export const formatRelativeTime = (dateValue) => {
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateValue);
};

/**
 * Formats a number with commas.
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  return num.toLocaleString('en-US');
};

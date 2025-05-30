export const formatDateTime = (dateTimeStr: string): string => {
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      return dateTimeStr; // Return original if invalid
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateTimeStr;
  }
};

export const parseNaturalLanguageDate = (dateStr: string): Date => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateMap: { [key: string]: Date } = {
    'today': today,
    'tomorrow': tomorrow,
    'end of week': (() => {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (5 - today.getDay())); // Friday
      endOfWeek.setHours(23, 59, 59, 999);
      return endOfWeek;
    })(),
    'next week': (() => {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    })()
  };

  const lowerStr = dateStr.toLowerCase();
  for (const [key, value] of Object.entries(dateMap)) {
    if (lowerStr.includes(key)) {
      return value;
    }
  }

  // Try to parse as regular date
  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  // Default to end of current day
  today.setHours(23, 59, 59, 999);
  return today;
};

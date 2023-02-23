const parseDate = (date: string, what: 'date' | 'time') => {
  const dateObj = new Date(date);
  const dateStr = dateObj.toDateString();
  const timeStr = dateObj.toLocaleTimeString();

  if (what === 'date') {
    // return date: DD/MM/YYYY
    return `${dateStr.split(' ')[2]} / ${dateStr.split(' ')[1]} / ${
      dateStr.split(' ')[3]
    }`;
  }
  if (what === 'time') {
    // return time: HH:MM:SS
    return `${timeStr.split(' ')[0]}`;
  }

  return null;
};

export default parseDate;

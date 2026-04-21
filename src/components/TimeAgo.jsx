import { useState, useEffect } from 'react';

const getTimeAgoText = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 0) return "только что";
  
  const intervals = [
    { seconds: 31536000, unit: "год", units: "года", units5: "лет" },
    { seconds: 2592000, unit: "месяц", units: "месяца", units5: "месяцев" },
    { seconds: 604800, unit: "неделя", units: "недели", units5: "недель" },
    { seconds: 86400, unit: "день", units: "дня", units5: "дней" },
    { seconds: 3600, unit: "час", units: "часа", units5: "часов" },
    { seconds: 60, unit: "минута", units: "минуты", units5: "минут" }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      let unitText;
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        unitText = interval.units5;
      } else if (lastDigit === 1) {
        unitText = interval.unit;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        unitText = interval.units;
      } else {
        unitText = interval.units5;
      }
      
      return `${count} ${unitText} назад`;
    }
  }
  
  return "только что";
};

const TimeAgo = ({ date, updateInterval = 60000 }) => {
  const [timeAgo, setTimeAgo] = useState(getTimeAgoText(date));

  useEffect(() => {
    // Обновляем время каждые updateInterval миллисекунд (по умолчанию 60 секунд)
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgoText(date));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return <span className="time-ago">{timeAgo}</span>;
};

export default TimeAgo;
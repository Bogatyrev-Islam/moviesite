import { useState, useEffect } from "react";
import { RiCloseLine } from "@remixicon/react";
import TimeAgo from "../TimeAgo";
import "./History.css";

export const addToHistory = (film) => {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  const exists = history.some((_film) => _film.id === film.id);

  if (!exists) {
    film.watched_at = new Date().toISOString();

    history.unshift(film);
    localStorage.setItem("history", JSON.stringify(history));
    return true;
  } else {
    return false;
  }
};

// Функция для удаления фильма из истории
export const removeFromHistory = (filmId) => {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  const updatedHistory = history.filter((film) => film.id !== filmId);
  localStorage.setItem("history", JSON.stringify(updatedHistory));
  return updatedHistory;
};

// Функция для очистки всей истории
export const clearHistory = () => {
  localStorage.removeItem("history");
  return [];
};

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
    setLoading(false);
  }, []);

  // Функция для удаления отдельного фильма
  const handleRemoveFilm = (filmId) => {
    const updatedHistory = removeFromHistory(filmId);
    setHistory(updatedHistory);
    if (updatedHistory.length === 0) {
      setHistory(null);
    }
  };

  // Функция для очистки всей истории
  const handleClearAll = () => {
    if (window.confirm("Вы уверены, что хотите очистить всю историю?")) {
      const emptyHistory = clearHistory();
      setHistory(emptyHistory);
      setHistory(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  // if (!history || history.length === 0) return <div>No history found</div>

  return (
    <>
      {history ? (
        history.map((film) => (
          <li className="movie" key={film.id || film._id || Math.random()}>
            <div className="movie-poster-box">
              <img className="movie-poster" src={film.poster} alt={film.name} />
            </div>
            <div className="movie-info">
              <p className="movie-name">{film.name}</p>
              <small className="movie-details">
                <TimeAgo date={film.watched_at} />
              </small>
            </div>
            <button onClick={() => handleRemoveFilm(film.id)}>
              <RiCloseLine size={20} color="rgba(255, 255, 255, 0.50)"/>
            </button>
          </li>
        ))
      ) : (
        <div></div>
      )}
    </>
  );
}

export default History;

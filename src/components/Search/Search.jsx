import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import History, { addToHistory } from "../History/History";
import MediaCatalog from "../MediaCatalog";
import { useState, useEffect } from "react";
import { IconMicrophone } from "../icons/IconMicrophone";
import { IconFilter } from "../icons/iconFilter";
import "./Search.css";

export default function Search({ onSearch, debouncedQuery, onTotalChange}) {
  const [value, setValue] = useState("");
  const { transcript, listening } = useSpeechRecognition();

  useEffect(() => {
    if (listening) setValue(transcript);
  }, [transcript, listening]);

  useEffect(() => {
    if (!listening && transcript) {
      onSearch?.(transcript);
    }
  }, [listening, transcript, onSearch]);

  const toggleListen = () => {
    listening
      ? SpeechRecognition.stopListening()
      : SpeechRecognition.startListening({ language: "ru-RU" });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const showSearchResults = debouncedQuery && debouncedQuery.trim().length > 0;

  const highlight = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="search">
      <div className="search-input">
        <textarea
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={listening ? "Я слушаю" : "Введите название или описание"}
        />
        <button onClick={toggleListen} title="голосовой ввод">
          {listening ? <IconMicrophone isActive={true} /> : <IconMicrophone />}
        </button>
      </div>
      <div className="search-filters">
        <button><IconFilter/> фильтры</button>
        <ul className="filters-elems">
          <li>сериалы х</li>
          <li>боевик х</li>
          <li>драма х</li>
          <li>2020-2025 х</li>
        </ul>
      </div>
      <ul className="search-result">
        {showSearchResults ? (
          <MediaCatalog name={debouncedQuery} total={onTotalChange}>
            {({ data, loading, error }) => {
              if (loading && !data.length) return (
                <ul className="loading-result">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              )
              if (error && !data.length)
                return <div>Ошибка: {error.message}</div>;

              return data.map((film) => (
                <li
                  className="movie"
                  key={film.id || film._id || Math.random()}
                  onClick={() => addToHistory(film)}
                >
                  <div className="movie-poster-box">
                    <img
                      className="movie-poster"
                      src={film.poster}
                    />
                  </div>
                  <div className="movie-info">
                    <p className="movie-name">
                      {highlight(film.name, debouncedQuery)}
                    </p>
                    <small className="movie-details">
                      {highlight(film.origin_name || film.name, debouncedQuery)}
                      {` —  ${film.year} год`}
                      {` — ${film.type == "film" ? "фильм" : film.type == "series" ? "сериал" : film.type == "cartoon" ? "мультфильм" : film.type == "cartoon-series" ? "мультсериал" : film.type == "anime-film" ? "аниме-фильм" : film.type == "anime-series" ? "аниме-сериал" : film.type}`}
                      {film.seasons
                        ? ` - ${film.seasons.length} сез / ${film.seasons.reduce((total, season) => total + season.episodes.length, 0)} сер (${film.serial_status == "offline" ? "завершён" : "выходит"})`
                        : ""}
                    </small>
                  </div>
                </li>
              ));
            }}
          </MediaCatalog>
        ) : (
          <History />
        )}
      </ul>
    </div>
  );
}

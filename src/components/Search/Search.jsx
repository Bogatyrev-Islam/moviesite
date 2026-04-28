import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import History, { addToHistory } from "../History/History";
import SearchFilters from "../SearchFilters";
import MediaCatalog from "../MediaCatalog";
import { useState, useEffect } from "react";
import { RiMic2Line, RiMic2Fill } from "@remixicon/react";
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
          {!listening ? <RiMic2Line size={20} color="rgba(255, 255, 255, 0.50)"/> : <RiMic2Fill size={20}/>}
        </button>
      </div>
      {/* фильтры поиска */}
      <SearchFilters/>
      <ul className="search-result">
        {showSearchResults ? (
          <MediaCatalog name={debouncedQuery} total={onTotalChange}> 
            {({ data, loading, error }) => {
              if (loading && !data.length) return (
                <ul className="loading-result">
                  <li className="load-movie">
                    <div className="load-poster"></div>
                    <div className="load-info">
                      <div className="load-name"></div>
                      <div className="load-details"></div>
                    </div>
                  </li>
                  <li className="load-movie">
                    <div className="load-poster"></div>
                    <div className="load-info">
                      <div className="load-name"></div>
                      <div className="load-details"></div>
                    </div>
                  </li>
                  <li className="load-movie">
                    <div className="load-poster"></div>
                    <div className="load-info">
                      <div className="load-name"></div>
                      <div className="load-details"></div>
                    </div>
                  </li>
                  <li className="load-movie">
                    <div className="load-poster"></div>
                    <div className="load-info">
                      <div className="load-name"></div>
                      <div className="load-details"></div>
                    </div>
                  </li>
                  <li className="load-movie">
                    <div className="load-poster"></div>
                    <div className="load-info">
                      <div className="load-name"></div>
                      <div className="load-details"></div>
                    </div>
                  </li>
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

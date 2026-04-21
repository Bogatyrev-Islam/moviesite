import axios from "axios";
import { useState, useEffect } from "react";

export default function MediaCatalog({
  page,
  limit,
  sort='-views',
  type,
  genre,
  year,
  name,
  total,
  children,
}) {
  const API_URL = "https://evloevfilmapi.vercel.app/api/list";
  const API_TOKEN = "3794a7638b5863cc60d7b2b9274fa32e";
  const AI_API_KEY = "pk_v1XyycSNpUA1IiIn";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiTrigger, setAiTrigger] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get(API_URL, {
        params: {
          token: API_TOKEN,
          page: page,
          limit: limit,
          sort: sort,
          type: type,
          genre: genre,
          year: year,
          name: name,
        },
      })
      .then((response) => {
        setData(response.data.results);
        total(response.data.total);

        if (response.data.total === 0 && name) {
          setAiTrigger(true);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [page, limit, sort, type, genre, year, name]);

  useEffect(() => {
    if (!aiTrigger) return;

    axios
      .post(
        "https://gen.pollinations.ai/v1/chat/completions",
        {
          model: "openai",
          messages: [
            {
              role: "user",
              content: `Верни ТОЛЬКО JSON массив названий фильмов/сериалов/аниме/мультфильмов/мульт-сериалов на АНГЛИЙСКОМ языке, в соответствии c описанием. В описании может быть предоставлены имена персонажей, актеров, сюжет, продолжительность и множество других моментов. Описание: ${name}`,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_API_KEY}`,
          },
        },
      )
      .then((aiResponse) => {
        const aiData = JSON.parse(aiResponse.data.choices[0].message.content);

        const promises = aiData.slice(0, 20).map((movieName) =>
          axios.get(API_URL, {
            params: {
              token: API_TOKEN,
              name: movieName,
            },
          }),
        );

        return Promise.all(promises);
      })
      .then((results) => {
        const allMovies = results.flatMap((res) => res.data.results || []);
        setData(allMovies);
        total(allMovies.length);
        setLoading(false);
        setAiTrigger(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setAiTrigger(false);
      });
  }, [aiTrigger]);

  return children({ data, loading, error });
}

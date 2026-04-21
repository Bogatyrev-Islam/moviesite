import axios from "axios";
import { useState, useEffect } from "react";

export default function Comments({ currentMovie=1 }) {
  const COMMENTS_API = "https://91e0565ae8fe4cfe.mokky.dev/comments";

  const [userName, setUserName] = useState("");
  const [textComm, setTextComm] = useState("");
  const [answerTo, setAnswerTo] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${COMMENTS_API}?currentMovie=${currentMovie}`)
      .then((response) => {
        setComments(response.data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [currentMovie]);

  function sendComment() {
    if (!userName.trim() || !textComm.trim()) {
      return;
    };

    const newComment = {
      id: "",
      currentMovie: currentMovie,
      answerTo: answerTo,
      userName: userName,
      text: textComm,
      createdAt: new Date().toISOString(),
    };

    axios
      .post(COMMENTS_API, newComment)
      .then((response) => {
        setComments([response.data, ...comments]);
        setTextComm("");
        setAnswerTo(null);
        setRecipientName(null);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <>
      <br />
      <br />
      {recipientName ? <p>{recipientName} <button onClick={()=>{setAnswerTo(null); setRecipientName(null)}}>x</button></p> : ""}
      <input
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
        type="text"
        placeholder="Ваше имя"
        required
      />
      <br />
      <textarea
        onChange={(e) => setTextComm(e.target.value)}
        value={textComm}
        placeholder="Комментарий"
        required
      />

      <button onClick={sendComment}>✔️</button>
      <h3>Комментарии:</h3>
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>Пока нет комментариев</p>
        ) : (
          comments.map((comment) => {
            if (!comment.answerTo) {
              return (
                <div key={comment.id}>
                  <div className="comment">
                    <strong>{comment.userName}:</strong> {comment.text}
                    <small>
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                    <small
                      onClick={() => {
                        setAnswerTo(comment.id);
                        setRecipientName(comment.userName);
                      }}
                    >
                      🗨️
                      
                    </small>
                  </div>

                  <ul>
                    {comments
                      .filter((reply) => reply.answerTo === comment.id)
                      .map((reply) => (
                        <li key={reply.id}>
                          <strong>{reply.userName}:</strong> {reply.text}
                          <small>
                            {new Date(reply.createdAt).toLocaleString()}
                          </small>
                        </li>
                      ))}
                  </ul>
                </div>
              );
            }
            return null;
          })
        )}
      </div>
    </>
  );
}

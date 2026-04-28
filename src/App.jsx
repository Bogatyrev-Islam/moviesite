import { useState, useEffect } from "react";
import Search from "./components/Search/Search";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  return (
    <>
      <Search 
        onSearch={setSearchQuery}
        debouncedQuery={debouncedQuery}
        onTotalChange={setTotal}
      />
      {/* <p>{total}</p> */}
      {/* <Comments/> */}
    </>
  );
}

export default App;
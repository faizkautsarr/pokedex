import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PokeCard from "./components/PokeCard";

export default function App() {
  const [pokes, setPokes] = useState([]);
  const [selectedPokeUrl, setSelectedPokeUrl] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // add delay, to make sure image is loaded correctly before scrolling
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function getPokes() {
    setIsLoading(true);

    await sleep(1000);
    await axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
      .then((response) => {
        setPokes(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        window.addEventListener("scroll", handleScroll);
        setIsLoading(false);
      });
  }

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } =
      document.documentElement || document.body;

    const reachedBottom = scrollTop + clientHeight === scrollHeight;
    setIsAtBottom(reachedBottom);
  }, []);

  async function getMorePokes() {
    // get more pockemons in infinite scroll condition

    // remove listener first, to make sure only one listener is added
    window.removeEventListener("scroll", handleScroll);
    setIsLoading(true);

    await sleep(1000);
    await axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
      .then((response) => {
        setPokes([...pokes, ...response.data.results]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(async () => {
        window.addEventListener("scroll", handleScroll);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (isAtBottom) {
      setOffset(offset + 20);
    }
  }, [isAtBottom]);

  useEffect(() => {
    if (offset > 0) {
      getMorePokes();
    }
  }, [offset]);

  useEffect(() => {
    getPokes();
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <div
          className="absolute-center"
          style={{
            fontSize: "12px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            style={{ marginBottom: "8px" }}
            width={32}
            height={32}
            src={
              "https://i.pinimg.com/originals/32/eb/23/32eb230b326ee3c76e64f619a06f6ebb.png"
            }
          ></img>
          <div> loading more...</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: "8px", color: "white" }}>
            {selectedPokeUrl}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "4px",
              fontSize: "10px",
              marginBottom: "24px",
              color: "white",
            }}
          >
            <img
              style={{ marginRight: "8px" }}
              width={32}
              height={32}
              src={
                "https://i.pinimg.com/originals/32/eb/23/32eb230b326ee3c76e64f619a06f6ebb.png"
              }
            ></img>
            <div> Pokédex by @faizkautsarr</div>
          </div>

          {pokes.map((poke, id) => (
            <PokeCard
              id={id + 1}
              name={poke.name}
              imageUrl={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                id + 1
              }.png`}
              handeClickPokeCard={() => setSelectedPokeUrl(poke.url)}
            ></PokeCard>
          ))}
        </>
      )}
    </div>
  );
}

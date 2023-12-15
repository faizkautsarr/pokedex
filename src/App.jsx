import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PokeCard from "./components/PokeCard";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [pokes, setPokes] = useState([]);
  const [selectedPokeUrl, setSelectedPokeUrl] = useState("");
  const [selectedPokeDetail, setSelectedPokeDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // add delay, to make sure image is loaded correctly before scrolling
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function setSelectedPoke(url) {
    setSelectedPokeUrl(url);
  }

  function padWithZeros(number) {
    return String(number).padStart(3, "0");
  }

  const handleOverlayClick = (event) => {
    // Close the modal only if the click is on the overlay and not on the modal content
    if (
      event.target.classList.contains("modal-overlay") &&
      !event.target.closest(".modal")
    ) {
      closeModal();
    }
  };

  async function getPokeDetail() {
    setIsLoading(true);
    await axios
      .get(selectedPokeUrl)
      .then((response) => {
        console.log(response.data);
        setSelectedPokeDetail(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    openModal();
  }

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

  const openModal = () => {
    document.body.style.overflow = "hidden";
    setShowModal(true);
  };

  const closeModal = () => {
    // need to reset, to trigger changes on useEffect
    setSelectedPokeUrl("");
    document.body.style.overflow = "visible";
    setShowModal(false);
  };
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
    if (selectedPokeUrl != "") {
      getPokeDetail();
    }
  }, [selectedPokeUrl]);

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
        <div>
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
              key={id}
              id={id + 1}
              name={poke.name}
              imageUrl={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${padWithZeros(
                id + 1
              )}.png`}
              handeClickPokeCard={() => setSelectedPoke(poke.url)}
            ></PokeCard>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <div
              style={{
                fontSize: "20px",
              }}
            >
              {selectedPokeDetail.name.charAt(0).toUpperCase() +
                selectedPokeDetail.name.slice(1)}
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: "1000",
                marginBottom: "4px",
                color: "#616161",
              }}
            >
              #0{padWithZeros(selectedPokeDetail.order)}
            </div>

            <img
              width={100}
              src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${padWithZeros(
                selectedPokeDetail.order
              )}.png`}
            ></img>

            {selectedPokeDetail.stats.map((stat, id) => (
              <div
                key={id}
                style={{
                  alignSelf: "flex-start",
                }}
              >
                {stat.stat.name}: {stat.base_stat}
              </div>
            ))}

            {selectedPokeDetail.types.map((type, id) => (
              <div
                key={id}
                style={{
                  alignSelf: "flex-start",
                }}
              >
                {type.type.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

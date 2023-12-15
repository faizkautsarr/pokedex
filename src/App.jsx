import { useState, useEffect, useCallback } from "react";
import { getTypeColor, padWithZeros, sleep } from "./utils/commons";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import PokeDetail from "./components/PokeDetail";
import Modal from "./components/Modal";
import Loader from "./components/Loader";
import "./assets/css/app.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [pokes, setPokes] = useState([]);
  const [selectedPokeUrl, setSelectedPokeUrl] = useState("");
  const [selectedPokeDetail, setSelectedPokeDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  async function setSelectedPoke(url) {
    setSelectedPokeUrl(url);
  }

  const handleOverlayClick = (event) => {
    // Close the modal only if the click is on the overlay and not on the modal content
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  async function getPokeDetail() {
    setIsLoading(true);
    await axios
      .get(selectedPokeUrl)
      .then((response) => {
        setSelectedPokeDetail(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(async () => {
        setIsLoading(false);
      });

    openModal();
  }

  async function getPokes() {
    setIsLoading(true);

    await axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
      .then((response) => {
        setPokes(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(async () => {
        await sleep(1000);
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
        await sleep(1000);
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
        <Loader />
      ) : (
        <div>
          <div className="author-wrapper">
            <img
              style={{ marginRight: "8px" }}
              width={32}
              height={32}
              src={
                "https://i.pinimg.com/originals/32/eb/23/32eb230b326ee3c76e64f619a06f6ebb.png"
              }
            ></img>
            <div> Pokédex by @faizkautsarr.</div>
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
        <Modal closeModal={closeModal} handleOverlayClick={handleOverlayClick}>
          <PokeDetail selectedPokeDetail={selectedPokeDetail} />
        </Modal>
      )}
    </div>
  );
}

import "../assets/css/pokeCard.css";
export default function PokeCard({ id, name, imageUrl, handeClickPokeCard }) {
  const handleClick = () => {
    handeClickPokeCard(id);
  };
  return (
    <div onClick={handleClick} className="poke-card-container">
      <img src={imageUrl} height={30}></img>

      <div
        style={{
          fontSize: "10px",
          marginLeft: "4px",
        }}
      >
        {name}
      </div>
    </div>
  );
}

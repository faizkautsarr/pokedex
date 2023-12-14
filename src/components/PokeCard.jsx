export default function PokeCard({ id, name, imageUrl, handeClickPokeCard }) {
  const handleClick = () => {
    handeClickPokeCard(id);
  };
  return (
    <div onClick={handleClick} className="poke-card-container">
      <img src={imageUrl} width={"50px"}></img>

      <div
        style={{
          padding: 0,
          margin: 0,
          fontSize: "10px",
          flexGrow: 0,
        }}
      >
        {name}
      </div>
    </div>
  );
}

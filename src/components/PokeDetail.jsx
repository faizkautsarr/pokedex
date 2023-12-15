import { getTypeColor, padWithZeros } from "../utils/commons";
import "../assets/css/pokeDetail.css";
export default function PokeDetail({ selectedPokeDetail }) {
  const handleClick = () => {
    handeClickPokeCard(id);
  };
  return (
    <>
      <div className="poke-detail-name">
        {selectedPokeDetail.name.charAt(0).toUpperCase() +
          selectedPokeDetail.name.slice(1)}
      </div>

      <div className="poke-detail-id">
        #0{padWithZeros(selectedPokeDetail.order)}
      </div>

      <img
        width={100}
        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${padWithZeros(
          selectedPokeDetail.id
        )}.png`}
      ></img>

      <div className="poke-detail-info-wrapper">
        <div className="poke-detail-info-container">
          <div style={{ fontSize: "10px" }}>height: </div>
          <div>{selectedPokeDetail.height / 10} m</div>
        </div>

        <div className="poke-detail-info-container">
          <div style={{ fontSize: "10px" }}>weight: </div>
          <div>{selectedPokeDetail.weight / 10} kg</div>
        </div>

        <div className="poke-detail-info-container">
          <div style={{ fontSize: "10px" }}>base exp: </div>
          <div>{selectedPokeDetail.base_experience} exp</div>
        </div>
      </div>

      <div className="poke-detail-section-wrapper">
        {selectedPokeDetail.stats.map((stat, id) => (
          <div key={id} className="poke-detail-stat-container">
            <div
              className="poke-detail-stat-bar"
              style={{
                width: `${(stat.base_stat / 255) * 130}px`,
              }}
            ></div>

            <div className="poke-detail-stat-detail">
              <div> {stat.stat.name} :</div>
              <div> {stat.base_stat} </div>
              <div> /255</div>
            </div>
          </div>
        ))}
      </div>

      <div className="poke-detail-section-title">Type:</div>
      <div className="poke-detail-section-wrapper">
        {selectedPokeDetail.types.map((type, id) => (
          <div
            key={id}
            className="poke-detail-type-wrapper"
            style={{
              backgroundColor: `${getTypeColor(type.type.name)}`,
            }}
          >
            {type.type.name}
          </div>
        ))}
      </div>

      <div className="poke-detail-section-title">Ability:</div>
      <div className="poke-detail-section-wrapper">
        {selectedPokeDetail.abilities.map((ability, id) => (
          <div key={id} className="poke-detail-type-wrapper">
            {ability.ability.name}
          </div>
        ))}
      </div>
    </>
  );
}

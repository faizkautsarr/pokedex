import "../assets/css/loader.css";
export default function Loader() {
  return (
    <div className="absolute-center loader-wrapper">
      <img
        style={{ marginBottom: "8px" }}
        width={32}
        height={32}
        src={
          "https://i.pinimg.com/originals/32/eb/23/32eb230b326ee3c76e64f619a06f6ebb.png"
        }
      ></img>
      <div> loading data...</div>
    </div>
  );
}

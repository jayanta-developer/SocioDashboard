import "./style.css";
import dropIocn from "../../assets/Images/ArrowGray.png";

export const DropDown = ({ drop, setDrop, dropVal, setDropVal, dropList }) => {
  return (
    <>
      <div className="dropDwon" onClick={() => setDrop(!drop)}>
        <p className="dropText">{dropVal}</p>
        <img src={dropIocn} className="dropIcon" />
        <div className={drop ? "dropListBox dropListBoxActive" : "dropListBox"}>
          {dropList?.map((el, i) => (
            <div key={i} className="dropItem" onClick={() => setDropVal(el)}>
              <p>{el}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export const Reloader = (del) => {
  setTimeout(() => {
    window.location.reload();
  }, del)
}
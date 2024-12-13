import "./style.css";
import dropIocn from "../../assets/Images/ArrowGray.png";

import { ToastContainer, toast } from 'react-toastify';


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



export const Notification = (type, message = {}) => {
  // Default toast configuration
  const defaultOptions = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000, // Auto-close after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // Merge user-provided options
  };

  switch (type) {
    case "success":
      toast.success(message, defaultOptions);
      break;
    case "error":
      toast.error(message, defaultOptions);
      break;
    case "warning":
      toast.warn(message, defaultOptions);
      break;
    default:
      // Default fallback for unknown type
      toast.info("Notification type not specified or invalid.", defaultOptions);
  }
};

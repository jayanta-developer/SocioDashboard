import React, { useState, useEffect } from 'react'
import "./style.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//components
import Properties from '../../Pages/Properties';
import { Notification } from "../../Components/Tools";

//images
import report from "../../assets/Images/reports.svg";
import analytics from "../../assets/Images/analytics.svg";
import muneIcon from "../../assets/Images/menuIcon.svg";
import CLogo from "../../assets/Images/SocioStaysIcon.png";
import PropertyIcon from "../../assets/Images/property.png";

export default function Dashboard() {
  const localIsLog = localStorage.getItem("localIsLog");
  const localLogDate = localStorage.getItem("localLogDate");
  const [isLogIng, setIsLogIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [logVal, setLogVal] = useState({});
  const [authErr, setAuthErr] = useState(false)

  const AdminEmails = [
    "gopalduttvashisht@gmail.com",
    "hello@goscale.in",
    "abhigupta1602@gmail.com",
    "jd"
  ]
  const PDW = "1234";

  const currentDate = new Date();
  const handleLogValu = (e) => {
    const { name, value } = e.target;
    setLogVal(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleCheckLog = () => {
    if (AdminEmails.includes(logVal?.email) && PDW === logVal?.password) {
      setAuthErr(false)
      setIsLogIn(true)
      localStorage.setItem("localIsLog", true);
      localStorage.setItem("localLogDate", currentDate.toLocaleDateString());
      Notification("Login Successfully", "success")
    } else {
      Notification("Authorization failed", "error")
      setAuthErr(true)
    }
  }
  console.log(authErr);


  document.addEventListener("keydown", (e) => e?.key === "Enter" ? handleCheckLog() : null)

  useEffect(() => {
    if (localIsLog) {
      if (currentDate.toLocaleDateString() === localLogDate) {
        setIsLogIn(true)
      } else {
        // localStorage.getItem("localIsLog", false);
      }
    }
  }, [])


  return (
    <>
      <ToastContainer />

      {
        !isLogIng ?
          <div className='adminLogBox'>
            <div className="mainAdminLogBox">
              <h3>Admin Authentication</h3>

              <div className="PropInputBox">
                <input type="email" name='email' placeholder='Enter Email' onChange={handleLogValu} value={logVal.email} />
              </div>

              <div className="PropInputBox">
                <input type="password" name='password' placeholder='Enter your password' onChange={handleLogValu} value={logVal?.password} />
              </div>
              <p className={authErr ? 'errMsg errMsgActive' : "errMsg"}>Authorization failed!</p>

              <div className="UpdateBtn" onClick={handleCheckLog}>
                <p>LOGIN</p>
              </div>
            </div>
          </div>
          :
          <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
              <div className="ClogoBox">
                <img src={CLogo} />
                <p className='cLogo'>{isCollapsed ? null : "Admin"} </p>
              </div>

              <nav className='sideMenuItemList'>
                <div onClick={() => setActiveMenu(0)} className="sideMenuItem">
                  <img src={PropertyIcon} alt="" />
                  <p style={{ display: isCollapsed ? "none" : "block" }}>Properties</p>
                </div>
                <div onClick={() => setActiveMenu(1)} className="sideMenuItem">
                  <img src={report} alt="" />
                  <p style={{ display: isCollapsed ? "none" : "block" }}>Blogs</p>
                </div>
                <div onClick={() => setActiveMenu(2)} className="sideMenuItem">
                  <img src={analytics} alt="" />
                  <p style={{ display: isCollapsed ? "none" : "block" }}>Analytics</p>
                </div>
              </nav>
            </aside>
            <main className="main-content">
              <div className="mainSectionNavBar">
                <img src={muneIcon} className='haumIcon' alt="" onClick={() => setIsCollapsed(!isCollapsed)} />
              </div>
              <Properties activeMenu={activeMenu} />
            </main>
          </div>
      }
    </>

  )
}

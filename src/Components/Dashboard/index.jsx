import React, { useState } from 'react'
import "./style.css"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

//components
import Properties from '../../Pages/Properties';

//images
import userIcon from "../../assets/Images/user.svg";
import report from "../../assets/Images/reports.svg";
import analytics from "../../assets/Images/analytics.svg"
import muneIcon from "../../assets/Images/menuIcon.svg"
import CLogo from "../../assets/Images/SocioStaysIcon.png"

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0)


  return (
    <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="ClogoBox">
          <img src={CLogo} />
          <p className='cLogo'>{isCollapsed ? null : "Admin"} </p>
        </div>

        <nav className='sideMenuItemList'>
          <div onClick={() => setActiveMenu(0)} className="sideMenuItem">
            <img src={userIcon} alt="" />
            <p style={{ display: isCollapsed ? "none" : "block" }}>Properties</p>
          </div>
          <div onClick={() => setActiveMenu(1)} className="sideMenuItem">
            <img src={report} alt="" />
            <p style={{ display: isCollapsed ? "none" : "block" }}>Reports</p>
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
  )
}

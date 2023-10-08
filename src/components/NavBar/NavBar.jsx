import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Navbar() {
    return (
        <div>
            <header className="navbar-header">
                <div className="menu-icon">
                  <Link to="/" className="menu-link">JobFinder</Link>
                </div>
                <div className="logo"></div>
                <ConnectButton  className="connect-button" chainStatus="none" showBalance={false}/>
            </header>
        </div>
    );
}

export default Navbar;
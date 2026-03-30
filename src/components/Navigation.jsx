import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar">
      <NavLink 
        to="/" 
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        end
      >
        Curriculum Vitae
      </NavLink>
      <NavLink 
        to="/projects" 
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Projects
      </NavLink>
    </nav>
  );
};

export default Navigation;

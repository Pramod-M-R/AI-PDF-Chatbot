import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Menu, LogOut, UserCircle } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ user, theme, onToggleTheme, onMenuClick, documentTitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        {documentTitle && (
          <div className="topbar__doc-title">
            <span className="topbar__doc-dot" />
            {documentTitle}
          </div>
        )}
      </div>

      <div className="topbar__right">
        <button
          className="topbar__theme-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="topbar__profile" ref={menuRef}>
          <button className="topbar__profile-btn" onClick={() => setMenuOpen((v) => !v)}>
            <span className="topbar__avatar">{user.initials}</span>
            <span className="topbar__profile-name">{user.name}</span>
            <ChevronDown size={15} className={`topbar__chevron ${menuOpen ? 'topbar__chevron--open' : ''}`} />
          </button>

          {menuOpen && (
            <div className="topbar__dropdown">
              <div className="topbar__dropdown-head">
                <span className="topbar__avatar topbar__avatar--lg">{user.initials}</span>
                <div>
                  <p className="topbar__dropdown-name">{user.name}</p>
                  <p className="topbar__dropdown-role">{user.role}</p>
                </div>
              </div>
              <button className="topbar__dropdown-item">
                <UserCircle size={16} />
                View profile
              </button>
              <button className="topbar__dropdown-item topbar__dropdown-item--danger">
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

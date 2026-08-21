import React from "react";

export function ShortcutsFooter() {
  return (
    <footer className="shortcuts-bar" aria-label="Keyboard shortcuts reference">
      <div className="shortcut-item">
        <kbd className="key-badge">SPACE</kbd>
        <span>TOGGLE</span>
      </div>
      <div className="shortcut-item">
        <kbd className="key-badge">R</kbd>
        <span>RESET</span>
      </div>
      <div className="shortcut-item">
        <kbd className="key-badge">E</kbd>
        <span>EDIT</span>
      </div>
    </footer>
  );
}

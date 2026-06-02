import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ProfileMenu = ({ onChangePasswordClick, onDeleteAccountClick, onUpload, onLoginClick }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      setIsOpen(false);
    }
  };

  const initials = user ? user.charAt(0).toUpperCase() : undefined;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-surface-elevated/80 border border-border-default hover:border-primary-DEFAULT flex items-center justify-center text-text-primary font-bold text-sm transition-all cursor-pointer"
      >
        {isLoggedIn ? (
          initials
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
            <circle cx="9" cy="6" r="3" />
            <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-card backdrop-blur-xl border border-border-subtle rounded-xl shadow-2xl z-[900] animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoggedIn ? (
            <>
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-text-primary text-sm font-medium truncate">{user}</p>
              </div>
              <div className="py-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2.5 text-left text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 text-sm transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-DEFAULT">
                    <path d="M8 2v9M4 7l4 4 4-4" />
                    <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
                  </svg>
                  Upload Histórico
                </button>

                <button
                  onClick={() => { onChangePasswordClick(); setIsOpen(false); }}
                  className="w-full px-4 py-2.5 text-left text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 text-sm transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary-DEFAULT">
                    <rect x="3" y="7" width="10" height="7" rx="1" />
                    <path d="M5 7V4a3 3 0 016 0v3" />
                  </svg>
                  Alterar Senha
                </button>

                <button
                  onClick={() => { onDeleteAccountClick(); setIsOpen(false); }}
                  className="w-full px-4 py-2.5 text-left text-semantic-error hover:text-semantic-error/80 hover:bg-semantic-error/5 text-sm transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 4h12M5 4V2a1 1 0 011-1h4a1 1 0 011 1v2M13 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4" />
                    <path d="M6 7v5M10 7v5" />
                  </svg>
                  Deletar Conta
                </button>

                <div className="border-t border-border-subtle my-1" />

                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full px-4 py-2.5 text-left text-semantic-error hover:text-semantic-error/80 hover:bg-semantic-error/5 text-sm transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" />
                  </svg>
                  Sair
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <button
                onClick={() => { onLoginClick(); setIsOpen(false); }}
                className="w-full px-4 py-3 text-left text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 text-sm transition-colors flex items-center gap-3 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-DEFAULT">
                  <circle cx="8" cy="5" r="2.5" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                </svg>
                Fazer Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

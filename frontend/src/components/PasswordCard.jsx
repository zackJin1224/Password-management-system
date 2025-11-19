import { useState } from 'react';
import { useMasterKey } from '../context/MasterKeyContext';
import { decryptPassword } from '../utils/crypto';
import '../styles/PasswordCard.css';

function PasswordCard({ password, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [decrypted, setDecrypted] = useState('');
  const { masterKey } = useMasterKey();

  const handleTogglePassword = () => {
    if (!showPassword) {
      const decryptedPassword = decryptPassword(
        password.encrypted_password,
        masterKey
      );
      setDecrypted(decryptedPassword);
    }
    setShowPassword(!showPassword);
  };
  const handleCopy = () => {
    const passwordToCopy = decryptPassword(
      password.encrypted_password,
      masterKey
    );
    navigator.clipboard.writeText(passwordToCopy);
    alert('Password copied to clipboard!');
  };
  return (
    <div className="password-card">
      <div className="password-header">
        <h3>{password.website}</h3>
        <div className="password-actions">
          <button onClick={onEdit} className="btn-icon" title="Edit">
            ✏️
          </button>
          <button onClick={onDelete} className="btn-icon" title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className="password-details">
        {password.notes && (
          <div className="password-field">
            <span className="field-label">Notes:</span>
            <span>{password.notes}</span>
          </div>
        )}
        {password.username && (
          <div className="password-field">
            <span className="field-label">Username:</span>
            <span>{password.username}</span>
          </div>
        )}

        <div className="password-field">
          <span className="field-label">Password:</span>
          <div className="password-value">
            <span className="password-text">
              {showPassword ? decrypted : '••••••••'}
            </span>
            <button onClick={handleTogglePassword} className="btn-icon">
              {showPassword ? '🙈' : '👁️'}
            </button>
            <button onClick={handleCopy} className="btn-icon" title="Copy">
              📋
            </button>
          </div>
        </div>
      </div>
      <div className="password-footer">
        <span className="password-date">
          Created at:{' '}
          {new Date(password.created_at).toLocaleDateString('zh-CN')}
        </span>
      </div>
    </div>
  );
}

export default PasswordCard;

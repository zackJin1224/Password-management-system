import { useState, useEffect } from 'react';
import { useMasterKey } from '../context/MasterKeyContext';
import { encryptPassword, generatePassword } from '../utils/crypto';
import '../styles/PasswordForm.css';

function PasswordForm({ password, onSubmit, onCancel }) {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { masterKey } = useMasterKey();
  // If in edit mode, populate existing data
  useEffect(() => {
    if (password) {
      setSiteName(password.site_name || '');
      setSiteUrl(password.site_url || '');
      setUsername(password.username || '');
      // Note: Password is empty during editing; requires user re-entry or use of original password
    }
  }, [password]);
const handleGeneratePassword = () => {
    const generated = generatePassword(16);
    setPasswordValue(generated);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  setLoading( true );
  // Validation
    if (!siteName) {
      setError('Website name cannot be empty');
      setLoading(false);
      return;
    }

    if (!passwordValue && !password) {
      setError('Password cannot be empty');
      setLoading(false);
      return;
    }
  // Encrypted Password
    let encryptedPassword;
    if (passwordValue) {
      encryptedPassword = encryptPassword(passwordValue, masterKey);
    } else {
      // Use original password if no new password is entered during editing
      encryptedPassword = password.encrypted_password;
    }

    const passwordData = {
      site_name: siteName,
      site_url: siteUrl || null,
      username: username || null,
      encrypted_password: encryptedPassword
    };

    await onSubmit(passwordData);
    setLoading(false);
};
  return (
    <div className="modal-overlay">
      <div className="modal-content password-form-modal">
        <h2>{password ? 'Edit Password' : 'Add New Password'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Website Name *</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Example: Gmail"
              disabled={loading}
            />
          </div>
    <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Username/Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@example.com"
              disabled={loading}
            />
          </div>
<div className="form-group">
            <label>Password {password && '(Leave blank to keep current)'}</label>
            <div className="password-input-group">
              <input
                type="text"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder={password ? 'Enter a new password or leave blank' : 'Enter password'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="btn-generate"
                disabled={loading}
              >
                Generate
              </button>
            </div>
          </div>
    <div className="modal-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordForm;
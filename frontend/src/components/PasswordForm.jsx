import { useState, useEffect } from 'react';
import { useMasterKey } from '../context/MasterKeyContext';
import { encryptPassword, generatePassword } from '../utils/crypto';
import '../styles/PasswordForm.css';

function PasswordForm({ password, onSubmit, onCancel }) {
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [username, setUsername] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { masterKey } = useMasterKey();
  // If in edit mode, populate existing data
  useEffect(() => {
    if (password) {
      setWebsite(password.website || '');
      setNotes(password.notes || '');
      setUsername(password.username || '');
    }
  }, [password]);
  const handleGeneratePassword = () => {
    const generated = generatePassword(16);
    setPasswordValue(generated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Validation
    if (!website) {
      setError('Website cannot be empty');
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
      website: website,
      username: username || null,
      encrypted_password: encryptedPassword,
      notes: notes || null,
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
            <label>Website *</label>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="Example: gmail.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Username/Email</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="user@example.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>
              Password {password && '(Leave blank to keep current)'}
            </label>
            <div className="password-input-group">
              <input
                type="text"
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                placeholder={
                  password
                    ? 'Enter a new password or leave blank'
                    : 'Enter password'
                }
                disabled={loading}
              />
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  disabled={loading}
                  rows="3"
                />
              </div>
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
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional notes..."
              disabled={loading}
              rows="3"
            />
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

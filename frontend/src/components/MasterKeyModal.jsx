import { useState } from 'react';
import { useMasterKey } from '../context/MasterKeyContext';
import '../styles/MasterKeyModal.css';

function MasterKeyModal({ onClose }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const { setKey: setMasterKey } = useMasterKey();

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!key) {
      setError('Please enter the master key');
      return;
    }

    if (key.length < 8) {
      setError('Master key must be at least 8 characters long');
      return;
    }

    setMasterKey(key);
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Master Key</h2>
        <p className="modal-description">
          The master key is used to encrypt your password data. Remember your
          master key—we do not store it.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Master Key</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="At least 8 characters"
              autoFocus
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Confirm
            </button>
          </div>
        </form>

        <div className="modal-warning">
          ⚠️ Warning: If you forget your master key, you will be unable to
          decrypt your saved passwords!
        </div>
      </div>
    </div>
  );
}
export default MasterKeyModal;
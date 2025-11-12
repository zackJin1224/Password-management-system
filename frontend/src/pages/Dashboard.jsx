import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMasterKey } from '../context/MasterKeyContext';
import { useNavigate } from 'react-router-dom';
import { getAllPasswords, addPassword, updatePassword, deletePassword } from '../api/passwordApi';
import MasterKeyModal from '../components/MasterKeyModal';
import PasswordCard from '../components/PasswordCard';
import PasswordForm from '../components/PasswordForm';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const { isKeySet, clearKey } = useMasterKey();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);

  // check if use master key or not
  useEffect(() => {
    if (!isKeySet) {
      setShowKeyModal(true);
    } else {
      loadPasswords();
    }
  }, [isKeySet]);

  // load passwords list
  const loadPasswords = async () => {
    setLoading(true);
    const result = await getAllPasswords();
    if (result.success) {
      setPasswords(result.data);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  // Process logout
  const handleLogout = () => {
    clearKey();
    logout();
    navigate('/login');
  };

  // Processing password addition
  const handleAddPassword = async passwordData => {
    const result = await addPassword(passwordData);
    if (result.success) {
      setShowForm(false);
      loadPasswords();
      alert('Password added');
    } else {
      alert(result.error);
    }
  };

  // Edit Password Management
  const handleEditPassword = async passwordData => {
    const result = await updatePassword(editingPassword.id, passwordData);
    if (result.success) {
      setShowForm(false);
      setEditingPassword(null);
      loadPasswords();
      alert('Password updated');
    } else {
      alert(result.error);
    }
  };

  // Processing Password Deletion
  const handleDeletePassword = async id => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return;
    }

    const result = await deletePassword(id);
    if (result.success) {
      loadPasswords();
      alert('Password deleted');
    } else {
      alert(result.error);
    }
  };

  // Open the edition form
  const openEditForm = password => {
    setEditingPassword(password);
    setShowForm(true);
  };

  // Close Form
  const closeForm = () => {
    setShowForm(false);
    setEditingPassword(null);
  };

  // Master key setup complete
  const handleKeySet = () => {
    setShowKeyModal(false);
    loadPasswords();
  };

  if (showKeyModal) {
    return <MasterKeyModal onClose={handleKeySet} />;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Password Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Sign out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <h2>My passwords</h2>
          <button onClick={() => setShowForm(true)} className="btn-add">
            ➕ Add passwords
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : passwords.length === 0 ? (
          <div className="empty-state">
            <p>No passwords have been saved yet.</p>
            <p>Click “Add Password” to get started!</p>
          </div>
        ) : (
          <div className="passwords-grid">
            {passwords.map(password => (
              <PasswordCard
                key={password.id}
                password={password}
                onEdit={() => openEditForm(password)}
                onDelete={() => handleDeletePassword(password.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <PasswordForm
          password={editingPassword}
          onSubmit={editingPassword ? handleEditPassword : handleAddPassword}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

export default Dashboard;

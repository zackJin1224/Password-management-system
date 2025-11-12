import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Password Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Log Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome to your password manager!</h2>
          <p>All your saved passwords will be displayed here</p>
          <p>
            We'll add full password management functionality in subsequent steps
          </p>
        </div>
      </main>
    </div>
  );
}
export default Dashboard;
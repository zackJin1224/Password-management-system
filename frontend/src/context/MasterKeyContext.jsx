/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
const MasterKeyContext = createContext(null);

export const MasterKeyProvider = ({ children }) => {
  const [masterKey, setMasterKey] = useState(null);
  const [isKeySet, setIsKeySet] = useState(false);

  // Check if master key exists in sessionStorage
  useEffect(() => {
    const savedKey = sessionStorage.getItem('masterKey');
    if (savedKey) {
      setMasterKey(savedKey);
      setIsKeySet(true);
    }
  }, [] );
  // Set master key
const setKey = (key) => {
  setMasterKey(key);
  setIsKeySet(true);
  // Save to sessionStorage (valid only for current session)
  sessionStorage.setItem('masterKey', key);
};

// Clear master key
  const clearKey = () => {
    setMasterKey(null);
    setIsKeySet(false);
    sessionStorage.removeItem('masterKey');
  };

  const value = {
    masterKey,
    isKeySet,
    setKey,
    clearKey
  };

  return (
    <MasterKeyContext.Provider value={value}>
      {children}
    </MasterKeyContext.Provider>
  );
};

export const useMasterKey = () => {
  const context = useContext(MasterKeyContext);
  if (!context) {
    throw new Error('useMasterKey must be used inside MasterKeyProvider');
  }
  return context;
};
export default MasterKeyContext;
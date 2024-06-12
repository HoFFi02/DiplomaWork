import React from 'react';

function HomeForm({ user, onLogout }) {
  console.log('Wartość user w HomeForm:', user); // Dodajemy console loga aby sprawdzić wartość user

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.username}</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default HomeForm;

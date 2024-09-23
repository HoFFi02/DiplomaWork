import React from 'react';
import ShoppingListForm from '../components/Shopping_list/Shopping_listForm';
import '../css/shoppingList.css';
import Nav from '../components/Nav/Nav';
import useUser from '../hooks/useUser';

function ShoppingListPage () {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // Możesz dodać loader
  }

  if (!user) {
    return <div>Użytkownik nie jest zalogowany</div>;
  }

  return (
    <div className="shopping-list-page">
      <Nav />
      <ShoppingListForm user={user} />
    </div>
  );
};

export default ShoppingListPage;

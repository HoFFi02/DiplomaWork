import React from 'react';
import ShoppingListForm from '../components/Shopping_list/Shopping_listForm';
import '../css/shoppingList.css';
import Nav from '../components/Nav/Nav';
import useUser from '../hooks/useUser';
import LanguageSwitcher from '../hooks/LanguageSwitcher.jsx';

function ShoppingListPage () {
  const { user } = useUser();
  if (user === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="shopping-list-page">
      <Nav />
      <LanguageSwitcher />
      <ShoppingListForm user={user} />
    </div>
  );
};

export default ShoppingListPage;

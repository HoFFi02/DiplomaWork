import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/shoppingList.css';

function ShoppingListForm ({ user }) {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shopping_list/${user.id_user}`, {
          withCredentials: true,
        });
        console.log('Pobrane dane:', response.data); 
        setShoppingList(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania listy zakupów:', error);
      }
    };

    fetchShoppingList();
  }, [user.id_user]);
const handleResetClick = async () => {
 console.log('Reset button clicked');
 try{
    const response = await axios.delete(`http://localhost:5000/api/shopping_list`)
 }catch(error){
  console.error('Błąd resetowania listy zakupów: ', error);
 }
}

  return (
    <div className="shopping-list">
      <h2>Lista Zakupów</h2>
      <button className='reset' onClick={() => handleResetClick()}>Reset</button>
      <table>
        <thead>
          <tr>
            <th>Składnik</th>
            <th>Ilość</th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.map((item, index) => (
            <tr key={item.product_id || index}>
              <td>{item.product_name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShoppingListForm;

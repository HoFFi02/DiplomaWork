import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../hooks/url';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useTranslation } from 'react-i18next';

function ShoppingListForm({ user }) {
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { t, i18n } = useTranslation(); 
  const language = i18n.language;
  
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shopping_list/${user.id_user}?language=${language}`, {
          withCredentials: true,
          params: selectedMonths.length > 0 ? { months: selectedMonths } : {},
        });
        setShoppingList(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania listy zakupów:', error);
      }
    };

    fetchShoppingList();
  }, [user.id_user, selectedMonths, language]);

  const handleMonthChange = (month) => {
    setSelectedMonths((prevSelectedMonths) =>
      prevSelectedMonths.includes(month)
        ? prevSelectedMonths.filter((m) => m !== month)
        : [...prevSelectedMonths, month]
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Roboto');
    const headers = [["Product", "Amount", "Unit"]];
    const data = shoppingList.map(item => [
      item.product_name,
      item.amount,
      item.unit
    ]);
    doc.autoTable({
      head: headers,
      body: data,
      startY: 10,
      theme: 'striped',
    });
    doc.text("Shopping List", 14, 8);
    doc.save("shopping_list.pdf");
  };


  const getSelectedMonthsText = () => {
    if (selectedMonths.length === 0) {
      return t('noMonthsSelected'); 
    }

    return selectedMonths
      .map((month) => {
        const monthNames = [
          'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
        ];
        return t(`months.${monthNames[month]}`);
      })
      .join(', ');
  };

  return (
    <div className="shopping-list">
      <h2>{t('shoppingList')}</h2>
      <div className='above-table-container'>
        <button className='download-pdf' onClick={handleDownloadPDF}>{t('downloadAsPDF')}</button>
        <button
          className="filter-button"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <ion-icon name="funnel-outline"></ion-icon>
  
        </button>
      </div>
      <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th>{t('product')}</th>
            <th>{t('amount')}</th>
            <th>{t('unit')}</th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>{"-"}</td>
            </tr>
          ) : (
            shoppingList.map((item, index) => (
              <tr key={item.product_id || index}>
                <td>{item.product_name}</td>
                <td>{item.amount}</td>
                <td>{item.unit}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
</div>
      {isFilterModalOpen && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h3>{t('filters')}</h3>
            {[new Date().getMonth(), new Date().getMonth()+1, new Date().getMonth() +2].map((month) => (
              <label key={month}>
                <input
                  type="checkbox"
                  value={month}
                  checked={selectedMonths.includes(month)}
                  onChange={() => handleMonthChange(month)}
                />
                {t(`months.${['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][month-1]}`)}
              </label>
            ))}
            <div className="filter-modal-actions">
              <button onClick={() => setIsFilterModalOpen(false)}>{t('close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListForm;

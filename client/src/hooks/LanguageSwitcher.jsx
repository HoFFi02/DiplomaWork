import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button className="button-pl" onClick={() => changeLanguage('pl')}>PL</button>
      <button className="button-en" onClick={() => changeLanguage('en')}>EN</button>
    </div>
  );
}

export default LanguageSwitcher;

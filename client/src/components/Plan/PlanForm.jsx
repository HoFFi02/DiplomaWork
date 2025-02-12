import React, { useState, useEffect } from 'react';
import '../../css/home.css';
import '../../css/plan.css';
import PlanTable from './PlanTable';
import { useTranslation } from 'react-i18next';

function PlanForm({ user }) {
  const [days, setDays] = useState([]);
  const { t } = useTranslation();
 
  return (
      <div className="plan-table">
        <h2>{t('daysPlan')}</h2>
        <PlanTable days={days} userId={user.id_user} />
      </div>
  );
}

export default PlanForm;

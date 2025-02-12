import React from 'react';
import useUser from '../hooks/useUser';
import Nav from '../components/Nav/Nav';
import PlanForm from '../components/Plan/PlanForm';
import LanguageSwitcher from '../hooks/LanguageSwitcher.jsx';

function PlanPage() {
  const { user } = useUser();
  
  return (
    <div>
      <Nav />
      <LanguageSwitcher />
      <PlanForm user={user} />
    </div>
  );
}

export default PlanPage;

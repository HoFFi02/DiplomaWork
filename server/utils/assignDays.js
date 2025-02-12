import Day from '../models/Day.js';

const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate(); 
  };
  
  
  const assignDaysToUser = async (userId, transaction) => {
    const mealIds = {
      breakfast: 1,
      lunch: 2,
      dinner: 3,
    };
  
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();
  
   
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const previousMonthYear = previousMonth === 12 ? currentYear - 1 : currentYear;
    const nextMonthYear = nextMonth === 1 ? currentYear + 1 : currentYear;
  
   
    const daysInPreviousMonth = getDaysInMonth(previousMonth, previousMonthYear);
    const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
    const daysInNextMonth = getDaysInMonth(nextMonth, nextMonthYear);
  
    const dayEntries = [];
  
    
    const addDaysForMonth = (days, month, year) => {
      for (let i = 1; i <= days; i++) {
        dayEntries.push(
          { number_of_day: i, meal_id_meal: mealIds.breakfast, user_id_user: userId, month, year },
          { number_of_day: i, meal_id_meal: mealIds.lunch, user_id_user: userId, month, year },
          { number_of_day: i, meal_id_meal: mealIds.dinner, user_id_user: userId, month, year }
        );
      }
    };
  
  
    addDaysForMonth(daysInPreviousMonth, previousMonth, previousMonthYear);
    addDaysForMonth(daysInCurrentMonth, currentMonth, currentYear);
    addDaysForMonth(daysInNextMonth, nextMonth, nextMonthYear);
  
    
    await Day.bulkCreate(dayEntries, { transaction });
  };
  
  const assignDaysToUserForNextMonth = async (userId, transaction) => {
    const mealIds = {
      breakfast: 1,
      lunch: 2,
      dinner: 3,
    };
  
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();
  
  
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextMonthYear = nextMonth === 1 ? currentYear + 1 : currentYear;
  
    const twoMonthsAgo = currentMonth === 1 ? 11 : currentMonth - 2;
    const twoMonthsAgoYear = twoMonthsAgo > currentMonth ? currentYear - 1 : currentYear;
  
    await Day.destroy({
      where: {
        user_id_user: userId,
        month: twoMonthsAgo,
        year: twoMonthsAgoYear,
      },
      transaction,
    });
  
    const daysInNextMonth = getDaysInMonth(nextMonth, nextMonthYear);
    const dayEntries = [];
  
    for (let i = 1; i <= daysInNextMonth; i++) {
      dayEntries.push(
        { number_of_day: i, meal_id_meal: mealIds.breakfast, user_id_user: userId, month: nextMonth, year: nextMonthYear },
        { number_of_day: i, meal_id_meal: mealIds.lunch, user_id_user: userId, month: nextMonth, year: nextMonthYear },
        { number_of_day: i, meal_id_meal: mealIds.dinner, user_id_user: userId, month: nextMonth, year: nextMonthYear }
      );
    }
  
    await Day.bulkCreate(dayEntries, { transaction });
  };

  export {assignDaysToUser, assignDaysToUserForNextMonth};

export const daysOfWeekToSQLiteInteger = (selectedDays) => {
  let cnt = 0;
  for (let i=0; i<7; i++){
    if (selectedDays[i] === true){
      cnt += 1 << i;
    }
  }
  return cnt;
}

export const SQLiteIntegerToDaysOfWeek = (num) => {
  let selectedDays = new Array(7).fill(false);
  for (let i=0; i<7; i++){
    if (num & 1 << i){
      selectedDays[i] = true;
    }
  }
  return selectedDays;
}

export const convertToSQLiteDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const convertFromSQLiteDateTime = (dateTimeString) => {
  if (!dateTimeString) {
    return new Date();
  }
  const [datePart, timePart] = dateTimeString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

export const convertFromSQLiteLabels = (label) => {
  let selectedDays = new Array(2).fill(false);
  for (let i=0; i<2; i++){
    if (label & 1 << i){
      selectedDays[i] = true;
    }
  }
  return selectedDays;
}

export const convertToSQLiteLabels = (selectedLabels) => {
  let cnt = 0;
  for (let i=0; i<7; i++){
    if (selectedLabels[i] === true){
      cnt += 1 << i;
    }
  }
  return cnt;
}
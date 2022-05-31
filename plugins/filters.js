import Vue from 'vue';

Vue.filter('prettyDateNumeric', date => {
  if (process.browser && !window.Intl) {
    return date;
  }
  if (!(date instanceof Date)) {
    let originalDate = date;
    date = new Date(date);
    if (date === 'Invalid Date') {
      return originalDate;
    }
  }
  return new Intl.DateTimeFormat("ru-Ru", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).format(date);
});

/**
 * Фильтр для форматирования номера телефона.
 * {{ phone | phoneNumber}}
 */
Vue.filter('phoneNumber', phone => {
  return phone.replace(/(\+7|8|7)[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g, '+7 ($2) $3-$4-$5');
})

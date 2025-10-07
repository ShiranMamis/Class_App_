export const isValidHebrew = (toValidate) => {
  const hebrewRegex = /^[א-ת\s`'"-]+$/u;
  return hebrewRegex.test(toValidate);
};
export const isMoblieNumber = (toValidate) => {
  const israeliMobileNumberRegex = /^(\+972\-?|0)(5[0-9]\-?\d{7})$/;
  return israeliMobileNumberRegex.test(toValidate);
};
export const isSevenDigits = (toValidate) => {
  const sevenDigitRegex = /^\d{7}$/;
  return sevenDigitRegex.test(toValidate);
};
export const isValidHebrewWithNumbers = (toValidate) => {
  const hebrewRegex = /^[א-ת\d\s`'"-]+$/u;
  return hebrewRegex.test(toValidate);
};

export const useRegex = () => {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  const password =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,40}$/;
  const rtl = /^[\u0600-\u06FF\s]+$/;
  const ltr = /^[a-zA-Z0-9?><;,{}[\]\-_+=!@#$%&*|' ]*$/;
  const phone = /^0\d{2,3}-\d{8}$/;
  const mobile = /((0?9)|(\+?989))\d{9}/g;

  return { email, password, rtl, ltr, phone, mobile };
};

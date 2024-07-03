export const useRegex = () => {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  const password =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,40}$/;
  const rtl = /^[\u0600-\u06FF\s]+$/;
  const ltr = /^[a-zA-Z0-9?><;.,{}[\]\-_+=!@#$%&*|' ]*$/;
  const mobile =
    /((0?9)|(\+?989))((14)|(13)|(12)|(19)|(18)|(17)|(15)|(16)|(11)|(10)|(90)|(91)|(92)|(93)|(94)|(95)|(96)|(32)|(30)|(33)|(35)|(36)|(37)|(38)|(39)|(00)|(01)|(02)|(03)|(04)|(05)|(41)|(20)|(21)|(22)|(23)|(31)|(34)|(9910)|(9911)|(9913)|(9914)|(9999)|(999)|(990)|(9810)|(9811)|(9812)|(9813)|(9814)|(9815)|(9816)|(9817)|(998))\d{7}/g;
  const phone = /^\d{11}$/;
  const ipv4 =
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
  const url =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const nationalCode = /^\d{10}$/;
  const number = /^\d+$/;
  const initNumber = /^[0-9]+$/;
  const floatNumber = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
  const ipv4OrUrl =
    /^(?:(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/[-a-zA-Z0-9@:%._\+~#=]*)?|(?:https?|ftp):\/\/(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/[-a-zA-Z0-9@:%._\+~#=]*)?|(?:https?|ftp):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}(?::\d+)?(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)$/;

  const value = /^[a-zA-Z]+(?:_[a-zA-Z]+)*$/;
  const persianNumber = /^[\u06F0-\u06F9]+$/;
  const persianAlphabet = /^[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/;
  const persianNumberOrAlphabet = /^[\u0600-\u06FF\u06F0-\u06F9]+$/;
  const englishAlphabet = /^[a-zA-Z]+$/;
  const englishNumber = /^[0-9]+$/;
  const englishSpecialCharacter = /^[^a-zA-Z0-9]+$/;
  const englishNumberOrAlphabet = /^(?:[a-zA-Z]+|[0-9]+)$/;
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const oneNumber = /[0-9]/;
  const oneSpecial = /[!@#$%^&*(),.?":{}|<>]/;

  return {
    email,
    password,
    rtl,
    ltr,
    mobile,
    phone,
    ipv4,
    url,
    nationalCode,
    number,
    initNumber,
    floatNumber,
    ipv4OrUrl,
    value,
    persianNumber,
    persianAlphabet,
    persianNumberOrAlphabet,
    englishAlphabet,
    englishNumber,
    englishSpecialCharacter,
    englishNumberOrAlphabet,
    uppercase,
    lowercase,
    oneNumber,
    oneSpecial,
  };
};

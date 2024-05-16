import { useI18n } from 'vue-i18n'
import { useRegex } from './regex'
export const useRules = () => {
  const { t } = useI18n()
   const regex = useRegex()
  const password = { required: true, message: t('rules.password'), pattern: regex.password }
  const ltr = { required: true, message: t('rules.ltr'), pattern: regex.ltr }
  const email = { required: true, message: t('rules.email'), pattern: regex.email }
  const required = { required: true, message: t("rules.required") };
  const number = { required: true, message: t('rules.number'), pattern: regex.number }
  const initNumber = { required: true, message: t('rules.initNumber'), pattern: regex.initNumber }
  const floatNumber = { required: true, message: t('rules.initNumber'), pattern: regex.floatNumber }
  const url = { required: true, message: t("rules.url"), pattern: regex.url };
  const ipv4 = { required: true, message: t("rules.ipv4"), pattern: regex.ipv4 };
  const mobile = { required: true, message: t("rules.mobile"), pattern: regex.mobile };
  const phone = { required: true, message: t("rules.phone"), pattern: regex.phone };
  const nationalCode = { required: true, message: t("rules.nationalCode"), pattern: regex.nationalCode };
  const ipv4OrUrl = { required: true, message: t('rules.ipv4OrUrl'), pattern: regex.ipv4OrUrl };
  const value = { required: true, message: t('rules.value'), pattern: regex.value };
  const persianAlphabet = { required: true, message: t('rules.persianAlphabet'), pattern: regex.persianAlphabet };
  const persianNumber = { required: true, message: t('rules.persianNumber'), pattern: regex.persianNumber };
  const persianNumberOrAlphabet = { required: true, message: t('rules.persianNumberOrAlphabet'), pattern: regex.persianNumberOrAlphabet };
  const englishAlphabet = { required: true, message: t('rules.englishAlphabet'), pattern: regex.englishAlphabet };
  const englishNumber = { required: true, message: t('rules.englishNumber'), pattern: regex.englishNumber };
  const englishNumberOrAlphabet = { required: true, message: t('rules.englishNumberOrAlphabet'), pattern: regex.englishNumberOrAlphabet };
  const englishSpecialCharacter = { required: true, message: t('rules.englishSpecialCharacter'), pattern: regex.englishSpecialCharacter };

  return {
    required,
    email,
    password,
    ltr,
    initNumber,
    number,
    url,
    ipv4,
    mobile,
    phone,
    nationalCode,
    floatNumber,
    ipv4OrUrl,
    value,
    persianAlphabet,
    persianNumber,
    persianNumberOrAlphabet,
    englishAlphabet,
    englishNumber,
    englishSpecialCharacter,
    englishNumberOrAlphabet,
  };
}

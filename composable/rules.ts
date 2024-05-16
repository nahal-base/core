import { useI18n } from 'vue-i18n'
import { useRegex } from './regex'
export const useRules = () => {
  const { t } = useI18n()
  const regex = useRegex()
  const required = { required: true, message: t("rules.required") };
  const password = {  message: t('rules.password'), pattern: regex.password }
  const ltr = {  message: t('rules.ltr'), pattern: regex.ltr }
  const email = {  message: t('rules.email'), pattern: regex.email }
  const number = {  message: t('rules.number'), pattern: regex.number }
  const initNumber = {  message: t('rules.initNumber'), pattern: regex.initNumber }
  const floatNumber = {  message: t('rules.floatNumber'), pattern: regex.floatNumber }
  const url = {  message: t("rules.url"), pattern: regex.url };
  const ipv4 = {  message: t("rules.ipv4"), pattern: regex.ipv4 };
  const mobile = {  message: t("rules.mobile"), pattern: regex.mobile };
  const phone = {  message: t("rules.phone"), pattern: regex.phone };
  const nationalCode = {  message: t("rules.nationalCode"), pattern: regex.nationalCode };
  const ipv4OrUrl = {  message: t('rules.ipv4OrUrl'), pattern: regex.ipv4OrUrl };
  const value = {  message: t('rules.value'), pattern: regex.value };
  const persianAlphabet = {  message: t('rules.persianAlphabet'), pattern: regex.persianAlphabet };
  const persianNumber = {  message: t('rules.persianNumber'), pattern: regex.persianNumber };
  const persianNumberOrAlphabet = {  message: t('rules.persianNumberOrAlphabet'), pattern: regex.persianNumberOrAlphabet };
  const englishAlphabet = {  message: t('rules.englishAlphabet'), pattern: regex.englishAlphabet };
  const englishNumber = {  message: t('rules.englishNumber'), pattern: regex.englishNumber };
  const englishNumberOrAlphabet = {  message: t('rules.englishNumberOrAlphabet'), pattern: regex.englishNumberOrAlphabet };
  const englishSpecialCharacter = {  message: t('rules.englishSpecialCharacter'), pattern: regex.englishSpecialCharacter };

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

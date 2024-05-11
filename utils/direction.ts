import { isUndefined } from 'lodash'
import { useRegex } from '../composable/regex'
export const isRtl = (_input: string | number) => {
  if (!isUndefined(_input)) {
    const regex = useRegex()
    const temp = String(_input)
    if (regex.rtl.test(temp[0])) {
      return true
    } else {
      return false
    }
  }
}

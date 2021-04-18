import i18n from '../i18n'

const t = (key: string): string => {
  return i18n.t(key)
}

// eslint-disable-next-line import/prefer-default-export
export { t }

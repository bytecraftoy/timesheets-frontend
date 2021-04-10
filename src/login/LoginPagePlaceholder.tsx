import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'

const LoginPagePlaceholder: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Typography variant="h3">{t('app.loginPlaceholderTitle')}</Typography>
      <Typography variant="h5">{t('app.loginPlaceholderSubtitle')}</Typography>
    </div>
  )
}

export default LoginPagePlaceholder

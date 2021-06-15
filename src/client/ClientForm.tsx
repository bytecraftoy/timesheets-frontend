import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'

const ClientForm: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Typography variant="h6" data-cy="client-form-heading">
        {t('client.createNew')}
      </Typography>
    </>
  )
}

export default ClientForm

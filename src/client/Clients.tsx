import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import ClientsTable from './ClientsTable'

const ClientsView: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Typography variant="h2" data-cy="clients-title">
        {t('client.title')}
      </Typography>
      <ClientsTable />
    </div>
  )
}

export default ClientsView

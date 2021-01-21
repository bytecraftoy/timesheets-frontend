import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Grid } from '@material-ui/core'
import { Client } from '../common/types'
import getAllClients from '../services/clientService'

const BillingReportForm: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      client: '',
    },
    onSubmit: async () => {},
  })

  const fetchClients = async () => {
    const clientResponse = await getAllClients()
    setClients(clientResponse)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container>
          <Grid item>text</Grid>
        </Grid>
      </form>
    </>
  )
}

export default BillingReportForm

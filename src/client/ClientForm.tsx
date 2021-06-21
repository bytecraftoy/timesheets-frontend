import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Typography } from '@material-ui/core'
import { useFormik } from 'formik'
import { useSetRecoilState } from 'recoil'
import SubmitButton from '../button/SubmitButton'
import { ClientFormValues } from '../common/types'
import { createClient } from '../services/clientService'
import notificationState from '../common/atoms'
import * as constants from '../common/constants'
import FormTextField from '../form/FormTextField'

const ClientForm: React.FC = () => {
  const { t } = useTranslation()

  const [toNext, setToNext] = useState(false)
  const setNotification = useSetRecoilState(notificationState)

  const initialValues: ClientFormValues = {
    name: '',
    email: '',
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await createClient(values)
        setNotification({
          message: t('client.message.createSuccess', { client: response.name }),
          severity: 'success',
        })
      } catch (error) {
        setNotification({ message: error.message, severity: 'error' })
      } finally {
        setToNext(true)
      }
    },
    validate: (values) => {
      const errors: { [key: string]: string | { [key: string]: string } } = {}
      if (!values.name) {
        errors.name = t('client.error.name.empty')
      } else if (values.name.length > 100) {
        errors.name = t('client.error.name.tooLong')
      }
      if (!values.email) {
        errors.email = t('client.error.email')
      }
      return errors
    },
  })

  return (
    <>
      <Typography variant="h6" data-cy="client-form-heading">
        {t('client.createNew')}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
          <Grid item>
            <FormTextField
              name="name"
              label={t('client.form.nameLabel')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.name}
              errors={formik.errors.name}
              touched={formik.touched.name}
            />
          </Grid>
          <Grid item>
            <FormTextField
              name="email"
              label={t('client.form.nameLabel')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.email}
              errors={formik.errors.email}
              touched={formik.touched.email}
            />
          </Grid>
          {toNext && <Redirect to={constants.PATHS.clients} />}
          <Grid container item spacing={1}>
            <SubmitButton
              disabled={formik.isSubmitting}
              testId="clientFormSubmit"
              label={t('button.create')}
            />
            <Grid item>
              <Button
                disabled={formik.isSubmitting}
                variant="contained"
                onClick={() => setToNext(true)}
              >
                {t('button.cancel')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ClientForm

import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Grid, makeStyles, FormControl, FormHelperText } from '@material-ui/core'
import * as constants from '../common/constants'
import FormCheckbox from '../form/FormCheckbox'
import { BillableCheckboxGroupProps } from '../common/types'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: constants.DRAWER_WIDTH,
  },
  errorText: {
    marginLeft: theme.spacing(1.5),
  },
}))

const BillableCheckboxGroup: React.FC<BillableCheckboxGroupProps> = ({
  billable,
  nonBillable,
  handleChange,
}) => {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <Grid container item direction="column">
      <Grid item>
        <FormControl
          required
          error={!billable && !nonBillable}
          component="fieldset"
          className={classes.formControl}
        >
          <FormGroup row>
            <FormCheckbox
              name={constants.BILLABLE}
              checked={billable}
              handleChange={handleChange}
              ariaLabel={constants.BILLABLE}
              label={t('billable.includeBillable')}
            />
            <FormCheckbox
              name={constants.NON_BILLABLE}
              checked={nonBillable}
              handleChange={handleChange}
              ariaLabel={constants.NON_BILLABLE}
              label={t('billable.includeNonBillable')}
            />
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item className={classes.errorText}>
        {!billable && !nonBillable && (
          <FormHelperText style={{ color: '#d93b30' }}>{t('billable.error')}</FormHelperText>
        )}
      </Grid>
    </Grid>
  )
}

export default BillableCheckboxGroup

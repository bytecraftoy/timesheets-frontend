import React from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'
import { FormSelectMultipleWithButtonsProps } from '../common/types'
import FormSelectMultiple from './FormSelectMultiple'
import SelectAllButton from '../button/SelectAllButton'
import UnselectAllButton from '../button/UnselectAllButton'

const FormSelectMultipleWithButtons: React.FC<FormSelectMultipleWithButtonsProps> = ({
  formSelectItems,
  objects,
  setFieldValue,
  handleBlur,
  value,
  errors,
  touched,
  label,
  name,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Grid item>
        <FormSelectMultiple
          objects={formSelectItems}
          className={className}
          name={name}
          label={t(`${label}.labelPlural`)}
          handleChange={(evt) => setFieldValue(name, evt.target.value as string[])}
          handleBlur={handleBlur}
          value={value}
          errors={errors}
          touched={touched}
        />
      </Grid>
      <Grid container item spacing={2}>
        <SelectAllButton
          label={t(`${label}.selectAll`)}
          setFieldValue={setFieldValue}
          objects={objects}
          fieldName={name}
        />
        <UnselectAllButton
          label={t(`${label}.unselectAll`)}
          setFieldValue={setFieldValue}
          fieldName={name}
        />
      </Grid>
    </>
  )
}

export default FormSelectMultipleWithButtons

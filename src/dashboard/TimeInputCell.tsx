import React, { useState, useCallback } from 'react'
import { Grid, TextField, makeStyles } from '@material-ui/core'
import { FastField, getIn, FastFieldAttributes, FormikContextType } from 'formik'
import { useTranslation } from 'react-i18next'
import { timeStringToNumber } from './dashboardService'
import { TimeInputCellProps } from '../common/types'

const useStyles = makeStyles((theme) => ({
  descriptionField: {
    backgroundColor: theme.palette.grey[200],
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      '&:focus-within': {
        position: 'absolute',
        width: '24ch',
        zIndex: '1',
      },
    },
  },
  grayBackground: {
    backgroundColor: theme.palette.grey[300],
  },
}))

type FastFieldInnerProps<Values, Props> = FastFieldAttributes<Props> & {
  formik: FormikContextType<Values>
}

type DescFastFieldProps = FastFieldInnerProps<
  unknown,
  { showDescription: boolean; isFocused: boolean }
>

type TimeFastFieldProps = FastFieldInnerProps<unknown, unknown>

/* These shouldUpdate functions have been created in order to make both of the fastfields rerender
when needed. The description field needs to be rerendered when focused and hidden and the time field
needs to be rerendered when the validation function changes since the function depends on the
description field value. To understand how the shouldUpdate prop works read: 
https://github.com/formium/formik/blob/master/packages/formik/src/FastField.tsx */
const timeFieldShouldUpdate = (thisProps: TimeFastFieldProps, props: TimeFastFieldProps) => {
  if (
    props.name !== thisProps.name ||
    getIn(props.formik.values, thisProps.name) !== getIn(thisProps.formik.values, thisProps.name) ||
    getIn(props.formik.errors, thisProps.name) !== getIn(thisProps.formik.errors, thisProps.name) ||
    Object.keys(thisProps).length !== Object.keys(props).length ||
    props.formik.isSubmitting !== thisProps.formik.isSubmitting ||
    props.validate !== thisProps.validate
  ) {
    return true
  }
  return false
}
const descFieldShouldUpdate = (thisProps: DescFastFieldProps, props: DescFastFieldProps) => {
  if (
    props.name !== thisProps.name ||
    getIn(props.formik.values, thisProps.name) !== getIn(thisProps.formik.values, thisProps.name) ||
    getIn(props.formik.errors, thisProps.name) !== getIn(thisProps.formik.errors, thisProps.name) ||
    Object.keys(thisProps).length !== Object.keys(props).length ||
    props.formik.isSubmitting !== thisProps.formik.isSubmitting ||
    props.showDescription !== thisProps.showDescription ||
    props.isFocused !== thisProps.isFocused
  ) {
    return true
  }
  return false
}

const TimeInputCell: React.FC<TimeInputCellProps> = ({
  input,
  timeInputName,
  handleChange,
  handleBlur,
  errors,
  showDescription,
  isHoliday,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const timeName = `${timeInputName}.time`
  const descriptionName = `${timeInputName}.description`
  const [isFocused, setFocused] = useState(false)
  const validateTime = useCallback(
    (value: string): string | undefined => {
      let error: string | undefined
      const number = timeStringToNumber(value)
      if (Number.isNaN(number)) {
        error = t('timeInput.time.error.format')
      } else if (number < 0) {
        error = t('timeInput.time.error.negative')
      } else if (number > 1440) {
        error = t('timeInput.time.error.over24')
      } else if (input.description !== '' && value === '') {
        error = t('timeInput.time.error.empty')
      }
      return error
    },
    [input.description, t]
  )

  const validateDescription = (value: string): string | undefined => {
    let error: string | undefined
    if (value.length > 100) {
      error = t('timeInput.description.error.tooLong')
    }
    return error
  }

  const descFieldOnFocus = () => setFocused(true)
  const descFieldOnBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false)
    handleBlur(e)
  }

  // Description FastField should not be hidden because validation will not run.
  return (
    <Grid
      className={isHoliday ? classes.grayBackground : ''}
      item
      xs
      zeroMinWidth
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item>
        <FastField name={timeName} validate={validateTime} shouldUpdate={timeFieldShouldUpdate}>
          {() => (
            <TextField
              id={timeName}
              name={timeName}
              onChange={handleChange}
              onBlur={handleBlur}
              value={input.time}
              error={Boolean(getIn(errors, timeName))}
              variant="outlined"
              size="small"
              inputProps={{
                'data-testid': timeName,
                className: 'mousetrap',
              }}
            />
          )}
        </FastField>
      </Grid>
      <Grid style={{ position: 'relative' }} item>
        <FastField
          name={descriptionName}
          validate={validateDescription}
          shouldUpdate={descFieldShouldUpdate}
          showDescription={showDescription}
          isFocused={isFocused}
        >
          {() =>
            showDescription && (
              <TextField
                className={classes.descriptionField}
                multiline
                rowsMax={isFocused ? 4 : 1}
                onFocus={descFieldOnFocus}
                id={descriptionName}
                name={descriptionName}
                onChange={handleChange}
                onBlur={descFieldOnBlur}
                value={input.description}
                error={Boolean(getIn(errors, descriptionName))}
                variant="outlined"
                size="small"
                inputProps={{
                  'data-testid': descriptionName,
                  className: 'mousetrap',
                }}
              />
            )
          }
        </FastField>
      </Grid>
    </Grid>
  )
}

export default React.memo(TimeInputCell)

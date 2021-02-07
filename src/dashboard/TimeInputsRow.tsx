import React from 'react'
import { Grid, TextField, makeStyles, Typography } from '@material-ui/core'
import { FastField, getIn, FieldArray } from 'formik'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { TimeInputsRowProps } from '../common/types'
import { timeStringToNumber } from './DashboardService'

const useStyles = makeStyles((theme) => ({
  descriptionField: {
    backgroundColor: theme.palette.grey[200],
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    width: '100%',
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      '&:focus-within': {
        width: '24ch',
        zIndex: '1',
      },
    },
  },
  typographyBreakWord: {
    wordWrap: 'break-word',
  },
  grayBackground: {
    backgroundColor: theme.palette.grey[300],
  },
}))

const TimeInputsRow: React.FC<TimeInputsRowProps> = ({
  i,
  project,
  handleChange,
  handleBlur,
  errors,
  disable,
  showDescription,
  holidays,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const validateTime = (value: string): string | undefined => {
    let error: string | undefined
    const number = timeStringToNumber(value)
    if (Number.isNaN(number)) {
      error = t('timeInput.time.error.format')
    } else if (number < 0) {
      error = t('timeInput.time.error.negative')
    } else if (number > 1440) {
      error = t('timeInput.time.error.over24')
    }
    return error
  }

  return (
    <Grid
      item
      xs={12}
      container
      spacing={1}
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      wrap="nowrap"
    >
      <Grid item xs={2}>
        <Typography className={classes.typographyBreakWord} variant="body1">
          {project.name}
        </Typography>
      </Grid>
      <FieldArray name={`projects[${i}].inputs`} validateOnChange={false}>
        {() =>
          [0, 1, 2, 3, 4, 5, 6].map((j) => {
            const timeName = `projects[${i}].inputs[${j}].time`
            const descriptionName = `projects[${i}].inputs[${j}].description`
            const validateDescription = (value: string): string | undefined => {
              let error: string | undefined
              if (value.length > 100) {
                error = t('timeInput.description.error.tooLong')
              } else if (project.inputs[j].time === '' && value !== '') {
                error = t('timeInput.description.error.timeEmpty')
              }
              return error
            }
            return (
              <Grid
                className={clsx(holidays[j] && classes.grayBackground)}
                item
                xs
                key={j}
                zeroMinWidth
              >
                <FastField name={timeName} validate={validateTime}>
                  {() => (
                    <TextField
                      id={timeName}
                      name={timeName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={project.inputs[j].time}
                      error={Boolean(getIn(errors, timeName))}
                      variant="outlined"
                      size="small"
                      disabled={disable}
                      inputProps={{
                        className: 'mousetrap',
                      }}
                    />
                  )}
                </FastField>
                {showDescription && (
                  <FastField name={descriptionName} validate={validateDescription}>
                    {() => (
                      <TextField
                        className={classes.descriptionField}
                        id={descriptionName}
                        name={descriptionName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={project.inputs[j].description}
                        error={Boolean(getIn(errors, descriptionName))}
                        variant="outlined"
                        size="small"
                        disabled={disable}
                        inputProps={{
                          className: 'mousetrap',
                        }}
                      />
                    )}
                  </FastField>
                )}
              </Grid>
            )
          })
        }
      </FieldArray>
    </Grid>
  )
}

export default TimeInputsRow

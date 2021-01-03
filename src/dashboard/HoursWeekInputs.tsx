import React, { useRef, useEffect, useState } from 'react'
import debounce from 'just-debounce-it'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { IconButton, Grid, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { addDays, subDays } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles'
import { updateHours, getWeekDays } from './DashboardService'
import ProjectRow from './ProjectRow'
import { ProjectWithTimeInputs } from '../common/types'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}))

const HoursWeekInputs: React.FC<{
  projects: ProjectWithTimeInputs[]
  setProjects: React.Dispatch<React.SetStateAction<ProjectWithTimeInputs[]>>
  week: Date[]
  debounceMs: number
}> = ({ projects, setProjects, week, debounceMs }) => {
  const classes = useStyles()

  const [disableWeekChange, setDisableWeekChange] = useState(false)
  const [currentWeek, setCurrentWeek] = useState<Date[]>(week)
  const isMounted = useRef(true)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      projects,
    },
    onSubmit: async (values) => {
      await updateHours(values.projects, projects, currentWeek)
      setProjects(values.projects)
    },
  })

  const debouncedSubmit = useRef(
    debounce(() => {
      if (isMounted) {
        formik.submitForm()
      }
    }, debounceMs)
  )

  useEffect(() => {
    debouncedSubmit.current = debounce(() => {
      if (isMounted.current) {
        formik.submitForm()
      }
    }, debounceMs)
  }, [debouncedSubmit, formik, debounceMs])

  useEffect(() => {
    debouncedSubmit.current()
  }, [debouncedSubmit, formik.values])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const changeWeek = (change: (a: Date) => Date): void => {
    if (disableWeekChange) {
      return
    }
    setDisableWeekChange(true)
    const newWeek = currentWeek.map((date) => change(date))
    setCurrentWeek(newWeek)
    const resetProjects = projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        inputs: {
          mondayInput: '',
          tuesdayInput: '',
          wednesdayInput: '',
          thursdayInput: '',
          fridayInput: '',
          saturdayInput: '',
          sundayInput: '',
        },
      }
    })
    setProjects(resetProjects)
    formik.resetForm()
    setDisableWeekChange(false)
  }

  const changeWeekBackwards = () => changeWeek((a) => subDays(a, 7))

  const changeWeekForward = () => changeWeek((a) => addDays(a, 7))

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        {formik.isSubmitting && 'saving...'}
        <Grid container spacing={4} direction="row" justify="space-between" alignItems="center">
          <Grid item xs={1}>
            <IconButton
              color="primary"
              className={classes.button}
              onClick={changeWeekBackwards}
              disabled={disableWeekChange}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <Typography align="center" variant="h5">
              Week
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              color="primary"
              className={classes.button}
              onClick={changeWeekForward}
              disabled={disableWeekChange}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="center">
          <Grid
            item
            xs={12}
            container
            spacing={3}
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={1}>
              Project
            </Grid>
            {getWeekDays(currentWeek).map((day) => {
              return (
                <Grid item key={day} xs={1}>
                  {day}
                </Grid>
              )
            })}
          </Grid>
          <FieldArray name="projects" validateOnChange={false}>
            {() =>
              formik.values.projects.map((project, i) => (
                <ProjectRow
                  key={project.id}
                  i={i}
                  project={project}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  errors={formik.errors}
                  disable={disableWeekChange}
                />
              ))
            }
          </FieldArray>
        </Grid>
      </form>
    </FormikProvider>
  )
}

export default HoursWeekInputs

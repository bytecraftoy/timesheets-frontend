import React, { useRef, useEffect } from 'react'
import debounce from 'just-debounce-it'
import Mousetrap from 'mousetrap'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useSetRecoilState } from 'recoil'
import { Grid } from '@material-ui/core'
import { updateHours } from './DashboardService'
import TimeInputsRow from './TimeInputsRow'
import { ProjectWithTimeInputs } from '../common/types'
import notificationState from '../common/atoms'

const focusDifferentRow = (rowsToChange: number, length: number) => {
  const elem = document.activeElement
  if (elem !== null) {
    if (elem.hasAttribute('name')) {
      const name = elem.getAttribute('name') as string
      if (/^projects\[\d+\]\.inputs\.[\w\D]+$/.test(name)) {
        const index = parseInt((name.match(/\d+/) as RegExpMatchArray)[0], 10) + rowsToChange
        if (index < length && index >= 0) {
          ;(document.querySelector(
            `input[name='${name.replace(/\d+/, index.toString())}']`
          ) as HTMLInputElement).focus()
        }
      }
    }
  }
}

interface TimeInputsFormProps {
  projects: ProjectWithTimeInputs[]
  setProjects: React.Dispatch<React.SetStateAction<ProjectWithTimeInputs[]>>
  week: Date[]
  holidays: boolean[]
  debounceMs: number
  disableWeekChange: boolean
  showDescription: boolean
}

const TimeInputsForm: React.FC<TimeInputsFormProps> = ({
  projects,
  setProjects,
  week,
  holidays,
  debounceMs,
  disableWeekChange,
  showDescription,
}) => {
  const setNotification = useSetRecoilState(notificationState)
  const isMounted = useRef(true)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      projects,
    },
    onSubmit: async (values) => {
      try {
        await updateHours(values.projects, projects, week)
        setProjects(values.projects)
      } catch (error) {
        setNotification({ message: error, severity: 'error' })
      }
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

  useEffect(() => {
    Mousetrap.bind('down', () => focusDifferentRow(1, projects.length))
    Mousetrap.bind('up', () => focusDifferentRow(-1, projects.length))
    return () => {
      Mousetrap.unbind('down')
      Mousetrap.unbind('up')
    }
  }, [projects.length])

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        {formik.isSubmitting && 'saving...'}
        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="center">
          <FieldArray name="projects" validateOnChange={false}>
            {() =>
              formik.values.projects.map((project, i) => (
                <TimeInputsRow
                  key={project.id}
                  i={i}
                  project={project}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  errors={formik.errors}
                  disable={disableWeekChange}
                  showDescription={showDescription}
                  holidays={holidays}
                />
              ))
            }
          </FieldArray>
        </Grid>
      </form>
    </FormikProvider>
  )
}

export default TimeInputsForm

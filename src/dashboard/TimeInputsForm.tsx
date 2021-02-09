import React, { useRef, useEffect } from 'react'
import debounce from 'just-debounce-it'
import Mousetrap from 'mousetrap'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useSetRecoilState } from 'recoil'
import { Grid } from '@material-ui/core'
import {
  updateHours,
  projectAndInputsWithIdToProjectAndInputs,
  getErrorMessages,
} from './DashboardService'
import TimeInputsRow from './TimeInputsRow'
import { TimeInputsFormProps } from '../common/types'
import notificationState from '../common/atoms'

const focusDifferentRow = (rowsToChange: number, length: number) => {
  const elem = document.activeElement
  if (elem !== null) {
    if (elem.hasAttribute('name')) {
      const name = elem.getAttribute('name') as string
      if (/^projects\[\d+\]\.inputs\[\d+\]\.[\w\D]+$/.test(name)) {
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

const TimeInputsForm: React.FC<TimeInputsFormProps> = ({
  projects,
  week,
  holidays,
  debounceMs,
  disableWeekChange,
  showDescription,
  setSaveMessage,
}) => {
  const setNotification = useSetRecoilState(notificationState)
  const isMounted = useRef(true)

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      projects: projectAndInputsWithIdToProjectAndInputs(projects),
    },
    onSubmit: async (values) => {
      try {
        await updateHours(values.projects, projects, week)
      } catch (error) {
        setNotification({ message: error, severity: 'error' })
      } finally {
        const now = new Date()
        setSaveMessage(`Last saved: ${now.toLocaleTimeString().substring(0, 5)}`)
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
    setSaveMessage('Saving...')
  }, [debouncedSubmit, formik.values, setSaveMessage])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (Object.keys(formik.errors).length > 0) {
      setSaveMessage(`ERROR: ${getErrorMessages(formik.errors)[0]}`)
    }
  }, [formik.errors, setSaveMessage])

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

import React, { useRef, useEffect, useLayoutEffect } from 'react'
import debounce from 'just-debounce-it'
import Mousetrap from 'mousetrap'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useSetRecoilState } from 'recoil'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import {
  updateHours,
  projectAndInputsWithIdToProjectAndInputs,
  getErrorMessages,
} from './dashboardService'
import TimeInputsRow from './TimeInputsRow'
import { TimeInputsFormProps } from '../common/types'
import notificationState from '../common/atoms'
import DailyTotalRow from './DailyTotalRow'
import { useUserContext } from '../context/UserContext'

const focusDifferentRow = (rowsToChange: number, length: number) => {
  const elem = document.activeElement
  if (elem && elem.hasAttribute('name')) {
    const name = elem.getAttribute('name') as string
    if (/^projects\[\d+\]\.inputs\[\d+\]\.[\w\D]+$/.test(name)) {
      const index = parseInt((name.match(/\d+/) as RegExpMatchArray)[0], 10) + rowsToChange
      if (index < length && index >= 0) {
        const fieldType = name.includes('time') ? 'input' : 'textarea'
        ;(document.querySelector(
          `${fieldType}[name='${name.replace(/\d+/, index.toString())}']`
        ) as HTMLInputElement).focus()
      }
    }
  }
}

const TimeInputsForm: React.FC<TimeInputsFormProps> = ({
  projectsAndInputs,
  week,
  holidays,
  debounceMs,
  showDescription,
  setSaveMessage,
}) => {
  const setNotification = useSetRecoilState(notificationState)
  const isMounted = useRef(true)
  const { t } = useTranslation()
  const { user } = useUserContext()

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      projects: projectAndInputsWithIdToProjectAndInputs(projectsAndInputs),
    },
    onSubmit: async (values) => {
      try {
        await updateHours(values.projects, projectsAndInputs, week, user.id)
      } catch (error) {
        setNotification({ message: error, severity: 'error' })
      } finally {
        const now = new Date()
        setSaveMessage(`${t('timeInputs.savedMessage')}: ${now.toLocaleTimeString()}`)
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

  useLayoutEffect(() => {
    if (Object.keys(formik.errors).length === 0) {
      if (formik.dirty) {
        debouncedSubmit.current()
        setSaveMessage(t('timeInputs.savingMessage'))
      } else {
        const now = new Date()
        setSaveMessage(`${t('timeInputs.savedMessage')}: ${now.toLocaleTimeString()}`)
      }
    }
  }, [debouncedSubmit, formik.values, formik.dirty, formik.errors, setSaveMessage, t])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (Object.keys(formik.errors).length > 0) {
      setSaveMessage(`${t('timeInputs.errorMessage')}: ${getErrorMessages(formik.errors)[0]}`)
    }
  }, [formik.errors, setSaveMessage, t])

  useEffect(() => {
    Mousetrap.bind('down', () => focusDifferentRow(1, projectsAndInputs.length))
    Mousetrap.bind('up', () => focusDifferentRow(-1, projectsAndInputs.length))
    return () => {
      Mousetrap.unbind('down')
      Mousetrap.unbind('up')
    }
  }, [projectsAndInputs.length])

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={1} direction="column" justify="flex-start" alignItems="center">
          <FieldArray name="projects" validateOnChange={false}>
            {() =>
              formik.values.projects.map((projectAndInputs, i) => (
                <TimeInputsRow
                  key={projectAndInputs.id}
                  i={i}
                  projectAndInputs={projectAndInputs}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  errors={formik.errors}
                  showDescription={showDescription}
                  holidays={holidays}
                />
              ))
            }
          </FieldArray>
          <DailyTotalRow projectsAndInputs={formik.values.projects} />
        </Grid>
      </form>
    </FormikProvider>
  )
}

export default TimeInputsForm

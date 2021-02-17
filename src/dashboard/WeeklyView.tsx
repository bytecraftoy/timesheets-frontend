import React, { useEffect, useState, useCallback, useReducer } from 'react'
import { Typography } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import Mousetrap from 'mousetrap'
import { getProjectHours, timeInputsToWeekInputs } from './DashboardService'
import { getCurrentWeek, getHolidays } from '../services/dateAndTimeService'
import TimeInputsForm from './TimeInputsForm'
import { Project, ProjectAndInputsWithId } from '../common/types'
import WeekRow from './WeekRow'
import WeekdaysRow from './WeekdaysRow'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'
import TimeInputsFormControlRow from './TimeInputsFormControlRow'

const WeeklyView: React.FC<{
  projects: Project[]
  debounceMs: number
}> = ({ projects, debounceMs }) => {
  const [projectsAndInputs, setProjectsAndInputs] = useState<ProjectAndInputsWithId[]>([])
  const [disableWeekChange, setDisableWeekChange] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [showDescription, toggleShowDescription] = useReducer((status) => !status, false)
  const [week, setWeek] = useState<Date[]>(getCurrentWeek())
  const [holidays, setHolidays] = useState<boolean[]>([])
  const [saveMessage, setSaveMessage] = useState<string>('')

  const fetchTimeInputs = useCallback(async () => {
    setLoading(true)
    setHolidays(getHolidays(week))
    const timeIntervalStartDate = week[0]
    const timeIntervalEndDate = week[week.length - 1]

    const projectsWithInputs = await Promise.all(
      projects.map(async (project) => ({
        id: project.id,
        name: project.name,
        inputs: timeInputsToWeekInputs(
          await getProjectHours(project.id, timeIntervalStartDate, timeIntervalEndDate),
          week
        ),
      }))
    )
    setProjectsAndInputs(projectsWithInputs)
  }, [projects, week])

  useAPIErrorHandlerWithFinally(
    fetchTimeInputs,
    useCallback(() => setLoading(false), [])
  )

  const changeShowDescription = useCallback(() => {
    if (isLoading || disableWeekChange) {
      return
    }
    toggleShowDescription()
  }, [isLoading, disableWeekChange, toggleShowDescription])

  useEffect(() => {
    Mousetrap.bind('ctrl+alt+a', changeShowDescription)
    return () => {
      Mousetrap.unbind('ctrl+alt+a')
    }
  }, [changeShowDescription])

  return (
    <>
      <Typography variant="body1">{saveMessage}</Typography>
      <TimeInputsFormControlRow
        disableShowDescription={isLoading || disableWeekChange}
        changeShowDescription={changeShowDescription}
        showDescription={showDescription}
      />
      <WeekRow
        week={week}
        setWeek={setWeek}
        disableWeekChangeButtons={isLoading || disableWeekChange}
        setDisableWeekChange={setDisableWeekChange}
      />
      <WeekdaysRow week={week} holidays={holidays} />
      {isLoading && (
        <div>
          <HourglassEmptyIcon />
        </div>
      )}
      {!isLoading && (
        <TimeInputsForm
          projectsAndInputs={projectsAndInputs}
          week={week}
          debounceMs={debounceMs}
          disableWeekChange={disableWeekChange}
          showDescription={showDescription}
          holidays={holidays}
          setSaveMessage={setSaveMessage}
        />
      )}
    </>
  )
}

export default WeeklyView

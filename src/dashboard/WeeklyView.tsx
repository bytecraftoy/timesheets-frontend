import React, { useEffect, useState, useCallback } from 'react'
import { IconButton } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import Mousetrap from 'mousetrap'
import { getProjectHours, timeInputsToWeekInputs } from './DashboardService'
import { getCurrentWeek } from '../services/dateAndTimeService'
import TimeInputsForm from './TimeInputsForm'
import { Project, ProjectAndInputsWithId } from '../common/types'
import WeekRow from './WeekRow'
import WeekdaysRow from './WeekdaysRow'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'

const WeeklyView: React.FC<{
  projects: Project[]
  debounceMs: number
}> = ({ projects, debounceMs }) => {
  const [projectsAndInputs, setProjectsAndInputs] = useState<ProjectAndInputsWithId[]>([])
  const [disableWeekChange, setDisableWeekChange] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [showDescription, setShowDescription] = useState(false)
  const [week, setWeek] = useState<Date[]>(getCurrentWeek())
  const holidays = [false, false, false, false, false, true, true]

  const fetchTimeInputs = useCallback(async () => {
    setLoading(true)
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

  const toggleShowDescription = useCallback(() => {
    if (isLoading || disableWeekChange) {
      return
    }
    setShowDescription(!showDescription)
  }, [isLoading, disableWeekChange, setShowDescription, showDescription])

  useEffect(() => {
    Mousetrap.bind('ctrl+alt+a', toggleShowDescription)
    return () => {
      Mousetrap.unbind('ctrl+alt+a')
    }
  }, [toggleShowDescription])

  return (
    <>
      <IconButton onClick={toggleShowDescription} disabled={isLoading || disableWeekChange}>
        {showDescription ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
      </IconButton>
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
        // TODO: rename projects-> projectsAndInputs and setProjecs->setProjectsAndInputs in all child components
        <TimeInputsForm
          projects={projectsAndInputs}
          week={week}
          debounceMs={debounceMs}
          disableWeekChange={disableWeekChange}
          showDescription={showDescription}
          holidays={holidays}
        />
      )}
    </>
  )
}

export default WeeklyView

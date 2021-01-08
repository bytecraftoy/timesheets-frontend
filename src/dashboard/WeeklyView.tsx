import React, { useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { getProjectHours, inputsToWeekInputsObject } from './DashboardService'
import TimeInputsForm from './TimeInputsForm'
import { Project, ProjectWithTimeInputs } from '../common/types'
import WeekRow from './WeekRow'
import WeekdaysRow from './WeekdaysRow'

const WeeklyView: React.FC<{
  projects: Project[]
  week: Date[]
  setWeek: React.Dispatch<React.SetStateAction<Date[]>>
  debounceMs: number
}> = ({ projects, week, setWeek, debounceMs }) => {
  const [projectsAndInputs, setProjectsAndInputs] = useState<ProjectWithTimeInputs[]>([])
  const [disableWeekChange, setDisableWeekChange] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    const fetchTimeInputs = async () => {
      setLoading(true)
      const timeIntervalStartDate = week[0]
      const timeIntervalEndDate = week[week.length - 1]

      const projectsWithInputs = await Promise.all(
        projects.map(async (project) => ({
          id: project.id,
          name: project.name,
          inputs: inputsToWeekInputsObject(
            await getProjectHours(project.id, timeIntervalStartDate, timeIntervalEndDate),
            week
          ),
        }))
      )
      setProjectsAndInputs(projectsWithInputs)
      setLoading(false)
    }
    fetchTimeInputs()
  }, [projects, week])

  const toggleShowDescription = () => setShowDescription(!showDescription)

  return (
    <>
      <IconButton onClick={toggleShowDescription} disabled={isLoading || disableWeekChange}>
        {showDescription ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
      </IconButton>
      <WeekRow
        week={week}
        setWeek={setWeek}
        disableWeekChange={disableWeekChange}
        setDisableWeekChange={setDisableWeekChange}
      />
      <WeekdaysRow week={week} />
      {isLoading && (
        <div>
          <HourglassEmptyIcon />
        </div>
      )}
      {!isLoading && (
        // TODO: rename projects-> projectsAndInputs and setProjecs->setProjectsAndInputs in all child components
        <TimeInputsForm
          projects={projectsAndInputs}
          setProjects={setProjectsAndInputs}
          week={week}
          debounceMs={debounceMs}
          disableWeekChange={disableWeekChange}
          showDescription={showDescription}
        />
      )}
    </>
  )
}

export default WeeklyView

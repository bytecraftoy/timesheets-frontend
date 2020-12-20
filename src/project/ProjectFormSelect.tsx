import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@material-ui/core'
import { ProjectFormTextFieldProps } from './ProjectFormTextField'
import { Client, Manager } from '../common/types'

interface ProjectFormSelectItem {
  id: number
  name: string
}

interface ProjectFormSelectProps extends Omit<ProjectFormTextFieldProps, 'handleChange'> {
  handleChange: (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
    child: React.ReactNode
  ) => void
  objects: ProjectFormSelectItem[]
}

const ProjectFormSelect: React.FC<ProjectFormSelectProps> = ({
  objects,
  className,
  name,
  label,
  handleChange,
  handleBlur,
  value,
  errors,
  touched,
}) => {
  return (
    <FormControl className={className}>
      <InputLabel id={`mui-component-select-${name}`}>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(errors && touched)}
        inputProps={{
          id: name,
          name,
        }}
      >
        {objects.map((obj) => {
          return (
            <MenuItem key={obj.id} value={obj.id}>
              {obj.name}
            </MenuItem>
          )
        })}
      </Select>
      {errors && touched && <FormHelperText>{errors}</FormHelperText>}
    </FormControl>
  )
}

const clientToProjectFormSelectItem = (clients: Client[]): ProjectFormSelectItem[] => {
  return clients.map((client) => {
    return { id: client.id, name: client.name }
  })
}

const managerToProjectFormSelectItem = (managers: Manager[]): ProjectFormSelectItem[] => {
  return managers.map((manager) => {
    return { id: manager.id, name: `${manager.firstName} ${manager.lastName}` }
  })
}

export { clientToProjectFormSelectItem, managerToProjectFormSelectItem, ProjectFormSelect }

import React from 'react'
import { Link } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

const NavListItem: React.FC<{
  linkTo: string
  icon: JSX.Element
  label: string
  testId: string
  className?: string
}> = ({ linkTo, icon, label, testId, className }) => {
  return (
    <ListItem button component={Link} to={linkTo} className={className}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText data-cy={testId} data-testid={testId} primary={label} />
    </ListItem>
  )
}

export default NavListItem

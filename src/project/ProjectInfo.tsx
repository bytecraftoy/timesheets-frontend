import React, { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { useFormik } from 'formik'
import { useSetRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { Employee, Project } from '../common/types'
import { getEmployeeFullName } from '../services/employeeService'
import { updateProject } from '../services/projectService'
import notificationState from '../common/atoms'
import { employeesToFormSelectItem } from '../form/formService'
import FormSelectMultiple from '../form/FormSelectMultiple'
import SubmitButton from '../button/SubmitButton'
import { EMPLOYEES } from '../common/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  padding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  formControl: {
    width: 230,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

const ProjectInfo: React.FC<{ project: Project; employees: Employee[] }> = ({
  project,
  employees,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const setNotification = useSetRecoilState(notificationState)

  const created = useMemo(() => new Date(project.creationTimestamp).toString(), [
    project.creationTimestamp,
  ])
  const edited = useMemo(() => new Date(project.lastEdited).toString(), [project.lastEdited])

  const projectOwner = project.owner.firstName.charAt(0) + project.owner.lastName.charAt(0)
  const projectEmployees: string = useMemo(
    () => project.employees.map((employee) => getEmployeeFullName(employee)).join(', '),
    [project.employees]
  )

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const openDialog = Boolean(anchorEl)
  const initialValues: { employees: string[] } = useMemo(() => {
    return {
      employees: project.employees.map((employee) => employee.id),
    }
  }, [project.employees])

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const projectUpdate = {
        id: project.id,
        name: project.name,
        description: project.description,
        client: project.client.id,
        owner: project.owner.id,
        billable: project.billable,
        employees: values.employees,
      }
      try {
        const response = await updateProject(projectUpdate)
        setNotification({
          message: t('project.message.updateSuccess', { project: response.name }),
          severity: 'success',
        })
        const proRef = project
        proRef.employees = response.employees
      } catch (error) {
        setNotification({ message: error, severity: 'error' })
      } finally {
        handleClose()
      }
    },
  })

  const employeeSelectItems = useMemo(
    () =>
      employeesToFormSelectItem(employees.filter((employee) => employee.id !== project.owner.id)),
    [employees, project.owner.id]
  )

  return (
    <>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Update employees</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <FormSelectMultiple
              objects={employeeSelectItems}
              className={classes.formControl}
              name={EMPLOYEES}
              label={t('employee.label')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.employees}
              errors={formik.errors.employees}
              touched={formik.touched.employees}
            />
            <DialogActions>
              <Button disabled={formik.isSubmitting} variant="contained" onClick={handleClose}>
                {t('button.cancel')}
              </Button>
              <SubmitButton
                disabled={formik.isSubmitting}
                testId="projectFormSubmit"
                label={t('button.update')}
              />
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {project.name}
        </TableCell>
        <TableCell align="right">{project.client.name}</TableCell>
        <TableCell align="center">
          <Avatar style={{ margin: 'auto' }}>{projectOwner}</Avatar>
        </TableCell>
        <TableCell align="right">
          <EditIcon />
          <DeleteOutlinedIcon />
        </TableCell>
      </TableRow>
      {/* Collapsible part */}
      <TableRow>
        <TableCell className={classes.padding} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h5" gutterBottom component="div">
                {t('project.details')}
              </Typography>
              <Typography variant="body1">
                {t('project.description.label')}: {project.description}
              </Typography>
              <Typography variant="h6">
                {t('employee.labelPlural')}
                <IconButton size="small" onClick={handleClick}>
                  <EditIcon />
                </IconButton>
              </Typography>
              <Typography variant="body1">{projectEmployees}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>{t('project.time')}</TableCell>
                    <TableCell>{t('project.createdBy')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('project.created')}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{getEmployeeFullName(project.creator)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('project.modified')}</TableCell>
                    <TableCell>{edited}</TableCell>
                    <TableCell>{getEmployeeFullName(project.lastEditor)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default ProjectInfo

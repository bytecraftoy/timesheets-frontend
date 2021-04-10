import React, { useMemo } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useFormik } from 'formik'
import { useSetRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import FormSelectMultiple from '../form/FormSelectMultiple'
import SubmitButton from '../button/SubmitButton'
import { EMPLOYEES } from '../common/constants'
import { updateProject } from '../services/projectService'
import notificationState from '../common/atoms'
import { Employee, Project } from '../common/types'
import { employeesToFormSelectItem } from '../form/formService'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 230,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

const EditEmployeesDialog: React.FC<{
  project: Project
  employees: Employee[]
  open: boolean
  toggleOpen: React.DispatchWithoutAction
}> = ({ project, employees, open, toggleOpen }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const setNotification = useSetRecoilState(notificationState)

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
        toggleOpen()
      }
    },
  })

  const employeeSelectItems = useMemo(
    () =>
      employeesToFormSelectItem(employees.filter((employee) => employee.id !== project.owner.id)),
    [employees, project.owner.id]
  )

  return (
    <Dialog open={open} onClose={toggleOpen}>
      <DialogTitle>{t('project.updateEmployees')}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormSelectMultiple
            objects={employeeSelectItems}
            className={classes.formControl}
            name={EMPLOYEES}
            label={t('employee.labelPlural')}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.employees}
            errors={formik.errors.employees}
            touched={formik.touched.employees}
          />
          <DialogActions>
            <Button
              disabled={formik.isSubmitting}
              variant="contained"
              onClick={toggleOpen}
              data-testid="employeeDialogCancel"
            >
              {t('button.cancel')}
            </Button>
            <SubmitButton
              disabled={formik.isSubmitting}
              testId="employeeDialogUpdate"
              label={t('button.update')}
            />
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditEmployeesDialog

import React, { useReducer } from 'react'
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { RecoilRoot } from 'recoil'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import ProjectInfo from './ProjectInfo'
import EditEmployeesDialog from './EditEmployeesDialog'
import * as projectTestUtils from '../testUtils/projectTestUtils'
import { UserContext } from '../context/UserContext'
import ProjectsView from './Projects'
import { Project } from '../common/types'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult
const project = projectTestUtils.projects[0]

const expandRow = async (): Promise<void> => {
  const row = component.getByLabelText('expand row')

  await act(async () => {
    fireEvent.click(row)
    await component.findByText(t('employee.labelPlural'))
  })
}

describe('<ProjectInfo>', () => {
  beforeEach(() => {
    component = render(
      <table>
        <tbody>
          <ProjectInfo project={project} employees={project.employees} />
        </tbody>
      </table>
    )
  })

  it('renders project name', () => {
    expect(component.container).toHaveTextContent(project.name)
  })

  it('renders client name', () => {
    expect(component.container).toHaveTextContent(project.client.name)
  })
})

describe('<ProjectInfo> with employee user', () => {
  beforeEach(() => {
    component = render(
      <I18nextProvider i18n={i18n}>
        <UserContext.Provider
          value={{ user: projectTestUtils.defaultEmployee, setUserContext: jest.fn() }}
        >
          <table>
            <tbody>
              <ProjectInfo project={project} employees={project.employees} />
            </tbody>
          </table>
        </UserContext.Provider>
      </I18nextProvider>
    )
  })

  it('should not show action icons', () => {
    const editProjectsIcon = component.queryByLabelText('edit-project')
    const deleteProjectsIcon = component.queryByLabelText('delete-project')
    expect(editProjectsIcon).not.toBeInTheDocument()
    expect(deleteProjectsIcon).not.toBeInTheDocument()
  })

  it('should not show edit employees button', async () => {
    await expandRow()

    const editEmployeesIcon = component.queryByLabelText('edit-employees')
    expect(editEmployeesIcon).not.toBeInTheDocument()
  })
})
describe('<ProjectInfo> with manager user', () => {
  beforeEach(() => {
    component = render(
      <I18nextProvider i18n={i18n}>
        <UserContext.Provider
          value={{ user: projectTestUtils.defaultManager, setUserContext: jest.fn() }}
        >
          <table>
            <tbody>
              <ProjectInfo project={project} employees={project.employees} />
            </tbody>
          </table>
        </UserContext.Provider>
      </I18nextProvider>
    )
  })

  it('should show action buttons', () => {
    const editProjectsIcon = component.queryByLabelText('edit-project')
    const deleteProjectsIcon = component.queryByLabelText('delete-project')
    expect(editProjectsIcon).toBeInTheDocument()
    expect(deleteProjectsIcon).toBeInTheDocument()
  })

  it('should show edit employees button', async () => {
    await expandRow()

    const editEmployeesIcon = component.queryByLabelText('edit-employees')
    expect(editEmployeesIcon).toBeInTheDocument()
  })

  it('should be able to open edit employees dialog', async () => {
    await expandRow()

    const editEmployeesIcon = component.getByLabelText('edit-employees')
    await act(async () => {
      fireEvent.click(editEmployeesIcon)
    })

    expect(component.getByText(t('project.updateEmployees'))).toBeInTheDocument()
  })
})

describe('edit employees dialog', () => {
  const projectCopy = JSON.parse(JSON.stringify(project)) as Project
  beforeEach(async () => {
    const TestComponent: React.FC = () => {
      const [open, toggleOpen] = useReducer((value) => !value, true)

      return (
        <EditEmployeesDialog
          project={projectCopy}
          employees={projectTestUtils.employees}
          open={open}
          toggleOpen={toggleOpen}
        />
      )
    }
    component = render(
      <RecoilRoot>
        <I18nextProvider i18n={i18n}>
          <TestComponent />
        </I18nextProvider>
      </RecoilRoot>
    )
  })

  it('should have employees multipleselect, submit & cancel buttons', () => {
    expect(component.getByLabelText(t('employee.labelPlural'))).toHaveAttribute('role', 'button')
    expect(component.getByTestId('employeeDialogCancel')).toHaveAttribute('type', 'button')
    expect(component.getByTestId('employeeDialogUpdate')).toHaveAttribute('type', 'submit')
  })

  describe('when updating employees', () => {
    beforeEach(async () => {
      mockedAxios.put.mockImplementationOnce((url: string) => {
        if (url.includes('projects')) {
          const projectCopy2 = JSON.parse(JSON.stringify(project))
          projectCopy2.employees.push(projectTestUtils.employees[0])
          return Promise.resolve({ data: projectCopy2 })
        }
        return Promise.reject(new Error('not found'))
      })

      await projectTestUtils.selectEmployee(
        component,
        projectTestUtils.employees[0],
        t('employee.labelPlural')
      )
      const updateButton = component.getByTestId('employeeDialogUpdate')
      await act(async () => {
        fireEvent.click(updateButton)
        await waitForElementToBeRemoved(component.getByText(t('project.updateEmployees')))
      })
    })

    it('the form should update project object', () => {
      expect(projectCopy.employees).toContain(projectTestUtils.employees[0])
    })

    it('the form should put correct json', () => {
      const projectJson = {
        name: projectCopy.name,
        id: projectCopy.id,
        description: projectCopy.description,
        client: projectCopy.client.id,
        owner: projectCopy.owner.id,
        employees: projectCopy.employees.map((employee) => employee.id),
        billable: projectCopy.billable,
      }
      expect(axios.put).toBeCalledWith('/projects', projectJson)
    })

    afterEach(() => {
      projectCopy.employees = JSON.parse(JSON.stringify(project.employees))
    })
  })
})

describe('<ProjectsView> with employee user', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes(`/employees/${projectTestUtils.defaultEmployee.id}/projects`)) {
        return Promise.resolve({
          data: [projectTestUtils.projects[0], projectTestUtils.projects[2]],
        })
      }
      if (url.includes('projects')) {
        return Promise.resolve({ data: projectTestUtils.projects })
      }
      if (url.includes('employees')) {
        return Promise.resolve({ data: projectTestUtils.employees })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <UserContext.Provider
            value={{ user: projectTestUtils.defaultEmployee, setUserContext: jest.fn() }}
          >
            <RecoilRoot>
              <MemoryRouter initialEntries={['projects/']}>
                <Route path="projects/">
                  <ProjectsView />
                </Route>
              </MemoryRouter>
            </RecoilRoot>
          </UserContext.Provider>
        </I18nextProvider>
      )
    })
  })

  it('should render projects view', () => {
    const projectsTitle = component.getByText(t('project.title'))
    expect(projectsTitle).toBeInTheDocument()
  })

  it('should only show own projects', () => {
    const project0 = component.queryByText(projectTestUtils.projects[0].name)
    const project1 = component.queryByText(projectTestUtils.projects[1].name)
    const project2 = component.queryByText(projectTestUtils.projects[2].name)

    expect(project0).toBeInTheDocument()
    expect(project2).toBeInTheDocument()
    expect(project1).not.toBeInTheDocument()
  })

  it('should not show add project button', () => {
    const addProjectButton = component.queryByText(t('project.addProject'))
    expect(addProjectButton).not.toBeInTheDocument()
  })

  it('should not show all projects switch', () => {
    const showAllProjectsSwitch = component.queryByLabelText(t('project.showAll'))
    expect(showAllProjectsSwitch).not.toBeInTheDocument()
  })

  it('should not show actions column', () => {
    const actions = component.queryByText(t('project.actions'))
    expect(actions).not.toBeInTheDocument()
  })
})

describe('<ProjectsView> with manager user', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes(`/employees/${projectTestUtils.defaultManager.id}/projects`)) {
        return Promise.resolve({
          data: [projectTestUtils.projects[0], projectTestUtils.projects[1]],
        })
      }
      if (url.includes('projects')) {
        return Promise.resolve({ data: projectTestUtils.projects })
      }
      if (url.includes('employees')) {
        return Promise.resolve({ data: projectTestUtils.employees })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <UserContext.Provider
            value={{ user: projectTestUtils.defaultManager, setUserContext: jest.fn() }}
          >
            <RecoilRoot>
              <MemoryRouter initialEntries={['projects/']}>
                <Route path="projects/">
                  <ProjectsView />
                </Route>
              </MemoryRouter>
            </RecoilRoot>
          </UserContext.Provider>
        </I18nextProvider>
      )
    })
  })

  it('should render projects view', () => {
    const projectsTitle = component.getByText(t('project.title'))
    expect(projectsTitle).toBeInTheDocument()
  })

  it('should show own projects', () => {
    const project0 = component.queryByText(projectTestUtils.projects[0].name)
    const project1 = component.queryByText(projectTestUtils.projects[1].name)
    const project2 = component.queryByText(projectTestUtils.projects[2].name)

    expect(project0).toBeInTheDocument()
    expect(project1).toBeInTheDocument()
    expect(project2).not.toBeInTheDocument()
  })

  it('should show add project button', () => {
    const addProjectButton = component.getByText(t('project.addProject'))
    expect(addProjectButton).toBeInTheDocument()
  })

  it('should show all projects switch', () => {
    const showAllProjectsSwitch = component.getByText(t('project.showAll'))
    expect(showAllProjectsSwitch).toBeInTheDocument()
  })

  it('should be possible to view all projects', async () => {
    const showAllProjectsSwitch = component.getByText(t('project.showAll'))
    await act(async () => {
      fireEvent.click(showAllProjectsSwitch)
    })

    const project0 = component.queryByText(projectTestUtils.projects[0].name)
    const project1 = component.queryByText(projectTestUtils.projects[1].name)
    const project2 = component.queryByText(projectTestUtils.projects[2].name)

    expect(project0).toBeInTheDocument()
    expect(project1).toBeInTheDocument()
    expect(project2).toBeInTheDocument()
  })

  it('should show actions column', () => {
    const actions = component.queryByText(t('project.actions'))
    expect(actions).toBeInTheDocument()
  })
})

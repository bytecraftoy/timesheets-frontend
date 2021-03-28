import React from 'react'
import { act, fireEvent, render, RenderResult } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { RecoilRoot } from 'recoil'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import ProjectInfo from './ProjectInfo'
import * as projectTestUtils from '../testUtils/projectTestUtils'
import { UserContext } from '../context/UserContext'
import ProjectsView from './Projects'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult
const project = projectTestUtils.projects[0]

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
    const expandRow = component.getByLabelText('expand row')

    await act(async () => {
      fireEvent.click(expandRow)
    })
    await component.findByText(t('employee.labelPlural'))

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
    const expandRow = component.getByLabelText('expand row')

    await act(async () => {
      fireEvent.click(expandRow)
    })
    await component.findByText(t('employee.labelPlural'))

    const editEmployeesIcon = component.queryByLabelText('edit-employees')
    expect(editEmployeesIcon).toBeInTheDocument()
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

import React from 'react'
import { render, RenderResult, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import * as projectTestUtils from '../testUtils/projectTestUtils'
import { timeInputs1 } from '../testUtils/timeInputTestUtils'
import App from './App'
import { UserContext } from '../context/UserContext'
import SideBar from '../navigation/SideBar'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let app: RenderResult

describe('app with manager user', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('clients')) {
        return Promise.resolve({ data: projectTestUtils.clients })
      }
      if (url.includes('employees')) {
        return Promise.resolve({ data: projectTestUtils.employees })
      }
      if (url.includes('managers')) {
        return Promise.resolve({ data: projectTestUtils.managers })
      }
      if (url.includes('hours')) {
        return Promise.resolve({ data: timeInputs1 })
      }
      if (url.includes('projects')) {
        return Promise.resolve({ data: projectTestUtils.projects })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      app = render(
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      )
      await app.findByText(t('app.title'))
    })
  })

  it('should display timesheets title', () => {
    const appTitle = app.getByText(t('app.title'))
    expect(appTitle).toBeInTheDocument()
  })

  it('should display dashboard title', () => {
    const dashboardTitle = app.getByText(t('dashboard.title'))
    expect(dashboardTitle).toBeInTheDocument()
  })

  it('should display navigation link to projects view', () => {
    const projectsTitle = app.getByText(t('project.title'))
    expect(projectsTitle).toBeInTheDocument()
  })

  it('should display navigation link to reports view', () => {
    const reportsTitle = app.getByText(t('report.title'))
    expect(reportsTitle).toBeInTheDocument()
  })

  it('should toggle visible navigation link to billing reports view', async () => {
    const reportsTitle = app.getByText(t('report.title'))

    await act(async () => {
      fireEvent.click(reportsTitle)
    })
    await app.findByText(t('report.billing.label'))

    const billingReportsTitle = app.getByText(t('report.billing.label'))
    expect(billingReportsTitle).toBeInTheDocument()
  })

  it('should toggle visible navigation link to salary reports view', async () => {
    const reportsTitle = app.getByText(t('report.title'))

    await act(async () => {
      fireEvent.click(reportsTitle)
    })
    await app.findByText(t('report.salary.label'))

    const billingReportsTitle = app.getByText(t('report.salary.label'))
    expect(billingReportsTitle).toBeInTheDocument()
  })
})

describe('app with employee user', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('clients')) {
        return Promise.resolve({ data: projectTestUtils.clients })
      }
      if (url.includes('employees')) {
        return Promise.resolve({ data: projectTestUtils.employees })
      }
      if (url.includes('managers')) {
        return Promise.resolve({ data: projectTestUtils.managers })
      }
      if (url.includes('hours')) {
        return Promise.resolve({ data: timeInputs1 })
      }
      if (url.includes('projects')) {
        return Promise.resolve({ data: projectTestUtils.projects })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      app = render(
        <I18nextProvider i18n={i18n}>
          <UserContext.Provider
            value={{ user: projectTestUtils.defaultEmployee, setUserContext: jest.fn() }}
          >
            <MemoryRouter initialEntries={['/']}>
              <Route path="/">
                <SideBar open handleDrawerClose={jest.fn()} />
              </Route>
            </MemoryRouter>
          </UserContext.Provider>
        </I18nextProvider>
      )
      await app.findByText(t('dashboard.title'))
    })
  })

  it('should display navigation link to my projects view', () => {
    const projectsTitle = app.getByText(t('project.myProjectsLabel'))
    expect(projectsTitle).toBeInTheDocument()
  })

  it('should display navigation link to my salary reports view', () => {
    const reportsTitle = app.getByText(t('report.salary.mySalaryReportLabel'))
    expect(reportsTitle).toBeInTheDocument()
  })
})

describe('projects', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('clients')) {
        return Promise.resolve({ data: projectTestUtils.clients })
      }
      if (url.includes('managers')) {
        return Promise.resolve({ data: projectTestUtils.managers })
      }
      if (url.includes('hours')) {
        return Promise.resolve({ data: timeInputs1 })
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
      app = render(
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      )
      await app.findByText(t('app.title'))
    })
  })

  describe('when navigating into projects with manager user', () => {
    beforeEach(async () => {
      const projectLink = app.getByTestId('projects-nav')

      await act(async () => {
        fireEvent.click(projectLink)
        await app.findByText(/add project/i)
      })
    })

    it("should display user's projects", () => {
      expect(app.getByText(projectTestUtils.projects[0].name)).toBeInTheDocument()
    })

    describe('when adding a project', () => {
      const newProjectName = 'Testproject'

      beforeEach(async () => {
        await act(async () => {
          const addProjectButton = app.getByText(/add project/i)
          fireEvent.click(addProjectButton)
        })

        mockedAxios.post.mockImplementationOnce((url: string) => {
          if (url.includes('projects')) {
            return Promise.resolve({ data: { name: newProjectName } })
          }
          return Promise.reject(new Error('not found'))
        })

        await app.findByText(/create new project/i)

        await act(async () => {
          await projectTestUtils.changeNameInput(app, newProjectName)
          await projectTestUtils.selectClient(app, projectTestUtils.clients[0])
          await projectTestUtils.selectManager(app, projectTestUtils.managers[0])

          const submitButton = app.getByText(t('button.create'))
          fireEvent.click(submitButton)
        })

        await app.findByText(/add project/i)
      })

      it('should display notification after successful project add', async () => {
        expect(app.getByText(`${newProjectName} created succesfully!`)).toBeInTheDocument()
      })
    })
  })
})

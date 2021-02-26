import React from 'react'
import { render, RenderResult, fireEvent, act } from '@testing-library/react'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import * as projectTestUtils from '../testUtils/projectTestUtils'
import { timeInputs1 } from '../testUtils/timeInputTestUtils'
import App from './App'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let app: RenderResult

describe('app', () => {
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
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      app = render(
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      )
    })
  })

  it('should display timesheets title', () => {
    const appTitle = app.getByText(t('app.title'))
    expect(appTitle).toBeInTheDocument()
  })

  it('should display navigation link to projects view', () => {
    const projectsTitle = app.getByText(t('project.title'))
    expect(projectsTitle).toBeInTheDocument()
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

  describe('when navigating into projects', () => {
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

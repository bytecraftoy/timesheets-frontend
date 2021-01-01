import React from 'react'
import { render, RenderResult } from '@testing-library/react'

import ProjectInfo from './ProjectInfo'
import { Project } from '../common/types'

let component: RenderResult

describe('single project', () => {
  const project: Project = {
    id: 1,
    name: 'Bytecraft Timesheets project',
    description: 'Bytecraft Timesheets project',
    owner: {
      id: 5,
      username: 'A',
      firstName: 'A',
      lastName: 'A',
    },
    creator: {
      id: 5,
      username: 'A',
      firstName: 'A',
      lastName: 'A',
    },
    managers: [
      {
        id: 1,
        username: 'Manager1',
        firstName: 'Some',
        lastName: 'Manager',
      },
      {
        id: 2,
        username: 'Manager2',
        firstName: 'Another',
        lastName: 'Manager',
      },
    ],
    client: { id: 1, name: 'Bytecraft' },
    billable: true,
    employees: [
      {
        id: 3,
        username: 'dev3',
        firstName: 'Some',
        lastName: 'Developer',
      },
      {
        id: 4,
        username: 'dev4',
        firstName: 'Another',
        lastName: 'Developer',
      },
    ],
    tags: ['Back-end', 'Front-end', 'Fullstack', 'Planning'],
    creationTimestamp: 100000010000,
    lastEdited: 100000010010,
    lastEditor: {
      id: 1,
      username: 'Manager1',
      firstName: 'Some',
      lastName: 'Manager',
    },
  }

  beforeEach(() => {
    component = render(
      <table>
        <tbody>
          <ProjectInfo project={project} />
        </tbody>
      </table>
    )
  })

  test('renders project name', () => {
    expect(component.container).toHaveTextContent(project.name)
  })

  test('renders client name', () => {
    expect(component.container).toHaveTextContent(project.client.name)
  })
})

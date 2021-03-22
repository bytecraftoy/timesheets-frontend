import React from 'react'
import { render, RenderResult } from '@testing-library/react'

import ProjectInfo from './ProjectInfo'
import { projects } from '../testUtils/projectTestUtils'

let component: RenderResult
const project = projects[0]

describe('single project', () => {
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

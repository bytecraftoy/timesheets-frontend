import React from 'react'
import { render, RenderResult } from '@testing-library/react'

import ProjectInfo from './ProjectInfo'
import { project } from '../testUtils/projectTestUtils'

let component: RenderResult

describe('single project', () => {
  beforeEach(() => {
    component = render(
      <table>
        <tbody>
          <ProjectInfo project={project} />
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

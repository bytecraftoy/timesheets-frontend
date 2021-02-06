import { BillingReportData } from '../common/types'

const data: BillingReportData = {
  startDate: '2021-01-01',
  endDate: '2021-01-31',
  creationMillis: 1612329726188,
  client: {
    id: '1',
    name: 'Client 1',
  },
  projects: [
    {
      id: '1',
      name: 'Bytecraft Timesheets project',
      description: 'Bytecraft Timesheets project',
      billable: true,
      projectTotal: 4500,
      employees: [
        {
          id: '3',
          username: 'dev3',
          firstName: 'Some',
          lastName: 'Developer',
          timeInputs: [
            {
              id: '1',
              date: '2021-01-01',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '2',
              date: '2021-01-02',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '3',
              date: '2021-01-03',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '4',
              date: '2021-01-04',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '5',
              date: '2021-01-05',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
          ],
          employeeTotal: 2250,
        },
        {
          id: '4',
          username: 'dev4',
          firstName: 'Another',
          lastName: 'Developer',
          timeInputs: [
            {
              id: '1',
              date: '2021-01-01',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '2',
              date: '2021-01-02',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '3',
              date: '2021-01-03',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '4',
              date: '2021-01-04',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '5',
              date: '2021-01-05',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
          ],
          employeeTotal: 2250,
        },
      ],
    },
    {
      id: '2',
      name: 'Another project',
      description: 'Just a random dummy project',
      billable: true,
      projectTotal: 4567,
      employees: [
        {
          id: '3',
          username: 'dev3',
          firstName: 'Some',
          lastName: 'Developer',
          timeInputs: [
            {
              id: '1',
              date: '2021-01-01',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '2',
              date: '2021-01-02',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '3',
              date: '2021-01-03',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '4',
              date: '2021-01-04',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '5',
              date: '2021-01-05',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
          ],
          employeeTotal: 2250,
        },
        {
          id: '4',
          username: 'dev4',
          firstName: 'Another',
          lastName: 'Developer',
          timeInputs: [
            {
              id: '1',
              date: '2021-01-01',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '2',
              date: '2021-01-02',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '3',
              date: '2021-01-03',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '4',
              date: '2021-01-04',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
            {
              id: '5',
              date: '2021-01-05',
              description: 'koodailua',
              input: 450,
              creationTimestamp: 100,
              lastEdited: 100,
            },
          ],
          employeeTotal: 2250,
        },
      ],
    },
  ],
  grandTotal: 12345,
}

export default data

# Timesheets front-end

## About this project

Timesheets is an application for tracking work hours in customer projects and creating reports for billing and salary purposes.

This document describes the high-level architecture of Timesheets front-end.

## Architecture

Timesheets front-end is made with TypeScript and React and several other libraries for different purposes:

- Axios - HTTP client
- clsx - Conditional classnames construction
- date-fns - Date utility functions
- Formik - Forms
- i18next - Localisation
- just-debounce-it - Debounce
- Material UI - Component library and styles
- Mousetrap - Keyboard shortcuts
- qs - HTTP request querystring parsing and stringifying
- Recoil - State management

All the components have been for the most part grouped by features such as dashboard, project, report. There are some general components (Button, Form) that are used across other components.

The application uses Jest and React Testing Library for unit testing. All unit tests are located in the same folder as the component under test. testUtils contains helper functions and data for tests. Cypress is used for E2E testing and Cypress test files are in cypress directory in project root.

Code quality and adherance to coding standards is ensured with Eslint with Airbnb configuration and Prettier. Their configuration files can be found in project root.

## How to build and run this project

- Install the back-end. [Read instructions here](<!-- TODO: add link -->)

- Install yarn package manager. (MacOS: `brew install yarn`)

- Clone this repo.

- Execute `yarn install`

- Run the project: `yarn start`

- All other scripts can be found in [README.md](./README.md) or [package.json](./package.json)

## Website Pages

- Dashboard / Landing page
- Projects & Add Project Form
- Billing Report Form & Preview
- Salary Report Form & Preview

<!-- TODO: add pictures -->

## Project Directory Structure

```
.
├── cypress
├── public
├── src
│   │── app
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   └── styles.ts
│   ├── button
│   │   ├── SelectAllButton.tsx
│   │   ├── SubmitButton.tsx
│   │   └── UnselectAllButton.tsx
│   ├── common
│   │   ├── atoms.ts
│   │   ├── constants.ts
│   │   └── types.ts
│   ├── context
│   │   ├── UserContext.tsx
│   │   └── UserContextSelect.tsx
│   ├── dashboard
│   │   ├── DailyTotalRow.tsx
│   │   ├── Dashboard.test.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TimeInputCell.tsx
│   │   ├── TimeInputsForm.tsx
│   │   ├── TimeInputsFormControlRow.tsx
│   │   ├── TimeInputsRow.tsx
│   │   ├── WeekRow.tsx
│   │   ├── WeekdaysRow.tsx
│   │   ├── WeeklyView.tsx
│   │   └── dashboardService.ts
│   ├── form
│   │   ├── DateErrors.tsx
│   │   ├── DatePicker.tsx
│   │   ├── FormCheckbox.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormSelectMultiple.tsx
│   │   ├── FormSelectMultipleWithButtons.tsx
│   │   ├── FormSwitch.tsx
│   │   ├── FormTextField.tsx
│   │   ├── TimeIntervalSelects.tsx
│   │   └── formService.ts
│   ├── i18n.ts
│   ├── index.css
│   ├── index.tsx
│   ├── locales
│   │   └── en_translation.json
│   ├── navigation
│   │   ├── Content.tsx
│   │   ├── NavList.tsx
│   │   ├── NavListItem.tsx
│   │   ├── SideBar.tsx
│   │   └── styles.ts
│   ├── project
│   │   ├── EditEmployeesDialog.tsx
│   │   ├── ProjectForm.test.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectInfo.tsx
│   │   ├── Projects.test.tsx
│   │   ├── Projects.tsx
│   │   └── ProjectsTable.tsx
│   ├── react-app-env.d.ts
│   ├── report
│   │   ├── BillableCheckboxGroup.tsx
│   │   ├── CountTotalRow.tsx
│   │   ├── DetailsTableHeaderRow.tsx
│   │   ├── NoHoursRow.tsx
│   │   ├── ReportTableTitle.tsx
│   │   ├── SummaryTableHeaderRow.tsx
│   │   ├── SummaryTotalRow.tsx
│   │   ├── TimeInputRow.tsx
│   │   ├── TimeIntervalQuickSelects.tsx
│   │   ├── billingReport
│   │   │   ├── BillingReport.tsx
│   │   │   ├── BillingReportDetailsTable.tsx
│   │   │   ├── BillingReportForm.test.tsx
│   │   │   ├── BillingReportForm.tsx
│   │   │   ├── BillingReportPreview.test.tsx
│   │   │   ├── BillingReportPreview.tsx
│   │   │   └── BillingReportSummaryTable.tsx
│   │   ├── reportService.tsx
│   │   ├── salaryReport
│   │   │   ├── SalaryReport.tsx
│   │   │   ├── SalaryReportDetailsTable.tsx
│   │   │   ├── SalaryReportForm.test.tsx
│   │   │   ├── SalaryReportForm.tsx
│   │   │   ├── SalaryReportPreview.test.tsx
│   │   │   ├── SalaryReportPreview.tsx
│   │   │   └── SalaryReportSummaryTable.tsx
│   │   └── styles.ts
│   ├── services
│   │   ├── clientService.ts
│   │   ├── dateAndTimeService.ts
│   │   ├── employeeService.ts
│   │   ├── errorHandlingService.ts
│   │   ├── managerService.ts
│   │   └── projectService.ts
│   ├── setupTests.ts
│   ├── testUtils
│   │   ├── projectTestUtils.tsx
│   │   ├── reportTestUtils.tsx
│   │   ├── testUtils.tsx
│   │   └── timeInputTestUtils.tsx
│   └── toast
│       ├── Notification.tsx
│       ├── Toast.test.tsx
│       └── Toast.tsx
├── .env ...
├── .eslintrc.json
├── .gitignore
├── .gilab-ci.yml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── cypress.json
├── package.json
├── Procfile
├── README.md
├── server.js
├── tsconfig.json
└── yarn.lock
```

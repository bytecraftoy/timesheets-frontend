# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn install`

After cloning the repository, run this to get the dependencies.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `yarn coverage`

Launches the test runner in the interactive watch mode and creates a code coverage report. The html-formatted report can be found in `coverage` folder and viewed in the browser.

To see a textual report in different format in the terminal, you can try with

`CI=true yarn test --coverage --coverageReporters="text-summary"`

### `yarn lint`

Lints all .ts and .tsx files in the `src` folder.

### `yarn fix`

Lints all .ts and .tsx files in the `src` folder and automatically fixes problems.

### `yarn format`

Formats all .ts and .tsx files in the `src` folder with Prettier.

### `yarn run cypress open`

Open cypress test suite.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Documentation

## Supported formats for inputting hours

Most formats also allow spaces in between the different parts for example '1h25m' can also be writen this way: ' 1 h 25 m '.

- 1.2
- 1,2
- 1.2h
- 1,2h
- 110m
- 110min
- 1h 25
- 1h 25m
- 1h 25min
- 5:30

## Shortcuts for the hours inputting form

Up and down arrow keys can be used to move between different rows.

Tab and shift + tab keys can be used to move forward or backward between different text boxes. Pressing tab at the end of a row will change the focused text box to be the first text box on the next row. Pressing shift + tab at the first text box of a row works the same way but in reverse.

Description fields can be shown and hidden using ctrl + alt + a.

Current week can be changed using ctrl + , to go to the last week and ctrl + . to go to the next week.

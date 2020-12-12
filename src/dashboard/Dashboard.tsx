import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const useStyles = makeStyles({
  button: {
    margin: 8,
  },
  table: {
    minWidth: 650,
  },
})

function getWeek(): string[] {
  const curr = new Date()
  const week = []
  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 1; i <= 7; i += 1) {
    const first = curr.getDate() - curr.getDay() + i
    const day = new Date(curr.setDate(first))
    const dayString = `${weekdays[day.getDay()]} ${day.getDate()}.${day.getMonth()}.`
    week.push(dayString)
  }
  return week
}

const Dashboard: React.FC = () => {
  const classes = useStyles()

  const hours = [7.5, 6, 5.75, 9, 8]

  return (
    <>
      <Typography variant="h2">Input hours</Typography>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item xs={2}>
          <IconButton color="primary" className={classes.button}>
            <ArrowBackIosIcon />
          </IconButton>
        </Grid>
        <Grid item xs={8}>
          <Typography align="center" variant="h5">
            Week
          </Typography>
        </Grid>
        <Grid container xs={2} justify="flex-end">
          <IconButton color="primary" className={classes.button}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              {getWeek().map((day: string) => (
                <TableCell key={day} align="right">
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Timesheets project</TableCell>
              {hours.map((time: number) => (
                <TableCell key={time} align="right">
                  {time}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Another project</TableCell>
              {hours.map((time: number) => (
                <TableCell key={time} align="right">
                  {time}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Dashboard

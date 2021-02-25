import React, { useState } from 'react'
import {
  Switch,
  FormControlLabel,
  Popover,
  Grid,
  Typography,
  Container,
  IconButton,
  Paper,
  makeStyles,
} from '@material-ui/core'
import Help from '@material-ui/icons/Help'
import { useTranslation } from 'react-i18next'
import { TimeInputsFormControlRowProps } from '../common/types'
import { TIMEINPUTSUPPORTEDFORMATS } from '../common/constants'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}))

const TimeInputsFormControlRow: React.FC<TimeInputsFormControlRowProps> = ({
  disableShowDescription,
  changeShowDescription,
  showDescription,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) =>
    setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)
  return (
    <Grid container direction="row" justify="space-between" alignItems="flex-start">
      <Grid item>
        <FormControlLabel
          label={t('project.description.label')}
          control={
            <Switch
              onChange={(e) => {
                changeShowDescription()
                e.currentTarget.blur()
              }}
              disabled={disableShowDescription}
              color="primary"
              checked={showDescription}
            />
          }
        />
      </Grid>
      <Grid item>
        <IconButton
          aria-describedby={open ? 'shortcuts-formats-popover' : undefined}
          onClick={handlePopoverOpen}
        >
          <Help />
        </IconButton>
        <Popover
          id="shortcuts-formats-popover"
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={handlePopoverClose}
        >
          <Container maxWidth="xs" disableGutters>
            <Paper className={classes.paper} variant="outlined">
              <Typography variant="body1" gutterBottom>
                {t('timeInputs.supportedFormatsTitle')}
              </Typography>
              {TIMEINPUTSUPPORTEDFORMATS.map((formatGroup) => (
                <Typography key={formatGroup[0]} variant="body2">
                  {formatGroup.join('\u2003')}
                </Typography>
              ))}
              <Typography gutterBottom />
              <Typography variant="body1" gutterBottom>
                {t('timeInputs.shortcutsTitle')}
              </Typography>
              {t<{ key: string; action: string }[]>('timeInputs.shortcuts', {
                returnObjects: true,
              }).map((shortcut) => (
                <Typography key={shortcut.key} variant="body2">
                  <strong>{shortcut.key}</strong> {shortcut.action}
                </Typography>
              ))}
            </Paper>
          </Container>
        </Popover>
      </Grid>
    </Grid>
  )
}

export default TimeInputsFormControlRow

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Grid } from '@material-ui/core'

interface GenerateButtonProps {
  className: string
  disabled: boolean | undefined
}

// TODO: data-testid as props

const GenerateButton: React.FC<GenerateButtonProps> = ({ className, disabled }) => {
  const { t } = useTranslation()
  return (
    <Grid item>
      <Button
        className={className}
        disabled={disabled}
        variant="contained"
        type="submit"
        color="primary"
        data-testid="billingReportFormGenerate"
      >
        {t('button.generate')}
      </Button>
    </Grid>
  )
}

export default GenerateButton

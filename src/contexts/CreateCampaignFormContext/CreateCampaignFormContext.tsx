import { Button } from '@mantine/core'
import { createFormContext } from '@mantine/form'
import { validateCreateCampaignFrom } from 'helpers/validators'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { FC, PropsWithChildren, useEffect } from 'react'
import { CampaignUI } from 'types'

const [CrCampaignFormProvider, useCreateCampaignFormContext, useCreateCampaignForm] =
  createFormContext<CampaignUI>()

const CreateCampaignFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { campaign, updateAllCampaign } = useCreateCampaignContext()

  const form = useCreateCampaignForm({
    initialValues: campaign,
    validate: validateCreateCampaignFrom
  })

  const handleSubmit = (event: any) => {
    event.preventDefault()
    form.validate()
    if (form.isValid()) updateAllCampaign(form.values as CampaignUI)
    else console.log('the form is not valid')
  }

  useEffect(() => {
    form.setValues(campaign)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign])

  return (
    <CrCampaignFormProvider form={form}>
      <form onSubmit={handleSubmit}>
        {children}
        <Button type="submit" style={{ display: 'none' }} id="createCampaignSubmitBtn" />
      </form>
    </CrCampaignFormProvider>
  )
}

export { CreateCampaignFormProvider, useCreateCampaignFormContext }

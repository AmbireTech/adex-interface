import { FC, PropsWithChildren, createContext, useMemo, useState } from 'react'

type CreateCampaign = {
  test: string
  setTest: React.Dispatch<React.SetStateAction<string>>
}

const CreateCampaignContext = createContext<CreateCampaign | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [test, setTest] = useState('test')

  return (
    <CreateCampaignContext.Provider
      value={useMemo(
        () => ({
          test,
          setTest
        }),
        [test]
      )}
    >
      {children}
    </CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }

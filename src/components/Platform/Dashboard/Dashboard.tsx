import { FC } from 'react'
import { useAccount } from 'hooks'
import adxLogo from 'assets/logos/Ambire_AdEx_color_white_ver.svg'


const Dashboard: FC = () => {
    const account = useAccount()

    return (
        <div>
            <img src={adxLogo} />
            {account?.id || 'NO ADDR'}
        </div>
    )
}

export default Dashboard
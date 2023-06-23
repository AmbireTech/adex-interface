import { IBillingDetails, IInvoiceDetails, IInvoices, IStatements } from 'types'

const invoiceElements: IInvoices[] = [
  {
    companyName: 'Company Name Long 1',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 2',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 3',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 4',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 5',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 6',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 7',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 8',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 9',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 10',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 11',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 12',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 13',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 14',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 15',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 16',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 17',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 18',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 19',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 20',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 21',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 22',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 23',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 24',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 25',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 26',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 27',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 1',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 2',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 3',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 4',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 5',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 6',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 7',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 8',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 9',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 10',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 11',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 12',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 13',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 14',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 15',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 16',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 17',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 18',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 19',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 20',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 21',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 22',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 23',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 24',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 25',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 26',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 27',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 1',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 2',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 3',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 4',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 5',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 6',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 7',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 8',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 9',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 10',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 11',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 12',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 13',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 14',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 15',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 16',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 17',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 18',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 19',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 20',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 21',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 22',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 23',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 24',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 25',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 26',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 27',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 1',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 2',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 3',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 4',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 5',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 6',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 7',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 8',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 9',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 10',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 11',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 12',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 13',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 14',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 15',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 16',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 17',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 18',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 19',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 20',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 21',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 22',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 23',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 24',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 25',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    companyName: 'Company Name Long 26',
    campaignPeriod: { from: '01/03/23', to: '02/03/23' },
    amountSpent: '2000.00 DAI'
  },
  {
    companyName: 'Company Name Long 27',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  }
]
const statementElements: IStatements[] = [
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  }
]
// const invoiceElements: IInvoices[] | null = null
// const statementElements: IStatements[] | null = null
const invoiceDetails: IInvoiceDetails = {
  invoiceId: 'BDG0086',
  invoiceDate: '01.02.2023',
  seller: {
    name: 'UAB Bitdegree',
    address: 'address line 1',
    city: 'City 1',
    country: 'Country 1',
    regNumber: '304503203',
    vatRegNumber: 'LT100011416217',
    ethAddress: '0x2F0FC72542A8bD8ds1c51B2751686A3Bf3eks42w'
  },
  buyer: {
    name: 'AdEx Network',
    address: 'address line 2',
    city: 'City 2',
    country: 'Country 2',
    regNumber: '304503203',
    vatRegNumber: 'LT100011416217',
    ethAddress: '0x2F0FC72542A8bD8ds1c51B2751686A3Bf3eks42w'
  },
  invoiceData: [
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Test',
      unitOfMeasure: 'Vienetas',
      quantity: 2,
      priceInUsd: 10.0,
      amountInUsd: 20.0
    },
    {
      description: 'Exposure service Exposure service Exposure service',
      unitOfMeasure: 'Vienetas',
      quantity: 1,
      priceInUsd: 3940.0,
      amountInUsd: 3940.0
    },
    {
      description: 'Test',
      unitOfMeasure: 'Vienetas',
      quantity: 2,
      priceInUsd: 10.0,
      amountInUsd: 20.0
    }
  ],
  vatPercentageInUSD: 10
}
const initBillingDetails: IBillingDetails = {
  firstName: '',
  lastName: '',
  companyName: '',
  companyNumber: 1,
  companyNumberPrim: 2,
  companyAddress: '',
  companyCountry: '',
  companyCity: '',
  companyZipCode: 0
}

export { invoiceElements, statementElements, invoiceDetails, initBillingDetails }

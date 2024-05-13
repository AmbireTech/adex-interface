import { IInvoiceDetails, IStatements } from 'types'

// const invoiceElements: IInvoices[] = [
const invoiceElements = [
  {
    id: 1,
    companyName: 'Company Name Long 0',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 2,
    companyName: 'Company Name Long 1',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 3,
    companyName: 'Company Name Long 2',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 4,
    companyName: 'Company Name Long 3',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 5,
    companyName: 'Company Name Long 4',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 6,
    companyName: 'Company Name Long 5',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 7,
    companyName: 'Company Name Long 6',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 8,
    companyName: 'Company Name Long 7',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 9,
    companyName: 'Company Name Long 8',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 10,
    companyName: 'Company Name Long 9',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 11,
    companyName: 'Company Name Long 10',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 12,
    companyName: 'Company Name Long 11',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 13,
    companyName: 'Company Name Long 12',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 14,
    companyName: 'Company Name Long 13',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 15,
    companyName: 'Company Name Long 14',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 16,
    companyName: 'Company Name Long 15',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 17,
    companyName: 'Company Name Long 16',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 18,
    companyName: 'Company Name Long 17',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 19,
    companyName: 'Company Name Long 18',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 20,
    companyName: 'Company Name Long 19',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 21,
    companyName: 'Company Name Long 20',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 22,
    companyName: 'Company Name Long 21',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 23,
    companyName: 'Company Name Long 22',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 24,
    companyName: 'Company Name Long 23',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 25,
    companyName: 'Company Name Long 24',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 26,
    companyName: 'Company Name Long 25',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 27,
    companyName: 'Company Name Long 26',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 28,
    companyName: 'Company Name Long 27',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 29,
    companyName: 'Company Name Long 28',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 30,
    companyName: 'Company Name Long 29',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 31,
    companyName: 'Company Name Long 30',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 32,
    companyName: 'Company Name Long 31',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 33,
    companyName: 'Company Name Long 32',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 34,
    companyName: 'Company Name Long 33',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 35,
    companyName: 'Company Name Long 34',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 36,
    companyName: 'Company Name Long 35',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 37,
    companyName: 'Company Name Long 36',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 38,
    companyName: 'Company Name Long 37',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 39,
    companyName: 'Company Name Long 38',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 40,
    companyName: 'Company Name Long 39',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 41,
    companyName: 'Company Name Long 40',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 42,
    companyName: 'Company Name Long 41',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 43,
    companyName: 'Company Name Long 42',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 44,
    companyName: 'Company Name Long 43',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 45,
    companyName: 'Company Name Long 44',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 46,
    companyName: 'Company Name Long 45',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 47,
    companyName: 'Company Name Long 46',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 48,
    companyName: 'Company Name Long 47',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 49,
    companyName: 'Company Name Long 48',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 50,
    companyName: 'Company Name Long 49',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 51,
    companyName: 'Company Name Long 50',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 52,
    companyName: 'Company Name Long 51',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 53,
    companyName: 'Company Name Long 52',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 54,
    companyName: 'Company Name Long 53',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 55,
    companyName: 'Company Name Long 54',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 56,
    companyName: 'Company Name Long 55',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 57,
    companyName: 'Company Name Long 56',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 58,
    companyName: 'Company Name Long 57',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 59,
    companyName: 'Company Name Long 58',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 60,
    companyName: 'Company Name Long 59',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 61,
    companyName: 'Company Name Long 60',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 62,
    companyName: 'Company Name Long 61',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 63,
    companyName: 'Company Name Long 62',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 64,
    companyName: 'Company Name Long 63',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 65,
    companyName: 'Company Name Long 64',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 66,
    companyName: 'Company Name Long 65',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 67,
    companyName: 'Company Name Long 66',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 68,
    companyName: 'Company Name Long 67',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 69,
    companyName: 'Company Name Long 68',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 70,
    companyName: 'Company Name Long 69',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 71,
    companyName: 'Company Name Long 70',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 72,
    companyName: 'Company Name Long 71',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 73,
    companyName: 'Company Name Long 72',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 74,
    companyName: 'Company Name Long 73',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 75,
    companyName: 'Company Name Long 74',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 76,
    companyName: 'Company Name Long 75',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 77,
    companyName: 'Company Name Long 76',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 78,
    companyName: 'Company Name Long 77',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 79,
    companyName: 'Company Name Long 78',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 80,
    companyName: 'Company Name Long 79',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 81,
    companyName: 'Company Name Long 80',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 82,
    companyName: 'Company Name Long 81',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 83,
    companyName: 'Company Name Long 82',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 84,
    companyName: 'Company Name Long 83',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 85,
    companyName: 'Company Name Long 84',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 86,
    companyName: 'Company Name Long 85',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 87,
    companyName: 'Company Name Long 86',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 88,
    companyName: 'Company Name Long 87',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 89,
    companyName: 'Company Name Long 88',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 90,
    companyName: 'Company Name Long 89',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 91,
    companyName: 'Company Name Long 90',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 92,
    companyName: 'Company Name Long 91',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 93,
    companyName: 'Company Name Long 92',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 94,
    companyName: 'Company Name Long 93',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 95,
    companyName: 'Company Name Long 94',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 96,
    companyName: 'Company Name Long 95',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 97,
    companyName: 'Company Name Long 96',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 98,
    companyName: 'Company Name Long 97',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 99,
    companyName: 'Company Name Long 98',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  },
  {
    id: 100,
    companyName: 'Company Name Long 99',
    campaignPeriod: { from: '08/03/23', to: '12/03/23' },
    amountSpent: '3000.00 DAI'
  }
]
const statementElements: IStatements[] = [
  {
    id: 1,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 2,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 3,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 4,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 5,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 6,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 7,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 8,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 9,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 10,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 11,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 12,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 13,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 14,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 15,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 16,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 17,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 18,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 19,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 20,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 21,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 22,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 23,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 24,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 25,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 26,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 27,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 28,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 29,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 30,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 31,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 32,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 33,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 34,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 35,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 36,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 37,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 38,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 39,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 40,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 41,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 42,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 43,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 44,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 45,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 46,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 47,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 48,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 49,
    documentName: 'Statement March 2023',
    dateOfIssue: '31.03.2023'
  },
  {
    id: 50,
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

export { invoiceElements, statementElements, invoiceDetails }

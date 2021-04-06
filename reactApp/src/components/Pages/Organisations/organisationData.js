module.exports = {
    organisationEditBtnData: [
        {
            type: 'Shareholders',
            data: [{
                title: 'Distribute unallocated shares', live: true,
                content: {
                    index: 1,
                    heading: 'Distribute unallocated shares',
                    subHeading: '9900 unallocated FRST shares',
                    placeholder: 'Enter EOS Account Name',
                    fund: 'Shareholders', btn: 'Next'
                }
            },
            {

                title: 'Transfer personal holding', live: true, content: {
                    index: 2,
                    heading: 'Transfer Personal Holding',
                    subHeading: '#activeEosAccountBal#: 20 FRST Shares',
                    placeholder: 'Enter EOS Account Name',
                    fund: 'Transfer To', btn: 'Next'
                }
            },
            {
                title: 'Create new share type', live: false,
                content: {}
            }]
        },
        {
            type: 'Financials',
            data: [{
                title: 'New Dao transfer', live: true,
                content: {
                    index: 3,
                    heading: 'New Dao Transfer',
                    subHeading: 'Select transfer address, amount & propose.',
                    placeholder: 'Enter EOS Account Name',
                    fund: 'Transfer To',
                    btn: 'Next'
                }
            },
            {
                title: 'Deposit Funds', live: true, content: {
                    index: 4,
                    heading: 'New Dao Transfer',
                    subHeading: 'Select transfer address, amount & propose.',
                    placeholder: 'Select from drop down list.',
                    fund: 'Currency / Token',
                    btn: 'Propose Transaction'
                }
            }]
        }
    ],


    sideMenu: [
        {
            id: 0,
            mainMenu: 'Shareholders', headerBtnName: 'Edit',
            subMenu: [
                { name: 'Shareholders', live: true },
                { name: 'Statistics', live: false }
            ]
        },
        {
            id: 1,
            mainMenu: 'Financials', headerBtnName: 'New Transfer',
            subMenu: [
                { name: 'Financials', live: true }
            ]
        },
        {
            id: 2,
            mainMenu: 'Voting', headerBtnName: 'New Proposal',
            subMenu: [
                { name: 'Voting', live: true },
                { name: 'Settings', live: false }
            ]
        }
    ],
    upcommingFeautre: [
        'Pay Roll', 'Boards',
        'Social', 'Fundraising', 'Permissions', 'App Center'
    ]
}


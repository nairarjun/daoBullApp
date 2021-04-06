const status = [
    { key: 'All', value: 'all' },
    { key: 'Open', value: 'Open' },
    { key: 'Closed', value: 'Closed' }
],
    outcome = [
        { key: 'All', value: 'all' },
        { key: 'Passed', value: 'Passed' },
        { key: 'Rejected', value: 'Rejected' },
        { key: 'Enacted', value: 'Passed & Enacted' },
        { key: 'Pending', value: 'Pending' }
    ],

    type = [
        { key: 'All', value: 'all' },
        { key: 'Voting', value: 'Voting' },
        // { key: 'Financials', value: 'Financials' },
        { key: 'Shareholder', value: 'Shareholders' }
    ]


module.exports = {

    votingHeader1: [
        { key: 'Status', selectedValue: 'Status', data: status, style: { bottom: '-110px' } },
        { key: 'Outcome', selectedValue: 'Outcome', data: outcome, style: { bottom: '-170px' } },
        { key: 'Type', selectedValue: 'Type', data: type, style: { bottom: '-141px' } }
    ],

    votingHeader: [
        { key: 'Status', selectedValue: 'Status', data: status, style: { bottom: '-110px' } },
        { key: 'Outcome', selectedValue: 'Outcome', data: outcome, style: { bottom: '-170px' } },
        { key: 'Type', selectedValue: 'Type', data: type, style: { bottom: '-141px' } }
    ]

}
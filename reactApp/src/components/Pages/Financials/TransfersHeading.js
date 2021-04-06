import React, { useEffect, useRef, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import TransfersTable from "./TransfersTable";
import { ExportToCsv } from 'export-to-csv';
const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Financials Status',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};

const tempData = [
    {
        date: "2020-02-29",
        sourceOrRecipient: null,
        reference: "Final Split",
        amount: "-448.52",
        currency: "SAI"
    },
    {
        date: "2020-02-29",
        sourceOrRecipient: null,
        reference: "Final Split",
        amount: "-448.52",
        currency: "SAI"
    },
    {
        date: "2020-02-29",
        sourceOrRecipient: null,
        reference: "Final Split",
        amount: "-448.52",
        currency: "SAI"
    },
    {
        date: "2020-02-29",
        sourceOrRecipient: null,
        reference: "Final Split",
        amount: "-448.52",
        currency: "SAI"
    },
    {
        date: "2020-02-29",
        sourceOrRecipient: null,
        reference: "Final Split",
        amount: "-448.52",
        currency: "SAI"
    },

]
const csvExporter = new ExportToCsv(options);

const outcome = [
    { key: 'Token', value: 'token' },
    { key: 'All', value: 'all' },
    { key: 'Passed', value: 'passed' },
    { key: 'Rejected', value: 'rejected' },
    { key: 'Enacted', value: 'enacted' },
    { key: 'Pending', value: 'pending' }
]

const type = [
    { key: 'Type', value: 'type' },
    { key: 'All', value: 'all' },
    { key: 'Voting', value: 'voting' },
    { key: 'Financials', value: 'financials' },
    { key: 'Shareholder', value: 'shareholder' }
]

const TransferHeader = [
    { key: 'Type', selectedValue: 'Type', data: type, style: { bottom: '-169px' } },
    { key: 'Outcome', selectedValue: 'Outcome', data: outcome, style: { bottom: '-198px' } },
]

const TransfersHeading = (props) => {
    const myRef = useRef();
    const [openDropBox, setOpenDropDown] = useState(false);
    const [TransferHeaders, setTransferHeaders] = useState(TransferHeader);
    const [activeDroxKey, setActiveDroxKey] = useState(null);
    const [isDropDownSelected, setDropDownSelected] = useState(false);

    const openDropDown = data => {
        setOpenDropDown(true)
        setActiveDroxKey(data.key)
    }

    const setSelectedValue = (e, option, data) => {
        e.stopPropagation();
        setDropDownSelected(true)
        TransferHeader.filter(obj => obj.key === data.key)[0].selectedValue = option.key
        setTransferHeaders(TransferHeader)
        setOpenDropDown(false)
    }

    const handleClickOutside = e => {
        if (!myRef.current.contains(e.target)) {
            openDropDown(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEvent = (event, picker) => {
    }

    const handleCallback = (start, end, label) => {
    }

    return (
        <div ref={myRef} onClick={handleClickOutside}>
            <div >
                <div className="DI_FP_Transfers_Heading">
                    <div className="DI_FP_Transfers_Title" >
                        {'Transfers'}
                    </div>
                    <div className="DI_FP_Export_Wrapper" onClick={() => csvExporter.generateCsv(tempData)}>
                        <div className="DI_FP_Export_Text" >
                            {'Export'}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="voting_header" style={{ paddingLeft: '0px' }}>
                        {
                            TransferHeaders.map((obj, i) => {
                                return (
                                    <div name={obj.key} id={obj.key} className="dropdown voting-status" onClick={() => openDropDown(obj)}>

                                        <span className="votingstatus-text">{obj.selectedValue}</span><span><i className="fa fa-angle-down votingstatus-down"></i></span>
                                        {/* <input className="selected-inp" type="hidden" /> */}
                                        {
                                            openDropBox && activeDroxKey === obj.key &&
                                            <ul className="options" style={obj.style}>
                                                {obj.data.length > 0 && obj.data.map((opt, i) =>
                                                    <li data-value={`${opt.value}`} onClick={(e) => setSelectedValue(e, opt, obj)}>{opt.key}</li>
                                                )}
                                            </ul>
                                        }


                                    </div>
                                )
                            })
                        }

                        <DateRangePicker onEvent={handleEvent} onCallback={handleCallback}>
                            <div className="dropdown voting-status" >
                                <span className="votingstatus-text">Start | End </span><span><i className="fa fa-angle-down votingstatus-down"></i></span>
                            </div>

                        </DateRangePicker>

                    </div>
                </div>
            </div>
            <div className="DI_FP_Transfers_Table_main">
                <TransfersTable tempData={tempData} />
            </div>
        </div>
    )
}

export default TransfersHeading;
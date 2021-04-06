import React, { useEffect, useRef, useState } from 'react';
import VotingCard from './VotingCard';
import moment from 'moment';
import VotingDetails from "./VotingDetails";
import EOSIOApi from '../../../../common/eosio-apiService';
import { REACT_APP_EOSIO_CONTRACT_ACCOUNT } from "../../../../common/config";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import './Voting.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { votingHeader1, votingHeader } from "./VotingFilters";

const Voting = (props) => {
    const myRef = useRef();
    const [data1, setData1] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [votingDtls, setVotingDtls] = useState(false);
    const [openDropBox, setOpenDropDown] = useState(false);
    const [activeDroxKey, setActiveDroxKey] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);
    const [votingDtlsData, setVotingDtlsData] = useState({});
    const [votinQuestionList, setvotinQuestionList] = useState([]);
    const [votingHeaders, setVotingHeaders] = useState(votingHeader);
    const [isDropDownSelected, setDropDownSelected] = useState(false);
    const [selectedFilters, setFilters] = useState({ Status: '', Outcome: '', Type: '' });
    const eosio = new EOSIOApi(REACT_APP_EOSIO_CONTRACT_ACCOUNT, props.activeUser);

    const handleClose = () => setVotingDtls(false);

    const openVotingDtls = (votings) => {
        setVotingDtls(true)
        setVotingDtlsData(votings.voteQuestionDtls)
    };


    const openDropDown = data => {
        setOpenDropDown(true)
        setActiveDroxKey(data.key)
    }

    const setSelectedValue = async (e, option, data) => {
        e.stopPropagation();
        setDropDownSelected(true)
        let votingFilters = JSON.parse(JSON.stringify(selectedFilters))
        votingHeader.filter(obj => obj.key === data.key)[0].selectedValue = option.key
        votingFilters[(data.key).trim()] = option.value
        let updatedVotingList = await filterVotes(votingFilters)
        setvotinQuestionList(updatedVotingList)
        setFilters(votingFilters)
        setVotingHeaders(votingHeader)
        setOpenDropDown(false)
    }

    const filterVotes = (votingFilters, created = selectedDates) => {
        let filterLength = 0,
            filterNeedToTest = [],
            updatedVotingList = [],
            votingData1 = JSON.parse(JSON.stringify(data1))

        for (const [prop, val] of Object.entries(votingFilters)) {
            if (val !== 'all' && val !== '')
                filterNeedToTest.push({ key: (prop).toLowerCase(), value: val })
        }

        filterLength = filterNeedToTest.length

        if (filterLength > 0 || created !== null) {
            for (let z = 0; z < votingData1.length; z++) {
                let obj = votingData1[z]
                let breakFlag = false
                if (created != null) {
                    if (moment(obj.created).utc().format("MM/DD/YYYY") >= created.startDate
                        && moment(obj.created).utc().format("MM/DD/YYYY") <= created.endDate) {
                        if (filterLength === 0) {
                            breakFlag = true
                        } else {
                            if (filterLength === 1
                                && obj[filterNeedToTest[0].key] === filterNeedToTest[0].value) {
                                breakFlag = true;
                            } else if (filterLength === 2
                                && obj[filterNeedToTest[0].key] === filterNeedToTest[0].value
                                && obj[filterNeedToTest[1].key] === filterNeedToTest[1].value) {
                                breakFlag = true;
                            } else if (filterLength === 3
                                && obj[filterNeedToTest[0].key] === filterNeedToTest[0].value
                                && obj[filterNeedToTest[1].key] === filterNeedToTest[1].value
                                && obj[filterNeedToTest[2].key] === filterNeedToTest[2].value) {
                                breakFlag = true;
                            }
                        }
                    }

                } else {
                    if (filterLength === 1
                        && obj[filterNeedToTest[0].key] === filterNeedToTest[0].value) {
                        breakFlag = true;
                    } else if (filterLength === 2
                        && obj[filterNeedToTest[0].key] === filterNeedToTest[0].value
                        && obj[filterNeedToTest[1].key] === filterNeedToTest[1].value) {
                        breakFlag = true;
                    } else if (filterLength === 3
                        && obj[filterNeedToTest[0].key] === filterNeedToTest[0].value
                        && obj[filterNeedToTest[1].key] === filterNeedToTest[1].value
                        && obj[filterNeedToTest[2].key] === filterNeedToTest[2].value) {
                        breakFlag = true;
                    }
                }
                if (breakFlag)
                    updatedVotingList.push(obj)
                if (z === votingData1.length - 1)
                    return updatedVotingList
            }
        } else {
            updatedVotingList = votingData1
            return updatedVotingList
        }
    }

    const handleClickOutside = e => {
        if (!myRef.current.contains(e.target)) {
            openDropDown(false);
        }
    };

    const handleEvent = (event, picker) => {
    }

    const handleCallback = async (start, end, label) => {
        setSelectedDates({ startDate: moment(start).format("MM/DD/YYYY"), endDate: moment(end).format("MM/DD/YYYY") })
        let updatedVotingList = await filterVotes(
            selectedFilters,
            {
                startDate: moment(start).format("MM/DD/YYYY"),
                endDate: moment(end).format("MM/DD/YYYY")
            })
        setvotinQuestionList(updatedVotingList)
    }

    const enactAmount = async (vote) => {
        let response = await eosio.transaction(props.activeEosAccount, 'exectknprp', { id: vote.id })
        if (!(response && response.length > 0 && response[0].isError))
            window.location.reload();
    }

    const votedQuestion = async (votingData, isVoted) => {
        let response = null,
            token = props.daoList.filter((dao) => dao.data.id === votingData.daoid)[0].data.token.split(' ')[1],
            vote = { id: votingData.id, voter: props.activeEosAccount, tkn: `0 ${token}`, choice: isVoted }

        if (votingData.type === 'Shareholders')
            response = await eosio.transaction(props.activeEosAccount, 'votetknprp', { ...vote })
        else
            response = await eosio.transaction(props.activeEosAccount, 'votevotprp', { ...vote })

        setVotingDtls(false)

        if (!(response && response.length > 0 && response[0].isError))
            window.location.reload();
    }

    const getVotingList = async () => {
        try {
            let j = 0,
                data1 = [],
                votingList = [],
                votingListResponse = await new EOSIOApi(REACT_APP_EOSIO_CONTRACT_ACCOUNT).getTableRows('bigpicturesw', 'bigpicturesw', 'votingprp', 0, props.totalVotings, props.totalVotings),
                shareholdersVotingListResponse = await new EOSIOApi(REACT_APP_EOSIO_CONTRACT_ACCOUNT).getTableRows('bigpicturesw', 'bigpicturesw', 'tokenprp', 0, props.totalVotings, props.totalVotings)

            if (votingListResponse.data.rows.length > 0) {
                let data = JSON.parse(JSON.stringify(votingListResponse.data.rows))
                data.map(el => votingList.push(el.data));
            }

            if (shareholdersVotingListResponse.data.rows.length > 0) {
                let data = JSON.parse(JSON.stringify(shareholdersVotingListResponse.data.rows))
                data.map(el => votingList.push(el.data));
            }
            if (votingList.length > 0) {
                votingList.sort((a, b) => new Date(b.created) - new Date(a.created))
                setStartDate(moment(votingList[votingList.length - 1].created).format("MM/DD/YYYY"))
            }

            for (j = 0; j < votingList.length; j++) {
                let item = JSON.parse(JSON.stringify(votingList[j])),
                    totalVote = item.yes + item.no,
                    voteDAO = props.daoList.filter((dao) => dao.data.id === item.daoid)[0],
                    token = voteDAO.data.token.split(' ')[1],
                    isTokenAvailable = props.daotokensList.filter((dao) => (dao.data.balance).split(' ')[1] === token)

                if (item.question) {
                    item.type = 'Voting';
                    item.title = 'Voting';
                } else {
                    item.type = 'Shareholders';
                    item.title = 'Sharevolder';
                    item.question = `This proposal will distribute ${item.amount} to ${item.user}`
                }

                if (isTokenAvailable.length > 0)
                    item.canIVote = true
                else
                    item.canIVote = false

                item.contentId = j + 1
                item.yesPerc = totalVote === 0 ? 0 : ((item.yes / totalVote) * 100).toFixed(2)
                item.noPerc = totalVote === 0 ? 0 : ((item.no / totalVote) * 100).toFixed(2)

                if (moment(moment.utc(item.expires).format()).isAfter(moment.utc().format())) {
                    item.outcome = 'Pending'
                    item.status = 'Open'
                } else {
                    item.status = 'Closed'
                    if (item.yesPerc >= voteDAO.data.support) {
                        item.outcome = 'Passed'
                        if (!(moment(moment.utc(item.expires).format()).isAfter(moment.utc().format())) && item.type === 'Shareholders' && item.paid === 1) {
                            item.outcome = 'Passed & Enacted'
                        }
                    } else if (item.yesPerc < voteDAO.data.support) {
                        item.outcome = 'Rejected'
                    }
                }
                data1.push(item)
                if (j === votingList.length - 1) {
                    setData1(data1)
                    setvotinQuestionList(data1)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getVotingList()
        setFilters({ Status: '', Outcome: '', Type: '' })
        setVotingHeaders(votingHeader1)
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
        <div className="voting_main" ref={myRef} onClick={handleClickOutside}>
            <div className="voting_header" >
                {votingHeaders.map((obj, k) =>
                    <div
                        id={obj.key}
                        name={obj.key}
                        className="dropdown voting-status"
                        onClick={() => openDropDown(obj)}>
                        <span className="votingstatus-text">{obj.selectedValue}</span>
                        <span><i className="fa fa-angle-down votingstatus-down"></i></span>
                        {openDropBox && activeDroxKey === obj.key &&
                            <ul className="options" style={obj.style}>
                                {obj.data.length > 0 && obj.data.map((opt, i) =>
                                    <li
                                        key={i}
                                        data-value={`${opt.value}`}
                                        onClick={(e) => setSelectedValue(e, opt, obj)}>
                                        {opt.key}
                                    </li>
                                )}
                            </ul>}
                    </div>)}
                {startDate != null &&
                    <DateRangePicker
                        onEvent={handleEvent}
                        onCallback={handleCallback}
                        initialSettings={{
                            startDate: selectedDates === null ? startDate : selectedDates.startDate,
                            endDate: selectedDates === null ? moment().utc().format("MM/DD/YYYY") : selectedDates.startDate
                        }} >
                        <div className="dropdown voting-status" style={{ width: 'max-content' }} >
                            <span className="votingstatus-text" style={{ paddingRight: '51px' }}>
                                {selectedDates === null ? `Start | End` : `${selectedDates.startDate} | ${'  '}${selectedDates.endDate}`}
                            </span>
                            <span><i className="fa fa-angle-down votingstatus-down"></i>
                            </span>
                        </div>
                    </DateRangePicker>}
            </div>
            <div className="voting_body">
                {votinQuestionList.length > 0 && votinQuestionList.map((obj, l) =>
                    <VotingCard
                        id={l}
                        voteQuestionDtls={obj}
                        votingDtls={votingDtls}
                        openVotingDtls={(votings) => openVotingDtls(votings)}
                    />)}
            </div>
            {
                votingDtls && Object.keys(votingDtlsData).length > 0 &&
                <VotingDetails
                    show={votingDtls}
                    votingDtlsData={votingDtlsData}
                    handleClose={() => handleClose()}
                    enactAmount={(vote) => enactAmount(vote)}
                    votedQuestion={(votingData, isVoted) => votedQuestion(votingData, isVoted)}
                />
            }
        </div >
    )
}

export default Voting;
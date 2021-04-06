import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
 
class OrganisationDatePicker extends React.Component {
    handleEvent(event, picker) {
      console.log(picker.startDate);
    }
    handleCallback(start, end, label) {
      console.log(start, end, label);
    }
    render() {
      return (
        <DateRangePicker onEvent={this.handleEvent} onCallback={this.handleCallback}>
          <div>Tej</div>
        </DateRangePicker>
      )
    }
  }

export default OrganisationDatePicker
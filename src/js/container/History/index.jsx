import React, { Component, Fragment} from 'react';
import { DateRange } from 'react-date-range';
// import historyData from '../../../../demo-server/historyData';
import {getData} from '../../utils/service'
import EditAmount from './EditAmount'

class History extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      error:false,
      historyData: '',
      search: '',
      selectionRange: {
        startDate: new Date(),
        endDate: new Date()
      }
    }
  }

  async componentDidMount() {
    const {data, error} = await getData("history");
    if(error){
      this.setState({
        loading:false,
        error:true
      })
    }
    else {
      this.readData(data)
    }
  }

  readData = data => {
    const allDates = data.map(x => new Date(x.transactionDate));
    const maxDate = new Date(Math.max.apply(null,allDates));
    const minDate = new Date(Math.min.apply(null,allDates));
    this.setState({
      loading: false,
      historyData:data,
      minDate,
      maxDate
    })
  }

  updateSearch = (event) => {
    this.setState({
      selected:false,
      search: event.target.value.toLowerCase(),
      selectionRange: {
        startDate: new Date(),
        endDate: new Date()
      },
      editPage: false
    })
  }

  dateFormat = transactionDate => {
    let date = new Date(transactionDate);
    var monthArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dd = date.getDate();
    const MM = monthArray[date.getMonth()];
    const yyyy = date.getFullYear();
    return ''+(dd<= 9?'0'+dd:dd)+'-'+MM+'-'+ yyyy;
  }

  handleSelect = (ranges) => {
    const {selection} = ranges;
    this.setState({
      selected:true,
      selectionRange:{
        startDate: new Date(selection.startDate),
        endDate: new Date(selection.endDate)
      }
    });
  }

  handleEditClick = (e) => {
    e.preventDefault();
    const transactionInfo = JSON.parse(e.target.getAttribute('transactioninfo'));
    this.setState({
      transactionInfo,
      editPage:true
    })
  }

  handleBackToHistory = () => {
    this.setState({
      editPage:false
    })
  }

  render(){
    const {loading,error,historyData, selectionRange,minDate,maxDate, selected, editPage, transactionInfo} = this.state;
    if(!loading && !error && Array.isArray(historyData) && historyData.length>0) {
      let filteredHistories;
      if(selected){
        filteredHistories = historyData.filter(his => {
          return new Date(his.transactionDate) >= selectionRange.startDate && new Date(his.transactionDate) <= selectionRange.endDate
        });
      }
      else {
        filteredHistories = historyData.filter(hist=> {
          return hist.transactionId.includes(this.state.search) || hist.merchant.toLowerCase().includes(this.state.search)
      });
      }
      
      return (
        <section className='row px-3'>
          { editPage ? <EditAmount onBackToHistory={this.handleBackToHistory} {...transactionInfo}/> : 
            <Fragment>
              <div className="col-auto mx-auto">
                <div className="filter-calendar mb-3">
                  <DateRange minDate={minDate} maxDate={maxDate} scroll={{ enabled:true}} ranges={[{...selectionRange, key: 'selection'}]} onChange={this.handleSelect} />
                </div>
              </div>
              <div className='col'>
                <div className='form-group'>
                  <input 
                    type='text' 
                    value={this.state.search} 
                    onChange={this.updateSearch} 
                    className='form-control' 
                    placeholder='Search title or address...'
                    autoComplete='off'
                    spellCheck='false'
                  />
                </div>
                <table className='table table-responsive-lg table-bordered table-striped table-hover'>
                  <caption>List of client history</caption>
                  <thead>
                    <tr>
                      <th className="text-right">TransactionId</th>
                      <th>Items Purchased</th>
                      <th>Transation Date</th>
                      <th>Merchant</th>
                      <th className="text-right">Amount(in Dollars)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredHistories.map(filteredHistory => {
                        return(
                          <tr key={filteredHistory.id}>
                            <td className="text-right">{filteredHistory.transactionId}</td>
                            <td>{filteredHistory.purchasedItem}</td>
                            <td>{this.dateFormat(filteredHistory.transactionDate)}</td>
                            <td>{filteredHistory.merchant}</td>
                            <td className="text-right">
                              <span>{filteredHistory.amount}</span>
                              <button className="btn btn-secondary btn-sm edit-btn" onClick={this.handleEditClick} transactioninfo={JSON.stringify(filteredHistory)}>Edit</button>
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </Fragment>
          }
        </section>
      )
    }
    else if(loading) {
      return <div>Loading...</div>;
    }
    else if(error){
      return (<div className="container">
      <h4>Something is not quite right might be API issue</h4>
    </div>);
    }
    return null
  }
}

export default History;
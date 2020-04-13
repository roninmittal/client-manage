import React, { Component} from 'react';
import Checkbox from '../../component/Checkbox';
// import contactsData from '../../../../demo-server/contactsData'
import {getData} from '../../utils/service'

class Contact extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      error:false,
      contactsData: '',
      search: '',
      checkedItems: new Map(),
      checkedIndustry: [],
      checkedCompany: [],
      checkedContact: []
    }
  }

  async componentDidMount() {
    const {data, error} = await getData("contacts");
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
    let allContacts = [], allCompanies = [], allIndustries= [];
    data.map(contact=> {
      if(!allContacts.includes(contact['contact_name'])) allContacts.push(contact['contact_name']);
      if(!allCompanies.includes(contact['company_name'])) allCompanies.push(contact['company_name']);
      if(!allIndustries.includes(contact['industry'])) allIndustries.push(contact['industry']);
    });
    this.setState({contactsData:data, allContacts,allCompanies,allIndustries,loading: false});
  }

  updateSearch = (event) => {
    this.setState({
      search: event.target.value.toLowerCase()
    })
  }

  getCheckedItems = (prevCheckedItems, current) => {
    if(current){
      if(prevCheckedItems.includes(current)) {
        const newArray =  prevCheckedItems.filter(item => item!== current)
        return [...newArray]
      }
      return [...prevCheckedItems, current]
    }
    return [...prevCheckedItems]
  }

  handleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    const field = e.target.getAttribute('field');
    let currentContact, currentCompany,currentIndustry;
    if(field==="contact_name") currentContact=value;
    if(field==="company_name") currentCompany=value;
    if(field==="industry") currentIndustry = value;

    this.setState(prevState => ({ 
      checkedItems: prevState.checkedItems.set(value, isChecked),
      checkedIndustry: this.getCheckedItems(prevState.checkedIndustry, currentIndustry),
      checkedCompany: this.getCheckedItems(prevState.checkedCompany, currentCompany),
      checkedContact: this.getCheckedItems(prevState.checkedContact, currentContact)
    }));
  }

  render(){
    const {loading,error,contactsData,allContacts,allCompanies,allIndustries,checkedItems, search} = this.state;
    let {checkedContact,checkedCompany,checkedIndustry} = this.state;
    if(!loading && !error && Array.isArray(contactsData) && contactsData.length>0) {
      let filteredContacts;
      if(checkedContact.length>0 || checkedCompany.length>0 || checkedIndustry.length>0){
        filteredContacts = contactsData.filter(contact=> {
          return checkedIndustry.includes(contact.industry) || 
                  checkedCompany.includes(contact['company_name']) || 
                  checkedContact.includes(contact['contact_name'])
        });
      }
      else {
        filteredContacts = contactsData.filter(contact=> {
          return contact.contact_title.toLowerCase().includes(search) || contact.company_address.toLowerCase().includes(search)
        });
      }
      return (
        <section className='row px-3'>
          <div className='col-sm-3 pr-sm-0'>
            <form>
              <h6>Contact name</h6>
              <hr className='mt-0 mb-2'/>
              <div className='filter mb-3'>
              {
                  allContacts.map((contact,i) => {
                      return (
                        <Checkbox key={`${i}contact`} id={`${i}contact`} value={contact} isChecked={checkedItems.get(contact)} onChange={this.handleChange} field='contact_name'/>
                      );
                  })
              }
              </div>
              <h6>Company name</h6>
              <hr className='mt-0 mb-2'/>
              <div className='filter mb-3'>
              {
                  allCompanies.map((company,i) => {
                      return (
                          <Checkbox key={`${i}company`} id={`${i}company`} value={company} isChecked={checkedItems.get(company)} onChange={this.handleChange} field='company_name'/>
                      );
                  })
              }
              </div>
              <h6>Industry</h6>
              <hr className='mt-0 mb-2'/>
              <div className='filter mb-3'>
                {
                    allIndustries.map((industry,i) => {
                        return (
                            <Checkbox key={`${i}industry`} id={`${i}industry`} value={industry} isChecked={checkedItems.get(industry)} onChange={this.handleChange} field='industry'/>
                        );
                    })
                }
                </div>
            </form>
          </div>
          <div className='col-sm-9'>
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
              <caption>List of client contacts</caption>
              <thead>
                <tr>
                  <th>Contact name</th>
                  <th>Contact title</th>
                  <th>Company name</th>
                  <th>Address</th>
                  <th>Industry</th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredContacts.map(contactInfo => {
                    return(
                      <tr key={contactInfo.id}>
                        <td>{contactInfo.contact_name}</td>
                        <td>{contactInfo.contact_title}</td>
                        <td>{contactInfo.company_name}</td>
                        <td>{contactInfo.company_address}</td>
                        <td>{contactInfo.industry}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </section>
      )
    }
    else if(loading) {
      return <div>Loading...</div>;
    }
    else if(error){
      return (
        <div className="container">
          <h4>Something is not quite right might be API issue</h4>
        </div>
      );
    }
    return null
  }
}

export default Contact;
import React, { Component } from "react";
import {postData} from '../../utils/service'
class EditAmount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            newAmount: '',
            transactionId:''

        }
    }

    handleConfirm = async e => {
        e.preventDefault();
        const updateData = {
            amount:this.state.newAmount,
            transactionId:this.state.transactionId
        }
        const {error} = await postData("editAmount",updateData);
        if(error){
            this.setState(error)
        }
        else {
            this.setState({status:"success"});
        }

    }

    handleChange = (event) => {
        const transactionId = event.target.getAttribute('transactionid');
        this.setState({
            newAmount: event.target.value,
            transactionId
        })
    }

    render(){
        const {onBackToHistory, amount, transactionId, purchasedItem, merchant} = this.props;
        return(
            <div className="col-auto m-auto">
                {this.state.status && 
                    <div className="alert alert-success" role="alert">
                        <p className='mb-0'>Succesfully pushed Data</p>
                    </div>
                }
                {this.state.error && 
                    <div className="alert alert-danger" role="alert">
                        <p className='mb-0'>Something wrong</p>
                    </div>
                }
                <form>
                    <div className="text-center mb-3">
                        <button className="btn btn-outline-secondary" onClick={onBackToHistory}> Take me to client spend history</button>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="transactionId" className="col-sm-6 col-form-label">Transition id</label>
                        <div className="col-sm-6">
                        <input type="text" readOnly className="form-control-plaintext text-truncate" id="transactionId" value={transactionId} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="purchasedItem" className="col-sm-6 col-form-label">Purchased item</label>
                        <div className="col-sm-6">
                        <input type="text" readOnly className="form-control-plaintext text-truncate" id="purchasedItem" value={purchasedItem} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="merchant" className="col-sm-6 col-form-label">Merchant</label>
                        <div className="col-sm-6">
                        <input type="text" readOnly className="form-control-plaintext text-truncate" id="merchant" value={merchant} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="currentAmount" className="col-sm-6 col-form-label">Current amount</label>
                        <div className="col-sm-6">
                        <input type="text" readOnly className="form-control-plaintext text-truncate" id="currentAmount" value={amount} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputAmount" className="col-sm-6 col-form-label">New Amount</label>
                        <div className="col-sm-6">
                        <input type="text" className="form-control" id="inputAmount" transactionid={transactionId} value={this.state.newAmount} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="text-center mb-3">
                        <button type="submit" className="btn btn-primary mb-2" onClick={this.handleConfirm}>Confirm</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default EditAmount;
import React from 'react'
import { shallow} from 'enzyme'
import History from '../../../../src/js/container/History';
import * as service from '../../../../src/js/utils/service'

jest.mock('../../../../src/js/container/History/EditAmount', () => {
    return "EditAmount"
});

let tomorrow = new Date();
tomorrow.setDate(new Date().getDate()+1);

const dummyData = [{
    transactionId:"12345",
    purchasedItem:"Item1",
    transactionDate: tomorrow,
    merchant:"merchant",
    amount:"120.00"
},{
    transactionId:"54321",
    purchasedItem:"Item2",
    transactionDate: tomorrow,
    merchant:"merchant2",
    amount:"130.00"
}]

describe("Render History component", () => {
    let wrapper, wrapperInstance;
    beforeEach(()=> {
        wrapper = shallow(<History />)
        wrapperInstance = wrapper.instance();
    });
    afterEach(()=> {
        jest.resetAllMocks()
    });
    test("loading is true ", () => {
        wrapperInstance.setState({
            loading:true
        })
        expect(wrapper.find("div").props().children).toBe("Loading...")
    });
    test("error is true ", () => {
        wrapperInstance.setState({
            loading:false,
            error:true
        })
        expect(wrapper.find("h4").props().children).toBe("Something is not quite right might be API issue")
    });
    test("loading and error is false but historyData is not an array", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            contactsData: ""
        });
        expect(wrapper).toEqual({});
    });

    test("loading and error is false and historyData is available but selected is false", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            historyData: dummyData,
            selected:false,
            search:"merchant2"
        });
        wrapperInstance.updateSearch = jest.fn();
        wrapperInstance.forceUpdate();
        expect(wrapper.find("table").exists()).toBeTruthy();
        wrapper.find("input").props().onChange();
        expect(wrapperInstance.updateSearch).toHaveBeenCalled();
        expect(wrapper.find("tbody").find("tr")).toHaveLength(1);
    });

    test("loading and error is false and historyData is available and selected is true", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            historyData: dummyData,
            selected:true,
            selectionRange:{
                startDate: new Date(),
                endDate: tomorrow
            }
        });
        expect(wrapper.find("tbody").find("tr")).toHaveLength(2);
    });
    test("loading and error is false and historyData is available and selected is true", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            historyData: dummyData,
            editPage:true
        });
        wrapperInstance.handleBackToHistory = jest.fn();
        wrapperInstance.forceUpdate();
        expect(wrapper.find("EditAmount").exists()).toBeTruthy();
        wrapper.find("EditAmount").props().onBackToHistory();
        expect(wrapperInstance.handleBackToHistory).toHaveBeenCalled();
    });
});

describe("Functional testing History component", () => {
    let wrapper, wrapperInstance;
    beforeEach(()=> {
        wrapper = shallow(<History />)
        wrapperInstance = wrapper.instance();
    });
    afterEach(()=> {
        jest.resetAllMocks()
    });
    
    test("componentDidMount when no error", async () => {
        jest.spyOn(service, "getData").mockImplementation(jest.fn()).mockReturnValue({data:dummyData})
        await wrapperInstance.componentDidMount();
        expect(wrapper.state().error).toBe(false);
    });

    test("componentDidMount when error", async () => {
        jest.spyOn(service, "getData").mockImplementation(jest.fn()).mockReturnValue({error:true})
        await wrapperInstance.componentDidMount();
        expect(wrapper.state().error).toBe(true);
    });

    test("readData testing", () => {
        expect(wrapperInstance.state.loading).toBe(true);
        wrapperInstance.readData(dummyData)
        expect(wrapperInstance.state.loading).toBe(false);
        expect(wrapperInstance.state.historyData).toBe(dummyData);
    });

    test("updateSearch testing", () => {
        const event = {target:{value:"test"}};
        expect(wrapper.state().search).toBe('');
        wrapperInstance.updateSearch(event);
        expect(wrapper.state().search).toBe("test");
        expect(wrapper.state().selected).toBe(false);
        expect(wrapper.state().editPage).toBe(false);
     })

     test("handleSelect testing", () => {
        const ranges = {
            selection: {
                startDate:new Date(),
                endDate:new Date()
            }
        }
        wrapperInstance.handleSelect(ranges);
        expect(wrapper.state().selected).toBe(true);
        expect(wrapper.state().selectionRange.startDate).toEqual(new Date(ranges.selection.startDate));
        expect(wrapper.state().selectionRange.endDate).toEqual(new Date(ranges.selection.endDate));
    })

    test("handleEditClick testing", () => {
        const event = {
            preventDefault: jest.fn(),
            target:{
                getAttribute: jest.fn().mockReturnValue("{}")
            }
        };

        wrapperInstance.handleEditClick(event);
        expect(wrapper.state().editPage).toBe(true);
        expect(wrapper.state().transactionInfo).toEqual({});
    })

    test("handleBackToHistory testing", () => {
        wrapperInstance.handleBackToHistory();
        expect(wrapper.state().editPage).toBe(false);
    })
});

import React from 'react'
import { shallow} from 'enzyme'
import Contact from '../../../../src/js/container/Contact';
import * as service from '../../../../src/js/utils/service'

jest.mock('../../../../src/js/component/Checkbox', () => {
    return "Checkbox"
});

const dummyData = [{
    contact_title:"dummyTitle",
    company_address:"dummyAddress",
    contact_name:"dummyContact",
    company_name:"dummyCompany",
    industry:"dummyIndustry"
},{
    contact_title:"dummyTitle1",
    company_address:"dummyAddress2",
    contact_name:"dummyContact",
    company_name:"dummyCompany",
    industry:"dummyIndustry"
}]

describe("Render Contact component", () => {
    let wrapper, wrapperInstance;
    beforeEach(()=> {
        wrapper = shallow(<Contact />)
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

    test("loading and error is false but  contactsData is not an array", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            contactsData: ""
        });
        expect(wrapper).toEqual({});
    });

    test("loading and error is false and contactsData is available but checkedElement is 0", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            contactsData: dummyData,
            allContacts:[],
            allCompanies:[],
            allIndustries:[],
            search:"dummyaddress2"
        });
        wrapperInstance.updateSearch = jest.fn();
        wrapperInstance.forceUpdate();
        expect(wrapper.find("table").exists()).toBeTruthy();
        wrapper.find("input").props().onChange();
        expect(wrapperInstance.updateSearch).toHaveBeenCalled();
        expect(wrapper.find("tbody").find("tr")).toHaveLength(1);
    });

    test("loading and error is false and contactsData is available and checkedElement is present", () => {
        wrapperInstance.setState({
            loading:false,
            error:false,
            contactsData: dummyData,
            allContacts:[],
            allCompanies:["dummyContact"],
            allIndustries:["dummyCompany"],
            checkedIndustry:["dummyIndustry"]
        });
        expect(wrapper.find("tbody").find("tr")).toHaveLength(2);
    });
});

describe("Functional testing Contact component", () => {
    let wrapper, wrapperInstance;
    beforeEach(()=> {
        wrapper = shallow(<Contact />)
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

    test("readData testing when same cotact company and industry", () => {
        expect(wrapperInstance.state.loading).toBe(true);
        wrapperInstance.readData(dummyData)
        expect(wrapperInstance.state.loading).toBe(false);
        expect(wrapperInstance.state.contactsData).toBe(dummyData);
        expect(wrapperInstance.state.allContacts).toEqual(["dummyContact"]);
        expect(wrapperInstance.state.allCompanies).toEqual(["dummyCompany"]);
        expect(wrapperInstance.state.allIndustries).toEqual(["dummyIndustry"]);
    });

    test("updateSearch testing", () => {
        const event = {target:{value:"test"}};
        expect(wrapper.state().search).toBe('');
        wrapperInstance.updateSearch(event);
        expect(wrapper.state().search).toBe("test");
    });

    test("getCheckedItems if current is empty", () => {
        expect(wrapperInstance.getCheckedItems([])).toEqual([]);
    });

    test("getCheckedItems if current is !empty and prevCheckedItems not include", () => {
        expect(wrapperInstance.getCheckedItems(["test1"], "test2")).toEqual(["test1", "test2"]);
    });

    test("getCheckedItems if current is !empty and prevCheckedItems already include", () => {
        expect(wrapperInstance.getCheckedItems(["test1","test2"], "test1")).toEqual(["test2"]);
    });

    test("handleChange", () => {
        const map = new Map();
        expect(wrapper.state().checkedContact).toEqual([]);
        expect(wrapper.state().checkedCompany).toEqual([]);
        expect(wrapper.state().checkedIndustry).toEqual([]);
        expect(wrapper.state().checkedItems).toEqual(map);

        const event = {
            target:{
                value:"test1",
                checked: true,
                getAttribute: jest.fn().mockReturnValue("contact_name")
            }
        }
        wrapperInstance.handleChange(event)

        expect(wrapper.state().checkedContact).toEqual([event.target.value]);
        expect(wrapper.state().checkedCompany).toEqual([]);
        expect(wrapper.state().checkedIndustry).toEqual([]);
        expect(wrapper.state().checkedItems).toEqual(map.set(event.target.value, event.target.checked));
    });

    test("handleChange with company_name", () => {
        const event = {
            target:{
                value:"test1",
                checked: true,
                getAttribute: jest.fn().mockReturnValue("company_name")
            }
        }
        wrapperInstance.handleChange(event)
        expect(wrapper.state().checkedCompany).toEqual([event.target.value]);
    });

    test("handleChange with industry", () => {
        const event = {
            target:{
                value:"test1",
                checked: true,
                getAttribute: jest.fn().mockReturnValue("industry")
            }
        }
        wrapperInstance.handleChange(event)
        expect(wrapper.state().checkedIndustry).toEqual([event.target.value]);
    });
});

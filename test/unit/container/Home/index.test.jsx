import React from 'react'
import { shallow} from 'enzyme'
import Home from '../../../../src/js/container/Home';
import * as logged from '../../../../src/js/utils/isLoggedIn'

jest.mock('../../../../src/js/container/History', () => {
    return "History"
});
jest.mock('../../../../src/js/container/Contact', () => {
    return "Contact"
});

describe("Render testing of home page", () => {
    afterEach(()=> {
        jest.resetAllMocks()
    });
    test("render when not login", () => {
        jest.spyOn(logged, "default").mockImplementation(jest.fn()).mockReturnValue(false)
        const wrapper = shallow(<Home />)
        expect(wrapper.find("Redirect").props().to).toBe("/login");
    });

    test("render when login", () => {
        jest.spyOn(logged, "default").mockImplementation(jest.fn()).mockReturnValue(true)
        const wrapper = shallow(<Home />)
        const wrapperInstance = wrapper.instance();
        const handleLogoutSpy = jest.fn();
        const handleChangeSelectSpy = jest.fn();
        wrapperInstance.handleLogout = handleLogoutSpy;
        wrapperInstance.handleChangeSelect = handleChangeSelectSpy;
        wrapperInstance.forceUpdate();
        expect(wrapper.find("a").props().children).toBe("Client information");
        expect(wrapper.find("button").props().children).toBe("Logout");
        wrapper.find("button").props().onClick();
        expect(handleLogoutSpy).toHaveBeenCalled();
        wrapper.find("select").props().onChange();
        expect(handleChangeSelectSpy).toHaveBeenCalled();
        expect(wrapper.state().value).toBe("select");
        wrapperInstance.setState({
            value:"contacts"
        });
        expect(wrapper.find("Contact").exists()).toBeTruthy();
        expect(wrapper.find("History").exists()).toBeFalsy();
        wrapperInstance.setState({
            value:"history"
        });
        expect(wrapper.find("History").exists()).toBeTruthy();
        expect(wrapper.find("Contact").exists()).toBeFalsy();
    });
});

describe("Functional testing of home page", () => {
    let wrapper,wrapperInstance;
    beforeEach(()=> {
        wrapper = shallow(<Home history={[]}/>)
        wrapperInstance = wrapper.instance();
    });
    afterEach(()=> {
        jest.resetAllMocks()
    });

    test("handleChangeSelect", () => {
        expect(wrapper.state().value).toBe("select");
        const event = {target:{value:"contacts"}}
        wrapperInstance.handleChangeSelect(event);
        expect(wrapper.state().value).toBe("contacts");
    });

    test("handleLogout", () => {
        wrapperInstance.handleLogout();
        expect(wrapperInstance.props.history).toEqual([ '/login' ])
    })
});
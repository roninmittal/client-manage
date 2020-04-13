import React from 'react'
import { shallow} from 'enzyme'
import Login from '../../../../src/js/container/Login';
import * as logged from '../../../../src/js/utils/isLoggedIn'
import * as service from '../../../../src/js/utils/service'

describe("Render login page", () => {
    test("render when user already logged in", () => {
        jest.spyOn(logged, "default").mockImplementation(jest.fn()).mockReturnValue(true)
        const wrapper = shallow(<Login />)
        expect(wrapper.find("Redirect").props().to).toBe("/home");
    });

    test("render when error with first time login", () => {
        jest.spyOn(logged, "default").mockImplementation(jest.fn()).mockReturnValue(false)
        const wrapper = shallow(<Login />)
        wrapper.setState({
            error:true
        })
        expect(wrapper.find("div").props().children).toBe("Something is not quite right please refresh the page");
    });

    test("render first time login page ", () => {
        jest.spyOn(logged, "default").mockImplementation(jest.fn()).mockReturnValue(false)
        const wrapper = shallow(<Login />);
        expect(wrapper.find("form").exists()).toBeTruthy();
    });

});

describe("Function login page", () => {
    let wrapper, wrapperInstance, event = {
        target:{
            name:"username",
            value:"test"
        },
        preventDefault: jest.fn()
    }
    beforeEach(()=> {
        wrapper = shallow(<Login history={[]}/>);
        wrapperInstance = wrapper.instance();
    })
    test("componentDidMount", async () => {
        jest.spyOn(service, "getData").mockImplementation(jest.fn()).mockReturnValue({data:"dummyData"})
        await wrapperInstance.componentDidMount();
        expect(wrapper.state().loginData).toBe("dummyData");
        expect(wrapper.state().error).toBe(false);
    });

    test("componentDidMount", async () => {
        jest.spyOn(service, "getData").mockImplementation(jest.fn()).mockReturnValue({error:true})
        await wrapperInstance.componentDidMount();
        expect(wrapper.state().error).toBe(true);
    });

    test("handle change function", () => {
        const event = {
            target:{
                name:"username",
                value:"test"
            }
        }
        expect(wrapper.state().username).toBe('');
        wrapperInstance.handleChange(event);
        expect(wrapper.state().username).toBe(event.target.value)
    });
    test("handle submit function when username and password not matching", () => {
        const event = {
            preventDefault:jest.fn()
        }
        wrapperInstance.handleSubmit(event);
        expect(wrapper.state().loginError).toBe(true);
    });
    test("handle submit function when username and password is matching", () => {
        wrapperInstance.setState({
            loginData:{
                username:"test",
                password:"password"
            },
            username:"test",
            password:"password"
        })
        wrapperInstance.handleSubmit(event);
        expect(wrapper.state().loginError).toBe(false);
        expect(wrapperInstance.props.history).toEqual([ '/home' ])
    });
});
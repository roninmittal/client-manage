import React from 'react'
import { shallow} from 'enzyme'
import Container from '../../../src/js/container';

jest.mock('../../../src/js/container/Home', () => {
    return "homePage"
});
jest.mock('../../../src/js/container/Login', () => {
    return "loginPage"
});

describe("test Container index file", () => {
    afterEach(()=> {
        jest.resetAllMocks()
    })
    test("render container is correct with component", () => {
        const wrapper = shallow(<Container />)
        expect(wrapper.find("BrowserRouter").exists()).toBeTruthy();
        expect(wrapper.find("Switch").exists()).toBeTruthy();
        expect(wrapper.find("Route").at(0).props()).toEqual({ path: '/login', component: 'loginPage' });
        expect(wrapper.find("Route").at(1).props()).toEqual({ path: '/', component: 'homePage' });
    })
});
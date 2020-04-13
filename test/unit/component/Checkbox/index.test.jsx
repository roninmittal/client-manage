import React, { PureComponent } from 'react'
import { shallow} from 'enzyme'
import Checkbox from '../../../../src/js/component/Checkbox';

const onChangeSpy = jest.fn()
const dummyProps = {
    id: 1,
    value: "checkbox1",
    onChange: onChangeSpy,
    field: "field1"
}

describe("render Checkbox", () => {
    test("render checkbox with props", () => {
        const wrapper = shallow(<Checkbox {...dummyProps}/>)
        expect(wrapper.find("input").props().id).toBe(dummyProps.id);
        expect(wrapper.find("input").props().value).toBe(dummyProps.value);
        expect(wrapper.find("input").props().checked).toBe(false);
        expect(wrapper.find("input").props().field).toBe(dummyProps.field);
        wrapper.find("input").props().onChange();
        expect(onChangeSpy).toHaveBeenCalled();
        expect(wrapper.find("label").props().htmlFor).toBe(dummyProps.id);
        expect(wrapper.find("label").props().children).toBe(dummyProps.value);
    })
});
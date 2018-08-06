import React from "react";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Footer from "./Footer";
configure({ adapter: new Adapter() });

describe("footer ", () => {
  it("shold render footer with current year", () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.text().includes(new Date().getFullYear()));
  });
});

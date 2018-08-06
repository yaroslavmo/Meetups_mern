import React from "react";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Navbar from "./Navbar";

configure({ adapter: new Adapter() });

describe("navbar ", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Navbar />);
  });
  it("shold render navbar for authenticated users", () => {
    expect(wrapper);
  });
  it("shold render navbar for not authenticated users", () => {
    wrapper.setProps({
      auth: {
        isAuthenticated: true,
        user: {
          id: "5b5f31 b02fcd8b0e5b49fa4f",
          name: "Yarik Mokhurenko",
          avatar:
            "//www.gravatar.com/avatar/4dcbbd891b8d72bee77a1c92fa7c9dd8?s=200&r=pg&d=mm",
          iat: 1533561444,
          exp: 1533565044
        }
      },
      errors: {}
    });
    expect(wrapper);
  });
});

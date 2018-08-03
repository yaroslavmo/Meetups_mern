import React from "react";
import img from "../../img/93ccc2f2036a54165fc88fdb31a446db.jpg";

export default () => {
  return (
    <div className="container">
      <img
        alt="404"
        style={{
          width: "600px",
          height: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block"
        }}
        src={require("../../img/93ccc2f2036a54165fc88fdb31a446db.jpg")}
      />
    </div>
  );
};

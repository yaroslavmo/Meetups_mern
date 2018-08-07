import React from "react";

export default () => {
  const footercss = {
    position: "absolute",
    width: "100%",
    height: "60px" /* Height of the footer */,
    background: "#6cf"
  };

  return (
    <div>
      <footer
        style={footercss}
        className="bg-dark page-footer text-white mt-5 p-4 text-center"
      >
        Copyright &copy; {new Date().getFullYear()} Meetups
      </footer>
    </div>
  );
};

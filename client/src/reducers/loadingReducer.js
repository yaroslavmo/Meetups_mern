const loading = (state = false, action) => {
  switch (action.type) {
    case "LOADING":
      return true;
    case "LOADED":
      return false;
    case "ERROR":
      return false;
    default:
      return state;
  }
};
export default loading;

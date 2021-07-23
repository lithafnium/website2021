import React from "react";
import { Route, Switch } from "react-router-dom";
import { Router } from "react-router";
import history from "@app/shared/utils/history";

import Home from "@app/pages/home/home";
import Work from "@app/pages/work/work";
import routes from "@app/shared/constants/routes";

function App() {
  return (
    <>
      <Home />
      <Work />
    </>
  );
}

export default App;

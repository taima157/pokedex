import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Pokemon from "./pages/Pokemon";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/pokemon/:id" component={Pokemon} />
      </Switch>
    </BrowserRouter>
  );
}

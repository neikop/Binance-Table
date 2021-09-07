import { Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Binance } from "views/Binance";
import { Cloud } from "views/Cloud";

const App = () => {
  return (
    <Router history={createBrowserHistory()}>
      <Switch>
        <Route path="/sync" component={Cloud} />
        <Route path="/" component={Binance} />
      </Switch>
    </Router>
  );
};

export default App;

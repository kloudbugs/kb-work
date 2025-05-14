import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import MiningSubscription from "@/pages/MiningSubscription";
import TeraToken from "@/pages/TeraToken";
import TeraInfo from "@/pages/TeraInfo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mining" component={MiningSubscription} />
      <Route path="/tera" component={TeraToken} />
      <Route path="/tera-info" component={TeraInfo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;

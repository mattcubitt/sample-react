import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import AppBar from "./AppBar";
import { CardList } from "./CardList";
import { rootReducer, State } from "./reducers";

export const AppWrapper: React.FC<{ initialState?: State }> = ({
  children,
  initialState,
}) => {
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
};

function App() {
  return (
    <AppWrapper>
      <AppBar />
      <CardList />
    </AppWrapper>
  );
}

export default App;

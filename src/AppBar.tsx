import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults, setSearchQuery } from "./actions";
import { useBouncedCallback } from "./hooks";
import { SearchDispatch } from "./reducers";
import { loadingSelector, searchQuerySelector } from "./selectors";
import {
  AppBar as CoreAppBar,
  Box,
  CircularProgress,
  InputBase,
  makeStyles,
  Toolbar,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const AppBar = () => {
  const query = useSelector(searchQuerySelector);
  const loading = useSelector(loadingSelector);
  const dispatch: SearchDispatch = useDispatch();
  const classes = useStyles();
  const debouncedHandler = (newValue: string) => {
    dispatch(fetchSearchResults(newValue));
  };
  const setValue = useBouncedCallback<string>(debouncedHandler);

  return (
    <CoreAppBar position="fixed" role="navigation">
      <Toolbar>
        <InputBase
          className={classes.root}
          placeholder="Enter a search query about an artist, album or song here..."
          inputProps={{ "aria-label": "search" }}
          onChange={(event) => {
            dispatch(setSearchQuery(event.target.value));
            setValue(event.target.value);
          }}
          value={query}
        />
        {loading && (
          <Box ml="auto">
            <CircularProgress color="secondary" size={30} />
          </Box>
        )}
      </Toolbar>
    </CoreAppBar>
  );
};

export default AppBar;

import {
  AppBar as CoreAppBar,
  Box,
  CircularProgress,
  InputBase,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResuls, setSearchQuery } from "./actions";
import { SearchDispatch } from "./reducers";
import { searchQuerySelector, loadingSelector } from "./selectors";

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

  return (
    <CoreAppBar position="fixed" role="navigation">
      <Toolbar>
        <InputBase
          className={classes.root}
          placeholder="Enter search query about an artist, album or song here..."
          inputProps={{ "aria-label": "search" }}
          onChange={(event) => {
            dispatch(setSearchQuery(event.target.value));
            dispatch(fetchSearchResuls(event.target.value));
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

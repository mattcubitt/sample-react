import { Box, Grid, Typography } from "@material-ui/core";
import debounce from "lodash.debounce";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "./actions";
import { Card } from "./Card";
import { SearchDispatch } from "./reducers";
import {
  searchResultsSelector,
  errorSelector,
  searchQuerySelector,
  pageNumberSelector,
} from "./selectors";
import { getIsScrollbarAtBottom, getIsScrollbarVisible } from "./utils";

export const CardList = () => {
  const searchResults = useSelector(searchResultsSelector);
  const error = useSelector(errorSelector);
  const searchQuery = useSelector(searchQuerySelector);
  const pageNumber = useSelector(pageNumberSelector);
  const dispatch: SearchDispatch = useDispatch();

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // trigger debounced fetch if scrollbar hits bottom of page
  useEffect(() => {
    const onScrollHandler = debounce(() => {
      if (isLoadingMore) {
        return;
      }
      const isAtBottom = getIsScrollbarAtBottom();
      if (isAtBottom) {
        setIsLoadingMore(true);
        if (!isLoadingMore) {
          dispatch(fetchSearchResults(searchQuery, pageNumber, true)).then(
            () => {
              setIsLoadingMore(false);
            }
          );
        }
      }
    }, 500);
    window.addEventListener("scroll", onScrollHandler);

    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [isLoadingMore, dispatch, pageNumber, searchQuery]);

  // trigger extra fetch if scrollbar isn't present
  useLayoutEffect(() => {
    const isScrollBarVisible = getIsScrollbarVisible();

    if (searchResults.length > 0 && !isScrollBarVisible) {
      if (!isLoadingMore) {
        dispatch(fetchSearchResults(searchQuery, pageNumber, true)).then(() => {
          setIsLoadingMore(false);
        });
      }
    }
  }, [dispatch, isLoadingMore, pageNumber, searchQuery, searchResults.length]);

  return (
    <Box mt={8}>
      {error ? (
        <>
          <Typography variant="h1">
            An error has occurred. Please try again.
          </Typography>
          <Typography variant="body1">{error}</Typography>
        </>
      ) : (
        <Grid container role="list">
          {searchResults.map((searchResult, index) => {
            return (
              <Grid
                key={`${index}_${searchResult.artistId}_${searchResult.collectionId}_${searchResult.trackId}`}
                item
                xs={3}
              >
                <Card searchResult={searchResult} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

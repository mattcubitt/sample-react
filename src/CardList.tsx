import { Box, Grid, Typography } from "@material-ui/core";
import debounce from "lodash.debounce";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "./actions";
import { Card } from "./Card";
import DelayMount from "./DelayMount";
import { SearchDispatch } from "./reducers";
import { searchSelector } from "./selectors";
import { getIsScrollbarAtBottom, getIsScrollbarVisible } from "./utils";

const MessageContainer: React.FC = ({ children }) => {
  // Delay mounting messages to avoid flicker between key strokes
  return (
    <DelayMount>
      <Box
        mt={20}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Box>
    </DelayMount>
  );
};

export const CardList = () => {
  const { results, error, query, pageNumber, loading } = useSelector(
    searchSelector
  );

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
          dispatch(fetchSearchResults(query, pageNumber, true)).then(() => {
            setIsLoadingMore(false);
          });
        }
      }
    }, 500);
    window.addEventListener("scroll", onScrollHandler);

    return () => window.removeEventListener("scroll", onScrollHandler);
  }, [isLoadingMore, dispatch, pageNumber, query]);

  // trigger extra fetch if scrollbar isn't present
  useLayoutEffect(() => {
    const isScrollBarVisible = getIsScrollbarVisible();

    if (results.length > 0 && !isScrollBarVisible) {
      if (!isLoadingMore) {
        dispatch(fetchSearchResults(query, pageNumber, true)).then(() => {
          setIsLoadingMore(false);
        });
      }
    }
  }, [dispatch, isLoadingMore, pageNumber, query, results.length]);

  if (error) {
    return (
      <MessageContainer>
        <Typography variant="h5">
          An error has occurred. Please try again.
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </MessageContainer>
    );
  }

  if (query !== "" && results.length === 0 && !loading) {
    return (
      <MessageContainer>
        <Typography variant="h5">No results for that search.</Typography>
        <Typography variant="body1">Please try again.</Typography>
      </MessageContainer>
    );
  }

  return (
    <Box mt={20}>
      <Grid container role="list">
        {results.map((searchResult, index) => {
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
    </Box>
  );
};

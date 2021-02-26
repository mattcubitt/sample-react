import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Card } from "./Card";
import { searchResultsSelector, errorSelector } from "./selectors";

export const CardList = () => {
  const searchResults = useSelector(searchResultsSelector);
  const error = useSelector(errorSelector);

  if (error) {
    return (
      <Box
        display="flex"
        flexWrap="wrap"
        height="100%"
        flex="1"
        mt={8}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h1">
          An error has occurred. Please try again.
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box mt={8}>
      {error ? (
        <>
          <Typography variant="h1">
            An error has occurred. Please try again.
          </Typography>
          <Typography variant="body1">{error}</Typography>{" "}
        </>
      ) : (
        <Grid container role="list">
          {searchResults.map((searchResult) => (
            <Grid key={searchResult.trackId} item xs={3}>
              <Card searchResult={searchResult} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

import React from "react";
import {
  Card as CoreCard,
  CardContent,
  CardHeader,
  CardMedia,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core";
import { SearchResult } from "./reducers";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(2),
    },
    media: {
      height: 190,
    },
  })
);

type CardProps = { searchResult: SearchResult };

export const Card: React.FC<CardProps> = ({ searchResult }) => {
  const classes = useStyles();

  const subheader = searchResult.trackPrice
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: searchResult.currency,
      }).format(Number(searchResult.trackPrice))
    : "";

  return (
    <CoreCard className={classes.card} role="listitem">
      <CardHeader title={searchResult.artistName} subheader={subheader} />
      <CardMedia
        className={classes.media}
        image={searchResult.artworkUrl100}
        title={searchResult.trackName}
      />
      <CardContent>
        <Typography variant="body1" component="p">
          {searchResult.trackName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {searchResult.collectionName}
        </Typography>
      </CardContent>
    </CoreCard>
  );
};

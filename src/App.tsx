import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createMuiTheme,
  createStyles,
  CssBaseline,
  makeStyles,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      maxWidth: 345,
      margin: theme.spacing(2),
    },
    media: {
      height: 190,
    },
  })
);

const DetailCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar
            alt="Jack Johnson"
            src="https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/be/38/d0/be38d058-31ed-c0ea-91e6-12052865fd20/source/100x100bb.jpg"
          />
        }
        title="Jack Johnson"
        subheader="£1.29"
      />
      <CardMedia
        className={classes.media}
        image="https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/be/38/d0/be38d058-31ed-c0ea-91e6-12052865fd20/source/1200x1200bb.jpg"
        title="Upside Down"
      />
      <CardContent>
        <Typography variant="body1" component="p">
          Upside Down
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Jack Johnson and Friends: Sing-A-Longs and Lullabies for the Film
          Curious George
        </Typography>
      </CardContent>
    </Card>
  );
};

function rootReducer(state = {}) {
  return state;
}

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Toolbar>
        </AppBar>
        <Box display="flex" flexWrap="wrap" height="100%" flex="1">
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

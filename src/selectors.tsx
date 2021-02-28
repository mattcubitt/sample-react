import { State } from "./reducers";

export const searchSelector = (state: State) => {
  return state.search;
};

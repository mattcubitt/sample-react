import { combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";

export interface SearchResult {
  wrapperType: string;
  kind: string;
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  discCount: number;
  discNumber: number;
  trackCount: number;
  trackNumber: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  isStreamable: boolean;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  error: string | null;
  loading: boolean;
}

export interface State {
  search: SearchState;
}

export type Actions =
  | { type: "SEARCH/SET_QUERY"; payload: { query: string } }
  | { type: "SEARCH/SET_SEARCH_RESULTS"; payload: { results: SearchResult[] } }
  | { type: "SEARCH/SET_ERROR"; payload: { message: string } }
  | { type: "SEARCH/SET_LOADING"; payload: { loading: boolean } };

export type SearchDispatch = ThunkDispatch<State, any, Actions>;

const initialSearchState: SearchState = {
  query: "",
  results: [],
  error: null,
  loading: false,
};

const searchReducer = (
  state: SearchState = initialSearchState,
  action: Actions
) => {
  switch (action.type) {
    case "SEARCH/SET_QUERY":
      return { ...state, query: action.payload.query };
    case "SEARCH/SET_SEARCH_RESULTS":
      return { ...state, results: action.payload.results, error: null };
    case "SEARCH/SET_ERROR":
      return { ...state, error: action.payload.message };
    case "SEARCH/SET_LOADING":
      return { ...state, loading: action.payload.loading };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  search: searchReducer,
});

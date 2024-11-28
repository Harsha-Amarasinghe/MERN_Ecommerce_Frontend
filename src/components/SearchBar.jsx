import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import "./SearchBar.css"; 
const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = React.useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <div className="search-container">
      <TextField
        variant="outlined"
        placeholder="Search for products"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input-field"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="search-icon" />
            </InputAdornment>
          ),
          classes: {
            notchedOutline: "search-input-border",
          },
        }}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;

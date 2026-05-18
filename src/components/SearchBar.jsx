const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search Users..."
      onChange={e => onSearch(e.target.value)}
    />
  )
}

export default SearchBar
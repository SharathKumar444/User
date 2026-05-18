const FilterBar = ({ onFilter }) => {
  return (
    <div className="filter-container">
      <select
        className="filter-select"
        onChange={e => onFilter(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="Frontend Developer">
          Frontend Developer
        </option>
        <option value="Backend Developer">
          Backend Developer
        </option>
        <option value="UI/UX Designer">
          UI/UX Designer
        </option>
        <option value="Manager">
          Manager
        </option>
      </select>
    </div>
  )
}

export default FilterBar
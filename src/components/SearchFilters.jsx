import { RiEqualizer2Line } from "@remixicon/react";

function SearchFilters(params) {
  return (
    <div className="search-filters">
      <button>
        <RiEqualizer2Line size={20} /> фильтры
      </button>
      <ul className="filters-elems">
        <li>количество: 50 x</li>
        <li>сериалы х</li>
        <li>триллер х</li>
        <li>драма х</li>
        <li>комедия х</li>
        <li>2020-2025 х</li>
      </ul>
    </div>
  );
}

export default SearchFilters;

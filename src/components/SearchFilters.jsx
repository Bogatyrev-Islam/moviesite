import { RiEqualizer2Line, RiCloseLine } from "@remixicon/react";

function SearchFilters(params) {
  return (
    <div className="search-filters">
      <button>
        <RiEqualizer2Line size={20} /> фильтры
      </button>
      <ul className="filters-elems">
        <li>количество: 50 <RiCloseLine size={15}/></li>
        <li>сериалы <RiCloseLine size={15}/></li>
        <li>триллер <RiCloseLine size={15}/></li>
        <li>драма <RiCloseLine size={15}/></li>
        <li>комедия <RiCloseLine size={15}/></li>
        <li>2020-2025 <RiCloseLine size={15}/></li>
      </ul>
    </div>
  );
}

export default SearchFilters;

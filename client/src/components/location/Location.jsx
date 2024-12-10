import React, { useState } from "react";
import "./location.css";

const locations = [
  "Northern Region",
  "Eastern Region",
  "Western Region",
  "South Western Region",
  "West Nile",
  "Central Region",
];

export default function Location({ onLocationChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const filterLocations = (query) => {
    const filtered = locations.filter((location) =>
      location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    filterLocations(e.target.value);
    onLocationChange(e.target.value);
  };

  return (
    <>
      <div className="select-dropdown center">
        <select name='locationDropdown' value='location' onChange={handleInputChange}>
          <option value='none' hidden>Location</option>
          <option value=''>All Tickets</option>
          {
            locations.map((location, index) => {
              return <option key={index} value={location}>{location}</option>
            })
          }
        </select>
        {/* {filteredLocations.length === 0 && (
          <p style={{ display: 'block' }}>Select a location</p>
        )} */}
      </div>
    </>
  );
}

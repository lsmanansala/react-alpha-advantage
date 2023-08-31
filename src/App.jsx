import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const App = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [keys, setKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const fetchData = async () => {
    const response = await axios.get(
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=RIBXT3XYLI69PC0Q"
    );
    const data = response.data;
    setData(data["Time Series (Daily)"]);
    setKeys(Object.keys(data["Time Series (Daily)"]));
    setMeta(data["Meta Data"]);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = keys.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getChildKeys = (item) => {
    return Object.keys(item);
  };

  const formatLabel = (label) => {
    let string = label.split(" ")[1];
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
  };

  const formatDay = (day) => {
    return dayjs(day).format("MMMM D, YYYY");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-2">
        {"Information"}: {meta["1. Information"]}
      </h1>
      <div className="grid grid-rows-1">
        <div className="grid grid-col-1">
          <div className="text-md font-semibold mb-2">
            {"Symbol"}: {meta["2. Symbol"]}
          </div>
          <div className="text-md font-semibold mb-2">
            {"Last Refreshed"}: {formatDay(meta["3. Last Refreshed"])}
          </div>
        </div>
        <div className="grid grid-col-1">
          <div className="text-md font-semibold mb-2">
            {"Output Size"}: {meta["4. Output Size"]}
          </div>
          <div className="text-md font-semibold mb-2">
            {"Time Zone"}: {meta["5. Time Zone"]}
          </div>
        </div>
      </div>

      <div className="max-h-600 overflow-y-auto">
        <table className="min-w-full border divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Day</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((key, index) => (
              <React.Fragment key={index}>
                <tr
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <td className="px-6 py-4">{formatDay(key)}</td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-300 items-center justify-center">
                      {getChildKeys(data[key]).map((item, index) => (
                        <React.Fragment key={index}>
                          <div className="grid-cols-1 bg-white rounded-lg shadow-md p-4 my-2">
                            <div className="font-bold">{formatLabel(item)}</div>
                            <div>{data[key][item]}</div>
                          </div>
                        </React.Fragment>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        {keys.length > 0 && (
          <nav className="flex justify-center">
            <ul className="pagination inline-flex">
              {Array.from({
                length: Math.ceil(keys.length / itemsPerPage),
              }).map((_, index) => (
                <li key={index} className="page-item">
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`${
                      currentPage === index + 1 ? "font-semibold" : ""
                    } px-3 py-1 border rounded hover:bg-blue-500 hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;

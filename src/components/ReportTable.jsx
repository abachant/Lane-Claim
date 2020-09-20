import React from 'react';
import { useTable, useSortBy } from 'react-table';

function ReportTable(props) {

    const markerList = props.markerList;
    
    // Access instance of leaflet Map Element to directly interface with Leaflet API 
    const { leafletElement: mapInstance } = props.mapRef.current;
    
    // Get table data
    const data = React.useMemo(
        () => markerList,
        [markerList]
    )

    // Define Columns
    const columns = React.useMemo(
        () => [
            {
                Header: "Datetime",
                accessor: "dateTime",
            },
            {
                Header: 'Location',
                accessor: 'location',
            },
            {
                Header: 'License Plate',
                accessor: 'licensePlate',
            },
            {
                Header: 'License State',
                accessor: 'state',
            }
        ],
        []
    )
   
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable(
          { columns, data }, 
          useSortBy
          )
    
    // Convert timestamp from exif data to a more readable formatted Date object
    function formatDateTime(datetime){
        // Trim non-numeric characters from timestamp
        let date = datetime.split(' ')[0];
        let time = datetime.split(' ')[1];
        date = date.split(':');
        time = time.split(':');

        // Create Date object from input
        let formattedDateTime = new Date(date[0], date[1], date[2], time[0], time[1], time[2])
        const datetimeString = formattedDateTime.toLocaleString()
        return datetimeString
    }
    return (
        <div id="report-table">
            <table className="table" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span>
                                    {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' ▼'
                                            : ' ▲'
                                        : ''}
                                </span>
                            </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr className="table-row"{...row.getRowProps()} onClick={() => mapInstance.setView([row.original.latitude, row.original.longitude], 18)}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>


            {/* <table {...getTableProps()} className="table">
                <thead>
                    <tr>
                        <th>Datetime</th>
                        <th>Location</th>
                        <th>License Plate</th>
                        <th>License State</th>
                    </tr>
                </thead>
                <tbody> */}
                    {/* Create table entry for each incident in State */}
                    {/* {markerList.map(item => (
                        <tr key={item.name}>
                            <td>{formatDateTime(item.dateTime)}</td>
                            <td>{item.location}</td>
                            <td>{item.licensePlate}</td>
                            <td>{item.state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>    */}
        </div>
        
    );
}


export default ReportTable;
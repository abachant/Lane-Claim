import React from 'react';

function ReportTable(props) {

    const markerList = props.markerList

    return (
        <div className="report-table-container col-md-4 hidden-xs">
            <table className="table">
                <thead>
                    <tr>
                        <th>Datetime</th>
                        <th>Locaton</th>
                        <th>License Plate</th>
                        <th>license State</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Create table entry for each incident in State */}
                    {markerList.map(item => (
                        <tr key={item.key}>
                            <td>{item.dateTime}</td>
                            <td>{[item.latitude, item.longitude]}</td>
                            <td>{item.licensePlate}</td>
                            <td>{item.state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default ReportTable;
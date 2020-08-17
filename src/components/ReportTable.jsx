import React from 'react';

function ReportTable(props) {

    const markerList = props.markerList;
    
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
            <table  className="table">
                <thead>
                    <tr>
                        <th>Datetime</th>
                        <th>Location</th>
                        <th>License Plate</th>
                        <th>License State</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Create table entry for each incident in State */}
                    {markerList.map(item => (
                        <tr key={item.name}>
                            <td>{formatDateTime(item.dateTime)}</td>
                            <td>{item.location}</td>
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
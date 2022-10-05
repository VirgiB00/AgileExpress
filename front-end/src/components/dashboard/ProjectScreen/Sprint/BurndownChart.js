import React, {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import FetchInit from "../../../../utils/FetchInit";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export default function BurndownChart({sprint}) {
    const [sendFlag, setSendFlag] = useState(true);
    const [dat, setDat] = useState(null);

    if (sprint !== null && sendFlag) {
        fetch("/api/project/sprint/burndown?sprintId=" + sprint.id, FetchInit("get"))
            .then((response) => {
                if (response.status === 200) {
                    response.json()
                        .then((body) => {
                            setDat(body);
                        })
                }
            })
        setSendFlag(false);
    }
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Burndown Chart',
            },
        },
    };

    if (sprint !== null && dat !== null) {
        const labels = dat.label;
        const data = {
            labels,
            datasets: [
                {
                    label: 'Story Point',
                    data: dat.data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };
        return (
            <div>
                <Line data={data} options={options}/>
            </div>
        )
    } else {
        return <div></div>;
    }
}
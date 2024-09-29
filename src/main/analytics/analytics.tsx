// import React from 'react'
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import './analytics.css'
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions 
  } from 'chart.js';
import { Pie } from "react-chartjs-2";
import { useSelector } from 'react-redux';
// import { SpaceContext } from 'antd/es/space';

Chart.register(CategoryScale);
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


export default function Analytics() {
    const [title_data, set_title_data] = useState<number[]>([]);
    const [loader, set_loader] = useState(false);
    const [loading,setLoading] = useState(true);
    const [post_no, setPost_no] = useState(0);
    const {
        user: { userRef },
      } = useSelector((state: any) => state.reducer.user);

    useEffect(() => {
        const GetUserAnalytics = async () => {
            try {
                set_loader(true);
                const querySnapshot = await getDocs(collection(db, "users"));
                let user_data = [] as any[];
                querySnapshot.forEach((doc) => {
                    user_data.push(doc.data());
                });
                const reader_data = user_data.filter(reader => reader.title === 'Reader').length;
                const writer_data = user_data.filter(writer => writer.title === 'Writer').length;
                set_title_data([reader_data, writer_data]);
                set_loader(false);

            } catch (err) {
                console.log('error fetching analytics');
            }
        };

        GetUserAnalytics();

    }, [db]);
    useEffect(() => {
        setLoading(true);
        const getPost = collection(db, "posts");
        const querry = query(getPost, where("userId", "==", `${userRef}`));
        const unSubscribe = onSnapshot(querry, (querySnapShot) => {
            setPost_no(querySnapShot.docs.length)
            setLoading(false);
        });
        return () => {
          unSubscribe();
        };
      }, [userRef]);
      
      useEffect(() => {
        // setload(true);
        const getPost = collection(db, "posts");
        const querry = query(getPost, where("userId", "==", `${userRef}`));
        const unSubscribe = onSnapshot(querry, async (querySnapShot) => {
          const post = [] as any;
          querySnapShot.forEach((doc) => {
            const postData = doc.data(); 
            post.push(postData);
          });
        console.log({post})
        });
        return () => {
          unSubscribe();
        };
      }, []);

      const chartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
        datasets: [
          {
            label: 'post impressions',
            data: [12, 19, 3, 5, 2, 3, 9, 14, 7, 8, 5, 11],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    
      const options: ChartOptions<'bar'>  = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Data Bar Chart',
          },
        },
      };
    

    return (
        <main className="analytics_main">
            {loader && <span className='loader_container'><div className="loader"></div></span>}
            {title_data.length > 0 ?
                <section className="data_container">
                    <div className="title_data">
                        <Pie data={{
                            labels: ['Readers', 'Writers'],
                            datasets: [{
                                label: 'with a total number of',
                                data: title_data.map(dataset=> dataset),
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(255, 205, 86)'
                                ],
                                hoverOffset: 4
                            }]
                        }} />
                       <p className="data_title"><strong>- Readers to writers ratio</strong></p> 
                    </div>
                    <div className="Total_post">
                       <p>Total post -</p> 
                        {loading ? <span> .... </span>: <span>{post_no}</span>}

                    </div>
                    <div className="impression_stats">
                        <div className="impression_bar">
                        <Bar data={chartData} options={options} />
                        </div>
                    
                    </div>
                </section>
                // <p className="test">hello</p>
                :
                <span>No data</span>
            }
        </main>
    );
}

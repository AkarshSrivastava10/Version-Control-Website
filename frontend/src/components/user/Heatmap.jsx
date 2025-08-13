import React,{useState , useEffect} from "react";
import HeatMap from '@uiw/react-heat-map';
import "./profile.css";

//Function to generate data
const generateActivityData=(startDate , endDate)=>{
    const data=[];
    let currDate=new Date(startDate);
    let end=new Date(endDate);
    
    while(currDate<=end){
        const count = Math.floor(Math.random() * 50);
        data.push({
            date:currDate.toISOString().split("T")[0],
            count:count,
        });
        currDate.setDate(currDate.getDate()+1);
    }

    return data;
}

const generteRandomColor=(maxCount)=>{
    const colors={};
    for(let i=0;i<=maxCount;i+=1){
        const greenValue = Math.floor((i/maxCount)*255); //For shade
        colors[i]=`rgb(0,${greenValue},0)`;
    }
    return colors
}

const HeatMapProfile=()=>{
    const [activityData , setActivityData]=useState([]);
    const [pannelColors , setPannelColors]=useState({});
    useEffect(()=>{
        const fetchData=()=>{
            try{
                const startDate="2001-01-01";
                const endDate="2001-01-31";
                const data=generateActivityData(startDate , endDate);
                setActivityData(data);

                const maxCount=Math.max(data.map((d)=>d.count));
                setPannelColors(generteRandomColor(maxCount));
            }
            catch(err){
                console.error(err);
            }
        }
        fetchData();
    },[]);

    return (
        <div>
            <h4>Recent Contributions</h4>
            <HeatMap
                className="HeatMapProfile"
                style={{ color:"white" , height:"200px" , maxWidth:"700px"}}
                value={activityData}
                startDate={new Date('2001-01-01')}
                rectSize={15}
                space={2}
                rectProps={{rx:2.5}}
                weekLabels={["Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat"]}
                pannelcolors={pannelColors}
            />
        </div>
    );
}

export default HeatMapProfile;

function signin(event){
    event.preventDefault()
    document.querySelector(".loader-signin").style.display = "block";
    let email = document.getElementById("email").value 
    let password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            // console.log(user)
            console.log("Signed in")
            document.querySelector(".loader-signin").style.display = "none";
            location.href = "/NeuralStimulator"    // For running on the webpage
            //location.href = "/" // For running in a local PC
            // document.getElementsByClassName("text")[0].style.display = "block";
        })
        .catch((error) => {
            console.log(error);
        })
}

function signOut(){
    firebase.auth().signOut()
        .then( () => {
            console.log("User logged out")
            location.reload();
        })
        .catch((err) => {
            log(err)
        })
}

var timestamp_arr = Array()
var temp = Array()
var co = Array()

function getData(event){
    event.preventDefault();
    // let [date, month, year] = new Date().toLocaleDateString("en-in").split("/")
    // date = "0"+date
    // month = "0"+month
    if(document.getElementById("date").value === ""){
        alert("Please Enter Valid Date!")
        return
    }
    document.querySelector(".loader").style.display = "block";
    document.querySelectorAll("canvas").forEach(canvas=> {
        canvas.style.display="none"
    })

    document.getElementById('data').innerHTML= `
        <tr>
            <th class="td">Timestamp</th>
            <th class="temp">Temperature (&deg;C)</th>
            <th class="co">CO (µg/m³)</th>
        </tr>
    `;
    timestamp_arr = Array()
    temp = Array()
    co = Array()



    let [year, month, date] = document.getElementById("date").value.split("-")
    console.log(document.getElementById("date").value)

    firebase.database().ref(year+"/"+month+"/"+date+"/").once('value').then( snapshot => {     // use the on() oronce() methods of firebase.database.Reference to observe events.
        document.querySelector(".loader").style.display = "none";
        let data = snapshot.val();
        // console.log(data)
        for(time in data){
           console.log((data[time]));
           insert_data(year+"/"+month+"/"+date+" "+time, data[time]) 
        }
        // for(yr in data){
        //     // console.log(data[yr]);
        //     yrs_data = data[yr]
        //     for(month in yrs_data){
        //         // console.log(yrs_data[month]);
        //         months_data = yrs_data[month]
        //         for(day in months_data){
        //             // console.log(months_data[day])
        //             days_data = months_data[day]
        //             for(time in days_data){
        //                 // console.log((days_data[time]));
        //                 insert_data(yr+"/"+month+"/"+day+" "+time, days_data[time])
        //             }    
        //         }
        //     }
        // }
    })
}

function insert_data(timestamp, data){
    data = data.substring(1, data.length-1).split(",")
    for(i=0;i<data.length; i++){
        data[i] = Number(data[i].substring(1,data[i].length-1))
    }
    timestamp_arr.push(timestamp)
    temp.push(data[0])
    co.push(data[1])
     // console.log(data);
    var row = document.getElementById('data')
    row.innerHTML+= `
        <tr>
            <td class="td">${timestamp}</td>
            <td class="temp">${data[0]}</td>
            <td class="co">${data[1]}</td>
        </tr>`; 
        
        // draw_graph();
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPos, error)
    }else{
        alert("Geo Location not supported");
    }
}

function getPos(position){
    document.querySelector(".location").innerHTML = "Latitude: " + position.coords.latitude +
                                             " Longitude: " + position.coords.longitude 
}

function error(err) {
    console.log(err.message);
}


/*

[ ] - show data only of current date
IF user enters date ---->
    [ ] - get date using .value, split on "/" and retrive using array indexing
    [ ] - then add using only "innerHTML=" not "innerHTML+=" 
*/

//  function draw_graph(){
//     new Chart(document.getElementById('temp').getContext('2d'), {
//          // The type of chart we want to create
//         type: 'line',
//         // The data for our dataset
//         data: {
//             labels: timestamp_arr,
//             datasets: [{
//                 label: 'Temperature (℃)',
//                 backgroundColor: 'rgb(255, 99, 132)',
//                  borderColor: 'rgb(255, 99, 132)',
//                  data: temp,
//                  fill: false
//             }]
//          },
//          // .slice(0,temp.length/10
    
//         // Configuration options go here
//         options: {
//             //responsive: false,
//             //events: ['click'],
// 			title: {
// 					display: true,
// 					text: 'Temperature Chart'
// 			},
// 			tooltips: {
// 					mode: 'nearest',
//  					intersect: true,
//  			},
// 		    hover: {
//  					mode: 'nearest',
//                     intersect: true
//             },
//          }
//              });
             
             
//     new Chart(document.getElementById('co').getContext('2d'), {
//          // The type of chart we want to create
//          type: 'line',
//          // The data for our dataset
//          data: {
//              labels: timestamp_arr,
//              datasets: [{
//                  label: 'CO (PPB)',
//                  backgroundColor: 'rgb(255, 99, 132)',
//                  borderColor: 'rgb(255, 99, 132)',
//                  data: co,
//                  fill: false
//              }]
//          },
//          // .slice(0,temp.length/10
    
//          // Configuration options go here
//          options: {
//              //responsive: false,
//              //events: ['click'],
//  			title: {
//  					display: true,
//  					text: 'CO Chart'
//  			},
//  			tooltips: {
//  					mode: 'nearest',
//  					intersect: true,
//  			},
//  			hover: {
//  					mode: 'nearest',
//  					intersect: true
//  			},
//          }
//      });

//      new Chart(document.getElementById('aq').getContext('2d'), {
//          // The type of chart we want to create
//          type: 'line',
//          // The data for our dataset
//          data: {
//              labels: timestamp_arr,
//              datasets: [{
//                  label: 'Air_Quality [Smoke] (PPM)',
//                  backgroundColor: 'rgb(255, 99, 132)',
//                  borderColor: 'rgb(255, 99, 132)',
//                  data: aq,
//                  fill: false
//              }]
//          },
//          // .slice(0,temp.length/10
  
//          // Configuration options go here
//          options: {
//              //responsive: false,
//              //events: ['click'],
//  			title: {
//  					display: true,
//  					text: 'Air_Quality [Smoke] Chart'
//  			},
//  			tooltips: {
//  					mode: 'nearest',
//  					intersect: true,
// 			},
//  			hover: {
//  					mode: 'nearest',
//  					intersect: true
//  			},
//          }
//      });

//      new Chart(document.getElementById('pm2').getContext('2d'), {
//          // The type of chart we want to create
//          type: 'line',
//          // The data for our dataset
//          data: {
//              labels: timestamp_arr,
//              datasets: [{
//                  label: 'PM2.5 (ug/m^3)',
//                  backgroundColor: 'rgb(255, 99, 132)',
//                  borderColor: 'rgb(255, 99, 132)',
//                  data: pm2,
//                  fill: false
//              }]
//          },
//          // .slice(0,temp.length/10
    
//          // Configuration options go here
//          options: {
//              //responsive: false,
//              //events: ['click'],
//  			title: {
//  					display: true,
//  					text: 'PM2.5 Chart'
//  			},
//  			tooltips: {
//  					mode: 'nearest',
//  					intersect: true,
//  			},
//  			hover: {
//  					mode: 'nearest',
//  					intersect: true
//  			},
//          }
//      });

//      new Chart(document.getElementById('pm10').getContext('2d'), {
//          // The type of chart we want to create
//          type: 'line',
//          // The data for our dataset
//          data: {
//              labels: timestamp_arr,
//              datasets: [{
//                  label: 'PM10 (ug/m^3)',
//                  backgroundColor: 'rgb(255, 99, 132)',
//                  borderColor: 'rgb(255, 99, 132)',
//                  data: pm10,
//                  fill: false
//              }]
//          },
//          // .slice(0,temp.length/10
 
//          // Configuration options go here
//          options: {
//              //responsive: false,
//              //events: ['click'],
//  			title: {
//  					display: true,
//  					text: 'PM10 Chart'
//  			},
//  			tooltips: {
//  					mode: 'nearest',
//  					intersect: true,
//  			},
//  			hover: {
//  					mode: 'nearest',
//  					intersect: true
//  			},
//          }
//      });
//  }


 function draw_temp_graph(){
    document.querySelectorAll("canvas").forEach(canvas=> {
        canvas.style.display="none"
    })
     document.getElementById('temp').style.display="block"
    new Chart(document.getElementById('temp').getContext('2d'), {
        // The type of chart we want to create
       type: 'line',
       // The data for our dataset
       data: {
           labels: timestamp_arr,
           datasets: [{
               label: 'Temperature (°C)',
               backgroundColor: 'rgb(244, 164, 96)',
                borderColor: 'rgb(244, 164, 96)',
                data: temp,
                fill: false
           }]
        },
        // .slice(0,temp.length/10
   
       // Configuration options go here
       options: {
        //    responsive: false,
        //    events: ['click'],
           title: {
                   display: true,
                   text: 'Temperature Chart'
           },
           tooltips: {
                   mode: 'nearest',
                    intersect: true,
            },
           hover: {
                    mode: 'nearest',
                   intersect: true
           },
           scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date and Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (°C)'
                }
            }]
        }
    }
            });
 }

 function draw_co_graph(){
     document.querySelectorAll("canvas").forEach(canvas=> {
         canvas.style.display="none"
     })
    document.getElementById('co').style.display="block"
    new Chart(document.getElementById('co').getContext('2d'), {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: timestamp_arr,
            datasets: [{
                label: 'CO(µg/m³)',
                backgroundColor: 'rgb(205, 133, 63)',
                borderColor: 'rgb(205, 133, 63)',
                data: co,
                fill: false
            }]
        },
        // .slice(0,temp.length/10
   
        // Configuration options go here
        options: {
            //responsive: false,
            //events: ['click'],
            title: {
                    display: true,
                    text: 'CO Chart'
            },
            tooltips: {
                    mode: 'nearest',
                    intersect: true,
            },
            hover: {
                    mode: 'nearest',
                    intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date and Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'CO(µg/m³)'
                    }
                }]
            },
            chartArea: {
                backgroundColor: 'rgba(251, 85, 85, 0.4)'
            }
        }
    });
}

import Footer from './Footer';
import React, {useState} from 'react';
import './App.css';
import {compdict} from './dictionaries/computerdictionary';
import {phonedict} from './dictionaries/phonedictionary';

function App() {

  const stadiumPictures = ["https://upload.wikimedia.org/wikipedia/commons/a/a1/Portland_Trail_Blazers_at_Moda_Center%2C_December_2013_-_01.JPG","https://live.staticflickr.com/65535/48991070278_95a302ccfb_b.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/5c/NBA_-_February_2014_-_Celtics_vs_Spurs_-_TD_Garden_-_15.JPG", "https://upload.wikimedia.org/wikipedia/commons/5/59/New-York_Knicks_in_the_Madison_Square_Garden_%286054203290%29.jpg", "https://www.reddeeradvocate.com/wp-content/uploads/2021/12/27557769_web1_20211216131244-61bb89db0064a9b22ab3d1d1jpeg.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/30/Toyota_Center_Game_7_2018_playoffs.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/fe/Detroit_Pistons_vs._Dallas_Mavericks_February_2022_01_%28in-game_action%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9a/FedExForum_2015.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/b2/Quicken_Loans_Arena_WV_photo.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c2/G1C_Interior.jpg"];

  const [backStyle, setBackStyle] = useState({backgroundImage: 'url("https://64.media.tumblr.com/d0d35d169ce18a126a981c0711889e2a/31b08f0b993a723f-b6/s540x810/93f3b0bc85f70fbcc045c0384645c73b4a616083.gifv")'});

  let found = false;

  const [totThree, settotThree] = useState(0);
  const [totPoints, settotPoints] = useState(0);
  const [totAssists, settotAssists] = useState(0);
  const [totRebounds, settotRebounds] = useState(0);
  const [ppg, setppg] = useState(0);

  let totalPoints = 0;
  let totalGames = 0;
  let total3Made = 0;
  let totalAssists = 0;
  let totalRebounds = 0;
  let pointsPerGame = 0;
   
  const makeAPICall = async (playerName) => {

    settotPoints(0);
    settotThree(0);
    settotAssists(0);
    settotRebounds(0);
    setppg(0);

    let onePlayer = "";
    let dummyBool = false;
    let counter = 0;

    for(var i = 0; i < playerName.length; i++){
        
      if(dummyBool && counter<5){
        //account for names like shaquille o'neal
        if(playerName[i] !== "'"){
          onePlayer += playerName[i].toLowerCase();
        } else {
          counter--;
        }
        
        counter++;
      }
        
      if(playerName[i] === " "){
        dummyBool = true;
      }  
    }

    onePlayer += playerName[0].toLowerCase();
    //account for names with ' like d'angelo russell
    if(playerName[1]!=="'"){
      onePlayer += playerName[1].toLowerCase();
    } else {
      onePlayer += playerName[2].toLowerCase();
    }
    
    let dictionary = {};
    //this accounts for viewport size, different images will appear depending on the device used
    window.innerWidth > 600 ? dictionary = compdict : dictionary = phonedict;

    for(var key in dictionary){
      // console.log(key)
      if(key === onePlayer){
        console.log(dictionary[key])
        found = true;
        setBackStyle({ backgroundImage: 'url(' + dictionary[key] + ')' })
      }
    }
    //if there's no saved picture of the player, set the background image to be a random stadium picture
    if(!found){
      let randomIndex = Math.floor(Math.random() * stadiumPictures.length);
      setBackStyle({ backgroundImage: 'url(' + stadiumPictures[randomIndex] +  ')' })
    }

    try {
      fetch('https://hoop-stats.herokuapp.com/', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({"name": onePlayer}),
        mode:'cors'}) 
      .then(response => response.json())
      .then(data => {
      
        data.forEach((results) => {
          // console.log(results)
          // console.log(results.points);
          totalPoints += parseInt(results.points);
          settotPoints(totalPoints);
          totalGames += parseInt(results.games_played);
          total3Made += parseInt(results.threes_made);
          settotThree(total3Made);
          totalAssists += parseInt(results.assists);
          settotAssists(totalAssists);
          totalRebounds += parseInt(results.tot_rebounds);
          settotRebounds(totalRebounds);

          pointsPerGame = Math.round((totalPoints / totalGames) * 10) / 10;
          setppg(pointsPerGame);
          
      });
      })
      
    }
    catch (e) {
      console.log(e)
    }

    if(onePlayer === "abeych"){
      settotPoints(10000);
      settotAssists(10000);
      settotRebounds(10000);
      setppg(30.5);
      settotThree(3118);
    }
  }

  const [name, setName] = useState('');
  const [headingText, setHeadingText] = useState('NBA Player');

  function handleChange(event){
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    let formattedPlayer = "";
      formattedPlayer += name[0].toUpperCase();
      for (let i = 1; i < name.length; i++){
        if(name[i-1] === " "){
          formattedPlayer += name[i].toUpperCase();
        } else {
          formattedPlayer += name[i];
        } 
    }

    makeAPICall(name);

    setHeadingText(formattedPlayer);
    setName('');

  }
  
  return (
    <div className="App">
      <header className="App-header" style={backStyle}>

        <form action="http://localhost:8000/" method="post" onSubmit={handleSubmit}>
          <input spellcheck="false" name="name1" value={name}  onChange={handleChange} type="search" placeholder="Search for NBA Players"></input>
        </form>

        <h1>{headingText} Statistics</h1>
 
        <p>
          Welcome to the statistics of the National Basketball Association.
        </p>

        <div>
        <h2>Career points: {totPoints}</h2>
        <h2>Career assists: {totAssists}</h2>
        <h2>Career rebounds: {totRebounds}</h2>
        <h2>Career points per game: {ppg}</h2>
        <h2>Career threes made: {totThree}</h2>
      </div>
        
      </header>

      <Footer />
      
    </div>
      
  );
}
export default App;
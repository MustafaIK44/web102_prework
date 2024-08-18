/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

// loop over each item in the data
    games.forEach(element => {
        // create a new div element, which will become the game card
        const div = document.createElement("div");
        // add the class game-card to the list
        div.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")

        div.innerHTML = `
            <img src="${element.img}" class= "game-img">
            <p>
                ${element.name} 
            </p>
            <p>
                ${element.description} 
            </p>
            <p>
                Backers: ${element.backers} 
            </p>
        `;

        // append the game to the games-container
        gamesContainer.append(div);
    });
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
var contributions = GAMES_JSON.reduce((ac, nx) => {return ac + nx.backers}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = contributions.toLocaleString();

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
var pledged = GAMES_JSON.reduce((ac, nx) => {return ac + nx.pledged}, 0);
raisedCard.innerHTML = `$${pledged.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.reduce((ac) => {return ++ac;},0)

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedOnlyGames = GAMES_JSON.filter ( (game) => {
        if(game.pledged < game.goal){
            return game;
        }
        return;        
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedOnlyGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedOnlyGames = GAMES_JSON.filter ( (game) => {
        if(game.pledged >= game.goal){
            return game;
        }
        return;        
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedOnlyGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
var unfundedGameCount = GAMES_JSON.filter ( (game) => {return (game.pledged < game.goal)? game:0;}).reduce((ac) => {return ac + 1}, 0);
var totalNumGames = GAMES_JSON.reduce((ac) => {return ++ac;},0);


// create a string that explains the number of unfunded games using the ternary operator
var displayStr = `A total of $${pledged.toLocaleString()} has been raised for ${totalNumGames} games. Currently, ${unfundedGameCount} ${unfundedGameCount < 2 ? "game":"games"} remains unfunded. We need your help to fund these amazing games!`;


// create a new DOM element containing the template string and append it to the description container
var displayStrHtml = document.createElement("p");
displayStrHtml.innerHTML = displayStr;
descriptionContainer.append(displayStrHtml);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
var [firstGame, secondGame] = [...sortedGames];
// create a new element to hold the name of the top pledge game, then append it to the correct element
var firstGameDisplay = document.createElement("div");
firstGameDisplay.innerHTML = firstGame.name;
firstGameContainer.append(firstGameDisplay);

// do the same for the runner up item
var secondGameDisplay = document.createElement("div");
secondGameDisplay.innerHTML = secondGame.name;
secondGameContainer.append(secondGameDisplay);

function gameSearch(){

    deleteChildElements(gamesContainer);

    const input = document.getElementById("search-bar").value;
    
    var anan = [];
    GAMES_JSON.forEach((el)=>{
        var found = 0;

        for(let i = 0; i < input.length; i++){
            
            if(el.name[i].toLowerCase() === input[i].toLowerCase()){
                found++;
            }else{
                found = 0;
                break;
            }
        }
        if(found){
            anan.push(el);
        }
    });

    if(anan.length){
        addGamesToPage(anan);
    }else{
        const div = document.createElement("div");
        div.classList.add("game-card");

        div.innerHTML = `
            <p>
                No Games Found! 
            </p>
        `;
        gamesContainer.append(div);
    }
    
}

document.getElementById("search-btn").onclick = gameSearch;
document.getElementById("search-bar").addEventListener("keypress", (e)=>{if (e.key === 'Enter'){gameSearch()}})
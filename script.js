 const selectors ={
    boardContainer: document.querySelector(".board_container"),
    board: document.querySelector(".board"),
    moves:document.querySelector(".moves"),
    timer:document.querySelector(".timer"),
    start:document.querySelector(".button"),
    res:document.querySelector(".res"),
    win:document.querySelector(".win"),
    controls:document.querySelector(".controls")

}
    


const state ={
    gameStarted:false,
    flippedCards:0,
    totalFlips:0,
    totalTime:0,
    loop:null,
}
const shuffle = (array)=>{
const clonedArray = [...array];
for(let i=clonedArray.length-1;i>0;i--){
    const randomIndex = Math.floor(Math.random()*(i+1));
    const original = clonedArray[i];
    clonedArray[i] = clonedArray[randomIndex]
    clonedArray[randomIndex]=original
}
return clonedArray;
}
const pickRandom = (array,items)=>{
const clonedArray = [...array];
const randomPicks = [];
for(let i =0; i<items;i++){
    const randomIndex = Math.floor(Math.random()*clonedArray.length)
    randomPicks.push(clonedArray[randomIndex])
    clonedArray.splice(randomIndex,1)
}
return randomPicks;
}
const generateGame = ()=> {
    const dimensions = selectors.board.getAttribute("data-dimension")
    if(dimensions % 2 !== 0){
throw new Error("dimension petqe lini zuyd");
    }
    const emojis = ["🥔", "🍒", "🥑", "🌽", "🥕", "🍇", "🍉", "🍌", "🥭", "🍍"];
    const picks = pickRandom(emojis,(dimensions*dimensions)/2);
    const items = shuffle([...picks,...picks]);
    const  cards = `<div class="board" style="grid-template-columns:repeat(${dimensions},auto)">
    ${items.map(
        (item)=>`
        <div class="card">
        <div class="card-front"></div>
        <div class="card-back">${item}</div>
        </div>
        `
    ).join("")}
    </div>
    `
    const parser = new DOMParser().parseFromString(cards,"text/html")
    selectors.board.replaceWith(parser.querySelector(".board"))
}
const startGame = () => {
    state.gameStarted = true;
selectors.start.classList.add("disabled");
state.loop = setInterval(()=>{
    state.totalTime++;
    selectors.moves.innerText = `${state.totalFlips} moves`;
    selectors.timer.innerText = `time: ${state.totalTime}  seconds`;
    },1000)
    const res = document.createElement('button')                       
    res.innerHTML = ('Reastart')
    if (selectors.controls.childElementCount <= 2) {
        selectors.controls.append(res)
        res.onclick = () => location.reload()
    }
}

const flipBackCards = () => {
    document.querySelectorAll(".card:not(.matched)").forEach((card)=>{
        card.classList.remove("flipped")
    })
    state.flippedCards = 0;
}
const flipCard = (card) => {
state.flippedCards++;
state.totalFlips++;
if(!state.gameStarted){
startGame();

}
if(state.flippedCards <= 2){
card.classList.add("flipped")
}
if(state.flippedCards === 2){
const flippedCards = document.querySelectorAll(".flipped:not(.matched)")
if(flippedCards[0].innerText === flippedCards[1].innerText){
flippedCards[0].classList.add("matched")
flippedCards[1].classList.add("matched")
}
setTimeout(()=>{
flipBackCards();
},1000)
// const res = `<button ${onclick="res()"}>restart</button>`
// document.body.appendChild()
//     location.reload();
// const res = document.createElement("button");
//  res.innerHTML= "Restart";
//  selectors.controls.append(res); 
//  if(selectors.controls.res.length>2)  {
// selectors.controls.res.remove()
//  }
// res=()=>{
//     location.reload();
// }
   


}
if(!document.querySelectorAll(".card:not(.flipped)").length){
setTimeout(()=>{
    selectors.boardContainer.classList.add("flipped")
    selectors.win.innerHTML = `
    <span class="win-text">
    You won!<br />
    With <span class="highlight">${state.totalFlips}</span> moves <br />
under <span class="highlight">${state.totalTime}</span> seconds  </span>
    
    `
clearInterval(state.loop);
},1000)
}
}
const attachEventListeners = ()=>{
    document.addEventListener("click",(event)=>{
        const eventTarget = event.target;
    const eventParent = eventTarget.parentElement
    if(
        eventTarget.className.includes("card") &&
        !eventParent.className.includes("flipped")
    ){
flipCard(eventParent)
    }else if(
        eventTarget.nodeName ==="BUTTON" &&
        !eventTarget.className.includes("disabled")
    ){
startGame();
    }
    })
}

generateGame();
attachEventListeners();

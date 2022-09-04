"use strict";

document.addEventListener("DOMContentLoaded", init);

const RANDOM_API_QUOTE = "https://api.quotable.io/random";
let time = localStorage.getItem("time");
let quote = null;

function init(){
	document.addEventListener("input", changeColor);
	checkTime();
	displayAvgSpeed();
	renderNewQuote();
}

function displayAvgSpeed(){
	const avgSpeedLocalStorage = localStorage.getItem("avgSpeed");
	const avgSpeed = document.querySelector("#avg-speed");
	if (avgSpeedLocalStorage !== null){
		avgSpeed.insertAdjacentHTML("beforebegin", `<p>${avgSpeedLocalStorage} words/seconds<\p>`);
	} else {
		avgSpeed.insertAdjacentHTML("beforebegin", `<p>no current average yet<\p>`);
	}
}

function checkTime(){
	if (time !== null) return;
	localStorage.setItem("time", 0);
}

function getRandomQuote(){
	return fetch(RANDOM_API_QUOTE)
		.then(res => res.json())
		.then(data => data.content);
}

async function renderNewQuote(){
	quote = await getRandomQuote();
	const quoteArea = document.querySelector(".quote-display");
	const container = document.querySelector(".container");
	quoteArea.innerHTML = "";
	quoteArea.insertAdjacentHTML("beforeend", quote);
	container.insertAdjacentHTML("beforeend", `<p>words: ${countWords(quote)}<\p>`);
	displayQuote(quote, quoteArea);
	startTimer();
}

function displayQuote(quote, quoteArea){
	quoteArea.innerHTML = "";
	quote.split("").forEach(char => {
		const characterSpan = document.createElement('span');
		characterSpan.innerText = char;
		quoteArea.appendChild(characterSpan);
	});
}

function changeColor(e){
	const arrayQuote = document.querySelectorAll(".quote-display span");
	const arrayValues = document.querySelector(".quote-input").value.split("");
	let correct = true;

	arrayQuote.forEach((charSpan, index) => {
		const character = arrayValues[index];
		if (character == null) {
			charSpan.classList.remove("green");
			charSpan.classList.remove("red");
			correct = false;
		}
		else if (character == charSpan.innerText){
			charSpan.classList.add("green");
			charSpan.classList.remove("red");
		} else {
			charSpan.classList.add("red");
			charSpan.classList.remove("green");
			correct = false;
		}
	});
	if (correct) {
		localStorage.setItem("avgSpeed", countWords(quote)/(localStorage.getItem("time")/60));
		location.reload();
	}
}

function startTimer(){
	const timer = document.querySelector(".timer");
	timer.innerText = "0";
	let beginningOfRun = new Date(); 
	setInterval(() => {
		timer.innerText = getCurrentTime(beginningOfRun)
		localStorage.setItem("time", timer.innerText);
	}, 1000);
}

function getCurrentTime(beginningOfRun){
	return Math.floor((new Date() - beginningOfRun) / 1000)
	
}

function countWords(quote){ //Regex to check for invalid words
	let s = quote;
	s = s.replace (/\r\n?|\n/g, ' ')
		.replace (/ {2,}/g, ' ')
		.replace (/^ /, '')
		.replace (/ $/, '');
	let q = s.split (' ');
	return q.length;
}
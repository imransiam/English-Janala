const createElements = (arr) => {
  const htmlElements = arr.map((el)=> `<span class="btn">${el}</span>`)
  return htmlElements.join(' ');
}
  const manageLoading=(status)=>{
    if (status==true){
      document.getElementById("loader").classList.remove("hidden")
      document.getElementById("word-container").classList.add("hidden")
    } else {
      document.getElementById("word-container").classList.remove("hidden")
      document.getElementById("loader").classList.add("hidden")
    }
  }

  function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const loadLessons =()=>{
  fetch("https://openapi.programming-hero.com/api/levels/all")
  .then(res=>res.json())
  .then(json=>displayLesson(json.data));
};

  const removeActive =()=>{
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((btn) => {
      btn.classList.remove("active")
    })
  }
const loadLevelWord=(id)=>{
  manageLoading(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`
  fetch(url)
  .then(res=>res.json())
  .then(data=>{
    removeActive()
    const clickBtn = document.getElementById(`Lesson-btn-${id}`)
    
    clickBtn.classList.add("active")
    displayLevelWord(data.data);
  })
}


const loadWordDetails= async(id)=>{
  const url = `https://openapi.programming-hero.com/api/word/${id}`
  // console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
}


// {
//     "word": "Sincere",
//     "meaning": "সত্‍ / আন্তরিক",
//     "pronunciation": "সিনসিয়ার",
//     "level": 1,
//     "sentence": "He gave a sincere apology.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "honest",
//         "genuine",
//         "truthful"
//     ],
//     "id": 19
// }

const displayWordDetails =(word)=>{
  console.log(word);
  const detailsBox = document.getElementById("details-container")
  detailsBox.innerHTML=`
      <div class="text-3xl font-bold"><h2>${word.word} (<i class="fa-solid fa-microphone"></i>:${word.pronunciation})</h2></div>
      <div class="text-xl font-semibold"><p>Meaning</p>
      <p>${word.meaning}</p></div>
      <div class="text-xl font-semibold"><p>Example</p>
      <p>${word.sentence}</p></div>
      <div class="font-bold">
        <h2>সমার্থক শব্দ গুলো</h2>
        <div >${createElements(word.synonyms)}</div>
      </div>`
  document.getElementById("my_modal_5").showModal()
}
const displayLevelWord=(words)=>{
//? 1.get the container & empty it
const wordContainer = document.getElementById("word-container");
wordContainer.innerHTML = "";
if (words.length==0) {
  wordContainer.innerHTML=`<div class="col-span-full mx-auto">
      <img src="./assets/alert-error.png" class="mx-auto mb-5">
      <p class="text-center text-2xl font-bangla text-gray-400 font-semibold">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="text-center text-4xl font-bangla font-bold ">নেক্সট Lesson এ যান</h2>
     </div>`
  manageLoading(false);
  return;
}
//? 2.get into every word
for( const word of words){
  
  //? 3.create Element
//   {
//     "id": 82,
//     "level": 1,
//     "word": "Car",
//     "meaning": "গাড়ি",
//     "pronunciation": "কার"
// }
  const card = document.createElement("div");
  card.innerHTML=` <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl ">${word.word ? word.word : "শব্দ পাওয়া যায়নি" }</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="text-2xl font-bangla font-medium">"${word.meaning? word.meaning : " অর্থ পাওয়া যায়নি "} / ${word.pronunciation? word.pronunciation : "Pronounciation পাওয়া যায়নি"}"</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetails(${word.id})" class="shadow-sm btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="shadow-sm btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>`
  //? 4.append into container
  wordContainer.appendChild(card)
  

}
manageLoading(false);
}
const displayLesson=(lessons)=>{
//?   1.get the container & empty it
const levelContainer = document.getElementById("level-container");
levelContainer.innerHTML = "";
//?   2.get into every lesson
for( const lesson of lessons){
  console.log(lesson);
//?      3.create Element
const btnDiv = document.createElement("div");
btnDiv.innerHTML = `
<button id="Lesson-btn-${lesson.level_no}" onclick="loadLevelWord( ${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson ${lesson.level_no}</button>
`
//?      4.append into container
levelContainer.appendChild(btnDiv)
}


 }
loadLessons();

document.getElementById("btn-search").addEventListener("click",()=>{
  removeActive();
  const input = document.getElementById("input-search")
  const searchValue = input.value.trim().toLowerCase()
  console.log(searchValue);

  fetch(`https://openapi.programming-hero.com/api/words/all`)
  .then(res=>res.json())
  .then(data=>{
    const allWords = data.data;
    const filterWords = allWords.filter(word=> word.word.toLowerCase().includes(searchValue))
    displayLevelWord(filterWords);
  })

})
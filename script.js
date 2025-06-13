let accessToken;
let searchTimeOut;
document.addEventListener("DOMContentLoaded", function () {
  initiaApp();
  setupSearchListener();
});

function setupSearchListener(){
  const inputSearch = document.getElementById("input-search");
  inputSearch.addEventListener("input", (e) =>{
    const querry = e.target.value.trim();
    clearTimeout(searchTimeOut);


    // debounce
    searchTimeOut = setTimeout(async () =>{
      
      if(querry){
        const response = await getPopularTrack(querry);
        resetTrack();
        displayTrack(response.tracks.items);
      }
    },500);
    
  });
}

function resetTrack(){
  const trackSection = document.getElementById("track-section");
  trackSection.innerHTML = "";
}

async function initiaApp() {
    accessToken = await getSpotifyToken();
    if(accessToken){
        const response = await getPopularTrack();
        displayTrack(response.tracks.items);
    }
}

function truncateText(Text,number){
  return Text.length > number ? Text.slice(0,10) + "..."  : Text;
}


function displayTrack(data){
    
  data.forEach((item) => {
    console.log(item.id);
    const imageUrl = item.album.images[0].url
    const name = item.name;
    const artistName = item.artists.map(item => item.name).join(", ");

  // tạo ra thẻ div
  const element = document.createElement("div");


  // gắn class cho thẻ div
  element.className = "track-card";


  // gắn nội dung cho thẻ div
  element.innerHTML = `
      <div class="track-card-container">
        <img src="${imageUrl}" alt="">
          <h3>${truncateText(name,25)}</h3>
          <p>${truncateText(artistName,25)}</p>
      </div>`;

  // Thêm event listener để phát nhạc
  element.addEventListener("click", () =>{
    playTrack(item.id,name,artistName);
  })


  // gắn thẻ div đó vào track section
  const trackSection = document.getElementById("track-section");
  trackSection.appendChild(element);

  });
}



function playTrack(id,name,artistName){
  
  const iframe = document.getElementById('iframe');
  iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
  const model = document.getElementById("model");
  model.style.display = "block";
  const modelName = document.getElementById("model-name");
  modelName.innerHTML = name;
}

function handleClose(){
  const model = document.getElementById("model");
  const iframe = document.getElementById('iframe');
  model.style.display = "none";
  iframe.src = "";
}

async function getPopularTrack(querry = "HOYO-MIX") {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search",{
            headers:{
                Authorization: `Bearer ${accessToken}`
            },
            params:{
                q: querry,
                type: "track",
                limit: "20",
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function getSpotifyToken() {
  try {
    const credentials = btoa(
      `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
    );
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

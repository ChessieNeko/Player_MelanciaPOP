/*info Musica*/
const nomeMusica = document.getElementById('musica-nome');
const nomeBanda = document.getElementById('banda-nome');
const capaMusica = document.getElementById('capa-musica');
const musica = document.getElementById('musica-audio');
const tituloPlayList = document.querySelectorAll('.titulo-playlist');
/*Btns Player*/
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const btnPrevious = document.getElementById('btn-previous');
const btnLike = document.getElementById('btn-like');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');
/*Barra de progresso*/
const progressoAtual = document.getElementById('current-progress');
const containerProgresso = document.getElementById('container-barraProgresso');
/*tempo da musica*/
const tempoMusica = document.getElementById('tempo-musica');
const tempoTotal = document.getElementById('tempo-total');/*BARRA DE VOLUME*/
const btnVolume = document.getElementById('btn-icon-volume');
const volumeControl = document.getElementById('volume-control');
//Variáveis variáveis
let temSom = true; /*o volume por padrão esta ativado*/
let volumeAtual;

function trocaPlayPraPause(btnPlay){
    btnPlay.querySelector('.bi').classList.remove('bi-play-circle-fill');
    btnPlay.querySelector('.bi').classList.add('bi-pause-circle-fill');
}
function trocaPausePraPlay(btnPause){
    btnPause.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    btnPause.querySelector('.bi').classList.add('bi-play-circle-fill');
}

function repetirBtnClicado(){
    if(repetirAtivado === false){
        repetirAtivado = true;
        btnRepeat.classList.add('btn-ativo');

        btnRepeat.querySelector('.bi').classList.remove('bi-repeat');
        btnRepeat.querySelector('.bi').classList.add('bi-repeat-1');
    }else{
        repetirAtivado = false;
        btnRepeat.classList.remove('btn-ativo');

        btnRepeat.querySelector('.bi').classList.remove('bi-repeat-1');
        btnRepeat.querySelector('.bi').classList.add('bi-repeat');
    }
}

/*Btns Play-Pause*/
function tocarMusica(){
    trocaPlayPraPause(btnPlay);
    
    musica.play();
    isPlaying = true;
}

function tocarMusicaPorId(idMusica) {
    const musicaSelecionada = musicas.find(musica => musica.id === idMusica.toString());

    if (musicaSelecionada) {
        nomeMusica.innerText = musicaSelecionada.nomeMusica;
        nomeBanda.innerText = musicaSelecionada.artista;
        capaMusica.src = `assets/imagens/capasMusica/${musicaSelecionada.capa}`;
        musica.src = `assets/musicas/${musicaSelecionada.file}.mp3`;

        tocarMusica();
        isPlaying = true;
    } else {
        console.error(`Música com id ${idMusica} não encontrada.`);
    }
}

function pausarMusica(){
    trocaPausePraPlay(btnPlay);
    musica.pause();
    isPlaying = false;
}

function decidePlayPause(){
    const botoesPlayCard = document.querySelectorAll('.btn-playCard');

    if (isPlaying) {
        pausarMusica();
        botoesPlayCard.forEach((btn, i) => {
            if (i === idMusicaAtual) {
                trocaPausePraPlay(btn);
            }
        });
    } else {
        tocarMusica();
        botoesPlayCard.forEach((btn, i) => {
            if (i === idMusicaAtual) {
                trocaPlayPraPause(btn);
            }
        });
    }
}



/*Barra de Progresso*/
function paraHHMMSS(numOriginal){
    let horas = Math.floor(numOriginal/3600);
    let min = Math.floor((numOriginal-horas*3600)/60);
    let seg = Math.floor(numOriginal-horas*3600 - min*60);

    //return (`${horas.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`);
    
    return (`${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`);
}

function attProgresso(){
    const larguraBarra = (musica.currentTime/musica.duration)*100;
    progressoAtual.style.setProperty('--progresso', `${larguraBarra}%`);

    /*Sobre Tempo da Música*/
    tempoMusica.innerText = paraHHMMSS(musica.currentTime);
    attTempoTotal();
}

function pulaPra(event){
    const auxLargura = containerProgresso.clientWidth;
    const posicaoClick = event.offsetX;
    const pulaParaTempo = (posicaoClick/auxLargura)*musica.duration;
    musica.currentTime = pulaParaTempo;
}
function attTempoTotal(){
    tempoTotal.innerText = paraHHMMSS(musica.duration);
}
/******/

musica.addEventListener('loadedmetadata', attTempoTotal);
musica.addEventListener('timeupdate', attProgresso);
containerProgresso.addEventListener('click', pulaPra);
btnRepeat.addEventListener('click',repetirBtnClicado);





tituloPlayList.forEach(elemento => {
    elemento.innerHTML = nomePlaylist;
});

musica.addEventListener('loadedmetadata', function() {
    // Definindo o volume inicial para 5% (0.05)
    musica.volume = volumeControl.value;

    // Atualizando o valor do controle de volume para refletir o volume inicial
    volumeControl.value = musica.volume;
    
    /*att sempre*/
    volumeAtual = parseFloat(volumeControl.value);
});

/***Mudar Icone de Volume quando user interage***/
volumeControl.addEventListener('input', function() {
    musica.volume = this.value;

    /*att sempre a variável auxiliar*/
    volumeAtual = musica.volume;

    // Verifica o valor do range e troca o ícone do botão conforme necessário
    if (this.value < 0.001) {
        temSom = false;
    }else
        temSom = true;

    volumeBtnRender(this.value);
});

function volumeBtnClicado(){
    if(temSom === false){
        temSom = true;
        musica.volume = volumeAtual;
        volumeControl.value = volumeAtual;
    }else{
        temSom = false;
        musica.volume = 0;
        volumeControl.value = 0;
    }
    volumeBtnRender(musica.volume);
}

function volumeBtnRender(varVolume){
    if (temSom === false) {
        btnVolume.querySelector('.bi').classList.remove('bi-volume-down-fill','bi-volume-up-fill');
        btnVolume.querySelector('.bi').classList.add('bi-volume-mute-fill');
    }else if(varVolume < 0.50) {
        btnVolume.querySelector('.bi').classList.remove('bi-volume-mute-fill','bi-volume-up-fill');
        btnVolume.querySelector('.bi').classList.add('bi-volume-down-fill');
    }else{
        btnVolume.querySelector('.bi').classList.remove('bi-volume-down-fill');
        btnVolume.querySelector('.bi').classList.add('bi-volume-up-fill');
    }
}

btnPlay.addEventListener('click', decidePlayPause);
btnVolume.addEventListener('click', volumeBtnClicado);
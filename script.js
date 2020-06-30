//Možnosť vypnúť jednotlivé vlepšenia stránky (Užitočné hlavne pri testovaní, po čase z toho bolí hlava)
IMG_LOC = 'https://unikitty.greenmanov.net/'; //Miesto, kde sa nachádzajú obrázky k scriptu
VIDEO_WIDTH = 320;
VIDEO_HEIGHT = 180;
VIDEO_MARGIN = 30;
KITTY_SPEED = 6000;
FPS = 64;

/* Dúhové pozadie */
function rainbowBackground(bgTime) { //bgTime - čas na jeden ciklus
    var body = document.body;
    var hue = Math.floor((Math.random() * 360) + 1); //Náhodný odtieň farby
    body.style.background = 'hsl(' + hue + ',100%,40%)'; //Nastaví začiatočnú farbu
    body.setAttribute('bgHue', hue);
    setInterval(function() {
        var hue = body.getAttribute('bgHue');
        if (++hue > 359) //Vrátenie na začiatku cyklu, keď sa farba vráti znova na začiatok
            hue = 0;
        body.style.background = 'hsl(' + hue + ',100%,40%)';
        body.setAttribute('bgHue', hue);
    }, bgTime / 100);
}

/* Zdúhované odkazy */
function ranbowLinks(linkTime) {
    as = document.querySelectorAll('a');
    for (var i = 0; i < as.length; i++)
        parseLink(as[i]);
}

function parseLink(a) { //Spracuje odkaz a spustí animáciu
    if (a.firstChild != undefined && a.innerHTML == a.firstChild.nodeValue) { //Overí či odkaz neobsahuje HTML, ktoré by robilo pri zdúhovavání problémy
        a.innerHTML = a.firstChild.nodeValue.replace(/(.)/g, '<span>$1</span>'); //Rozloží obsah odkazu na jednotlivé znaky a tie vloží do spanov
        var spans = a.querySelectorAll('span');
        var hue = Math.round((360 / (spans.length != 0 ? spans.length : 1))); //O koľko sa má každému spanu zväčšiť hue farby
        a.style.color = '#fff';
        a.setAttribute('hue', hue);
        a.setAttribute('shift', Math.floor((Math.random() * spans.length) + 1)); //Náhodné posunutie dúhy oproti ostatným
        animateLink(a);
        function createFn(val) { //Riešenie problému s tým, že by sa animoval len posledný odkaz
            return function() {
                animateLink(val);
            };
        }
        setInterval(createFn(a), 500);
    }
}

function animateLink(a) { //Funkcia ktorá sa stará o zmenu farieb písmen v odkaze
    var spans = a.querySelectorAll('span');
    var hue = a.getAttribute('hue');
    var shift = parseInt(a.getAttribute('shift'));
    for (var i = 0; i < spans.length; i++) {
        spans[i].style.background = 'hsl(' + ((i + shift) % spans.length) * hue + ',100%,45%)'; //((i + shift) % spans.length) vypočíta posun zafarbenia
    }
    if (++shift >= spans.length)
        shift = 0;
    a.setAttribute('shift', shift);
}

/* Disco divy */
function divDisco(time) {
    setInterval(function() {
        var divs = document.querySelectorAll('div, section, article, ul, table, tr'); //Výber elementov, pre ktoré sa bude meniť pozadie
        for (var i = 0; i < divs.length; i++) {
            if (!(getComputedStyle(divs[i]).backgroundColor.toString() == 'rgba(0, 0, 0, 0)' || getComputedStyle(divs[i]).backgroundColor.toString() == 'transparent')) { //Zistí, či má alebo nemá element nastavené pozadie
                divs[i].style.background = 'hsl(' + Math.floor((Math.random() * 360) + 1) + ',100%,45%)';
            }
        }
    }, time);
}

/* Vytvoriť video */
function createVideo() {
    var width = VIDEO_WIDTH;
    var height = VIDEO_HEIGHT;
    var margin = VIDEO_MARGIN;
    //Video
    var video = document.createElement('div');
    video.id = 'unikittyVideo';
    video.setAttribute('magic', 0);
    video.style.width = width + 'px';
    video.style.height = height + 'px';
    video.style.position = 'fixed';
    //Výber náhodného rohu pre video
    if (Math.random() < 0.5)
        video.style.top = margin + 'px';
    else
        video.style.bottom = margin + 'px';
    if (Math.random() < 0.5)
        video.style.left = margin + 'px';
    else
        video.style.right = margin + 'px';
    video.innerHTML = '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/6IF2JZNXhEk?loop=1&list=PLkxRJLnS_kriTrjiwvVXOq5ZxwmQBkB7C&wmode=transparent&autoplay=1&mute=2" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

    //Zachytávač kliknutí
    var catcher = document.createElement('div');
    catcher.style.position = 'absolute';
    catcher.style.top = '0';
    catcher.style.bottom = '0';
    catcher.style.left = '0';
    catcher.style.right = '0';
    catcher.style.cursor = 'pointer';
    catcher.onclick = doMagic;
    //Unikitty
    var unikitty = document.createElement('div');
    unikitty.style.width = '100px';
    unikitty.style.height = '169px';
    unikitty.style.background = 'url(' + IMG_LOC + 'Uni-Kitty.png) no-repeat left top';
    unikitty.style.position = 'absolute';
    unikitty.style.bottom = '-' + margin + 'px';
    unikitty.style.right = '-' + margin + 'px';
    //Vloženie do stránky
    document.body.appendChild(video);
    video.appendChild(catcher);
    video.appendChild(unikitty);
}

//Kúzla na vylepšenie stránkiy
function doMagic(e) {
	if (e)
		e.preventDefault();
    var video = document.getElementById('unikittyVideo');
    var magic = parseInt(video.getAttribute('magic'));
    switch (magic) {
        case 0:
            rainbowBackground(50);
            break;
        case 1:
            ranbowLinks(300);
            break;
        case 2:
            divDisco(500);
            break;
        default:
            video.setAttribute('loop', 'true')
    }
    video.setAttribute('magic', magic + 1);

    /* Presun videa */
    //Premena pozície
    var pos = video.getBoundingClientRect();
    video.style.bottom = 'auto'; //Vynulovanie terajšej pozície
    video.style.right = 'auto'; //Vynulovanie terajšej pozície
    video.style.top = pos.top + 'px';
    video.style.left = pos.left + 'px';
    moveVideo();
}

function moveVideo() {
    var video = document.getElementById('unikittyVideo');

    clearInterval(video.getAttribute('moveInterval'));

    //Aktuálne súradnice
    var pos = video.getBoundingClientRect();
    var left = pos.left;
    var top = pos.top;

    //Náhodné súradnice
    var newLeft = Math.floor((Math.random() * (window.innerWidth - VIDEO_MARGIN - VIDEO_WIDTH)) + 1) + VIDEO_MARGIN;
    var newTop = Math.floor((Math.random() * (window.innerHeight - VIDEO_MARGIN - VIDEO_HEIGHT)) + 1) + VIDEO_MARGIN;

    //Výpočet rýchlostí vo vodorovnom a zvyslom smere
    var moveTop = newTop - top;
    var moveLeft = newLeft - left;
    var length = Math.sqrt(Math.pow(moveTop, 2) + Math.pow(moveLeft, 2)); //Vzdialenosť ktorú musí Unikitty preletieť (pytagorova veta)
    var speedTop = moveTop * (KITTY_SPEED / length);
    var speedLeft = moveLeft * (KITTY_SPEED / length);

    video.setAttribute('moveInterval', setInterval(function() {
        //Aktuálne súradnice
        var pos = video.getBoundingClientRect();
        var left = pos.left;
        var top = pos.top;

        if (video.getAttribute('loop') == 'true' && top == newTop && left == newLeft) { //Poslať Unikitty na nové miesto
            moveVideo();
        }

        moveLeft = left + (speedLeft / FPS);
        if (speedLeft > 0) { //Orientácia posunu
            if (moveLeft < newLeft)
                video.style.left = moveLeft + 'px';
            else if (moveLeft > newLeft)
                video.style.left = newLeft + 'px';
        } else {
            if (moveLeft > newLeft)
                video.style.left = moveLeft + 'px';
            else if (moveLeft < newLeft)
                video.style.left = newLeft + 'px';
        }

        moveTop = top + (speedTop / FPS);
        if (speedTop > 0) { //Orientácia posunu
            if (moveTop < newTop)
                video.style.top = moveTop + 'px';
            else if (moveTop > newTop)
                video.style.top = newTop + 'px';
        } else {
            if (moveTop > newTop)
                video.style.top = moveTop + 'px';
            else if (moveTop < newTop)
                video.style.top = newTop + 'px';
        }
    }, 1000 / FPS));
}

/* Spustenie vylepšovania stránky */
createVideo();
const d = document;

const $ = selector => d.querySelector(selector);

d.addEventListener("DOMContentLoaded", e => {

    const $containerInitialLeft = $(".cartoons-left"), $containerInitialRight = d.querySelector(".cartoons-right");
    const $containerFinallyLeft = $(".left"), $containerFinallyRight = $(".right");
    const $arrowLeft = $(".strength-left"), $arrowRight = $(".strength-right");
    const $vagoneta = $(".vagoneta");
    const $sumStrengths = $("#add-strength");
    const $winnerPoster= $(".winner");

    const $buttonStartAnimation = $(".start"), $buttonRestartAnimation = $(".restart"), $reloadButton = $(".reload");

    let $figureDragLeft, $figureDragRight, lenghtContainerDropLeft = 0,lenghtContainerDropRight;

    let strengthLeft = new Set(), strengthRight = new Set(), totalStrengthRight = 0, totalStrengthLeft = 0, timeOut;

    //Drag Start
    d.addEventListener("dragstart", (e) => {
        $containerFinallyLeft.querySelectorAll("img").forEach(figure => {
            if (e.target === figure) $figureDragLeft = figure.parentElement;
        });

        $containerFinallyRight.querySelectorAll("img").forEach(figure => {
            if (e.target === figure) $figureDragRight = figure.parentElement;
        });

        $containerInitialLeft.querySelectorAll("img").forEach(figure => {
            if (e.target === figure) $figureDragLeft = figure.parentElement;
        });

        $containerInitialRight.querySelectorAll("img").forEach(figure => {
            if (e.target === figure) $figureDragRight = figure.parentElement;

        });


    });

    //DragOver
    d.addEventListener('dragover', (e) => {
        if (e.target === $containerFinallyLeft || e.target === $containerFinallyRight) e.preventDefault();
        if (e.target === $containerInitialLeft || e.target === $containerInitialRight) e.preventDefault();
    });

    //Drop
    d.addEventListener('drop', (e) => {
        e.preventDefault();

        if (e.target === $containerFinallyLeft) {
            
            $containerFinallyLeft.appendChild($figureDragLeft);
            lenghtContainerDropLeft = $containerFinallyLeft.querySelectorAll("div").length;
            
            containsAnimation($vagoneta,$containerFinallyLeft,lenghtContainerDropLeft,$buttonStartAnimation,"rotate-20deg");
            $reloadButton.style.opacity = "100";
            $reloadButton.style.visibility = "visible";

            if (lenghtContainerDropLeft > 0) {
                $containerFinallyLeft.querySelectorAll("div > span").forEach(el => strengthLeft.add(parseInt(el.innerHTML.split('').filter(n => /[0-9]/.test(n)).join(''))));

                totalStrengthLeft = [...strengthLeft].reduce((acc, current) => acc + current, 0);

                d.querySelector("#tot-strength-left").innerHTML = `${totalStrengthLeft}N`;
                $arrowLeft.style.display = "flex";
                $arrowLeft.querySelector("img").style.width = `${totalStrengthLeft}px`;

                sumOfStrengths(totalStrengthRight, totalStrengthLeft, $sumStrengths);
            } 
        }

        if (e.target === $containerFinallyRight) {
            $containerFinallyRight.appendChild($figureDragRight);
            lenghtContainerDropRight = $containerFinallyRight.querySelectorAll("div").length;

            containsAnimation($vagoneta,$containerFinallyRight,lenghtContainerDropRight,$buttonStartAnimation,"rotate20deg");

            if (lenghtContainerDropRight > 0) {
                $reloadButton.style.opacity = "100";
                $reloadButton.style.visibility = "visible";

                $containerFinallyRight.querySelectorAll("div > span").forEach(el => strengthRight.add(parseInt(el.innerHTML.split('').filter(n => /[0-9]/.test(n)).join(''))));

                totalStrengthRight = [...strengthRight].reduce((acc, current) => acc + current, 0);

                d.querySelector("#tot-strength-right").innerHTML = `${totalStrengthRight}N`;
                $arrowRight.style.display = "flex";
                $arrowRight.querySelector("img").style.width = `${totalStrengthRight}px`;

                sumOfStrengths(totalStrengthRight, totalStrengthLeft, $sumStrengths);

            }
        }

        if (e.target === $containerInitialLeft) {
            $containerInitialLeft.appendChild($figureDragLeft);
            lenghtContainerDropLeft = $containerFinallyLeft.querySelectorAll("div").length;

            if (lenghtContainerDropLeft === 0 && lenghtContainerDropRight===0) $buttonStartAnimation.disabled = "true";

            let strengthRemoved = parseInt($figureDragLeft.firstElementChild.innerHTML.split('').filter(n => /[0-9]/.test(n)).join(''));

            console.log(strengthRemoved)
            totalStrengthLeft -= strengthRemoved;
            if (strengthLeft.has(strengthRemoved)) strengthLeft.delete(strengthRemoved);

            totalStrengthLeft === 0
                ? d.getElementById("tot-strength-left").parentElement.style.display = "none"
                : d.getElementById("tot-strength-left").innerHTML = `${totalStrengthLeft}N`;

            $containerInitialLeft.querySelectorAll("img").forEach(figure => figure.classList.remove("rotate-20deg"));

            sumOfStrengths(totalStrengthRight,totalStrengthLeft,$sumStrengths);

        }

        if (e.target === $containerInitialRight) {
            $containerInitialRight.appendChild($figureDragRight);
            lenghtContainerDropRight = $containerFinallyRight.querySelectorAll("div").length;

            if (lenghtContainerDropLeft === 0 && lenghtContainerDropRight===0) $buttonStartAnimation.disabled = "true";

            let strengthRemoved = parseInt($figureDragRight.firstElementChild.innerHTML.split('').filter(n => /[0-9]/.test(n)).join(''));
            
            totalStrengthRight -= strengthRemoved;

            if (strengthRight.has(strengthRemoved)) strengthRight.delete(strengthRemoved);

            totalStrengthRight === 0
                ? $("#tot-strength-right").parentElement.style.display = "none"
                : $("#tot-strength-right").innerHTML = `${totalStrengthRight}N`;

            $containerInitialRight.querySelectorAll("img").forEach(figure => figure.classList.remove("rotate20deg"));

            sumOfStrengths(totalStrengthRight,totalStrengthLeft,$sumStrengths);
        }

    });


    //Click
    d.addEventListener("click", e => {
        if (e.target === $buttonStartAnimation) {
            $buttonStartAnimation.innerHTML = "En curso...";
            $buttonStartAnimation.style.fontSize = ".9rem";
            $buttonStartAnimation.disabled = "true";

            $buttonRestartAnimation.removeAttribute("disabled");

            $containerFinallyLeft.querySelectorAll("img").forEach(figure => figure.classList.add("rotate-20deg"));
            $containerFinallyRight.querySelectorAll("img").forEach(figure => figure.classList.add("rotate20deg"));

            let time;
            if (lenghtContainerDropLeft === 1 || lenghtContainerDropRight === 1) {
                time= 4000;
            }
            if (lenghtContainerDropLeft === 2 || lenghtContainerDropRight === 2){
                time= 3000;
                $vagoneta.style.animationDuration = "3s";
            } 
            if (lenghtContainerDropLeft === 3 || lenghtContainerDropRight === 3) {
                time= 2000;
                $vagoneta.style.animationDuration = "2s";
            }

            if (totalStrengthRight > totalStrengthLeft) {
                $vagoneta.classList.add("animation-go-right");
                timeOut = setTimeout(() => {
                    $vagoneta.style.marginLeft = "500px";
                    $winnerPoster.style.opacity= "100";
                    $winnerPoster.style.visibility= "visible";
                    $winnerPoster.firstElementChild.textContent= "Gana el grupo de la derecha";
                    
                }, time);
            }
            if (totalStrengthLeft > totalStrengthRight) {
                $vagoneta.classList.add("animation-go-left");
                timeOut = setTimeout(() => {
                    $vagoneta.style.marginRight = "500px";
                    $winnerPoster.style.opacity= "100";
                    $winnerPoster.style.visibility= "visible";
                    $winnerPoster.firstElementChild.textContent= "Gana el grupo de la izquierda";
                }, time);
            }
        }

        if (e.target === $buttonRestartAnimation) {
            clearTimeout(timeOut);
            $buttonRestartAnimation.disabled = "true";
            $buttonStartAnimation.innerHTML = "Iniciar";
            $buttonStartAnimation.style.fontSize = "1.5rem";
            $buttonStartAnimation.removeAttribute("disabled");

            $vagoneta.style.marginLeft = "0px";
            $vagoneta.style.marginRight = "0px";
            $vagoneta.classList.remove("animation-go-left");
            $vagoneta.classList.remove("animation-go-right");
            $winnerPoster.style.visibility= "hidden";
            $winnerPoster.style.opacity= "0";

            $containerFinallyLeft.querySelectorAll("img").forEach(figure => figure.classList.remove("rotate-20deg"));
            $containerFinallyRight.querySelectorAll("img").forEach(figure => figure.classList.remove("rotate20deg"));

        }

        if (e.target === $reloadButton) {
            $buttonRestartAnimation.disabled= "true";
            $buttonStartAnimation.disabled= "true";
            location.reload();
        }

        
    });

});


function sumOfStrengths(strengthRight, strengthLeft, $container) {
    strengthLeft > strengthRight
        ? $container.innerHTML = `Sumatoria de fuerzas: ${strengthLeft - strengthRight}`
        : strengthLeft === strengthRight
            ? $container.innerHTML = `Sumatoria de fuerzas: 0`
            : $container.innerHTML = `Sumatoria de fuerzas: ${strengthRight - strengthLeft}`;
}


function containsAnimation($containerToAnimation,$containerOfElements,lengthElementsDrop,$buttonStart,rotate){
    if ($containerToAnimation.classList.contains("animation-go-left") || $containerToAnimation.classList.contains("animation-go-right") && lengthElementsDrop > 0) {
        $containerOfElements.querySelectorAll("img").forEach(figure => figure.classList.add(rotate));
        $buttonStart.disabled= "true";
    }else{
        $buttonStart.removeAttribute("disabled");
    }
}


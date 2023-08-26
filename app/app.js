window.addEventListener("DOMContentLoaded", () => {
    //CURSOR
    const cursor = document.querySelector(".cursor");
    window.addEventListener("mousemove", (e) => {
        cursor.style.opacity = "1";

        const minSize = 80,
              minRatio = 0.4,
              maxRatio = 0.8,
              ratio = e.clientX/e.clientY;

        if (ratio > maxRatio) {
            cursor.style.setProperty("--cursorS", maxRatio * minSize + "px");
        }
        else if (ratio < minRatio) {
            cursor.style.setProperty("--cursorS", minRatio * minSize + "px");
        }
        else {
            cursor.style.setProperty("--cursorS", ratio * minSize + "px");
        }
        cursor.style.setProperty("--mouseX", e.clientX + "px");
        cursor.style.setProperty("--mouseY", e.clientY + "px");
    })
    window.addEventListener("mouseout", () => {
        cursor.style.opacity = "0";
    })

    //ANIMACE
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    
    const smoother = ScrollSmoother.create({
        wrapper: ".wrapper",
        content: ".content",
        smooth: 3,
    })

    //vykreslení animace
    const canvas = document.querySelector(".header_canvas"),
          ctx = canvas.getContext("2d");

    const frames = [],
          framesNum = 250;
    let actFrame = { frame: 0 };

    for (let i = 1; i < framesNum + 1; i++) {
        let image = new Image();
        image.src = `./img/${i.toString().padStart(4, "0")}.webp`;
        frames.push(image);
    }
    //načtení obrázku hned na začátku
    frames[0].addEventListener("load", () => {
        actFrame.frame = 0;
        canvas.width = frames[0].width;
        canvas.height = frames[0].height;
        render();
    })

    if (frames[framesNum - 1]) {
        actFrame.frame = 0;
        render();

        const t1 = gsap.timeline();
        t1.to(actFrame, {
            frame: framesNum - 1,
            snap: "frame",
            scrollTrigger: {
                scrub: 5,
                pin: ".main_header",
                end: "400%",
            },
            onUpdate: render,
        }) 
        t1.fromTo(".about", {
            y: 200,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.5,
            duration: 3,
            scrollTrigger: {
                trigger: ".header_title",
                start: "1500%",
                end: "2000%",
                scrub: true,
            }
        })
        t1.to(".img",{
            x: "-100vw",
            scrollTrigger: {
                scrub: 5,
                trigger: ".img",
                start: "top",
                end: "300%",
                pin: ".gallery_sec",
            }
        })
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[actFrame.frame], 0, 0, canvas.width, canvas.height);
    }
})

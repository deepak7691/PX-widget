const styleElement = document.createElement("style");
styleElement.innerHTML = `
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }


  #px-buttonList {
      list-style-type: none;
      padding: 0;
      text-align: right;
      display: flex;
  }

  .px-list-button {
      width: 25px;
      height: 25px;
      justify-content: center;
      background: linear-gradient(90deg, #56CCF2 0%, #2F80ED 100%);
      color: #fff;
      box-shadow: 0 5px 10px rgb(0 0 0 / 20%);
      cursor: pointer;
      margin: 12px 2px;
      padding: 22px;
      text-align: center;
      transition: all 0.6s;
      text-decoration: none;
      display: flex;
      gap: 8px;
      align-items: center;
      border-radius: 8px;
      font-weight: 700;
      overflow: hidden;
      transform-origin: right;
  }

  .px-list-button.px-collapsable .px-label-text {
      display: none;
  }

  .px-list-button.px-collapsable.px-expanded {
      width: auto;
  }

  .px-list-button.px-collapsable.px-expanded .px-label-text {
      display: inline;
  }

  .px-list-button:hover {
      transform: scaleX(1);
  }

  .px-font-awesome-icon {
      font-size: 24px;
      margin-right: 10px;
      display: contents;
  }

  .px-iframe-container {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 1000;
  }

  .px-iframe-container iframe {
      width: 95%;
      height: 88%;
      margin: 6vh auto;
      display: block;
  }

  .px-close-btn {
    position: absolute;
    top: 10px;
    right: 40px;
    cursor: pointer;
    font-size: 26px;
    z-index: 999999;
  }

  .px-close-btn:hover {
      font-size: 30px;
      color: red;
      z-index: 999999;
  }

  .btn11{
      border: none;
      display: flex;
      justify-content: flex-end;
      background: none;
  }

  .px-list-button.px-large-button {
      width: auto;
      height: 22px;
      padding: 25px;
      display: flex;
      gap: 15px;
      justify-content: space-around;
      align-items: center;
  }

`;



var linkElement = document.createElement("link");  
linkElement.rel = "stylesheet";
linkElement.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
document.head.appendChild(linkElement);
document.head.appendChild(styleElement);


const div = document.createElement("div");
div.id = "px-buttonList";
const divContainer = document.createElement("div");
divContainer.id = "px-iframeContainer";
divContainer.className = "px-iframe-container";
const closeBtn = document.createElement("span");
closeBtn.className = "px-close-btn";
closeBtn.onclick = px_closeIframe;
const closeIcon = document.createElement("i");
closeIcon.className = "fa-solid fa-times";

closeBtn.appendChild(closeIcon);
const iframe = document.createElement("iframe");
iframe.id = "px-demoIframe";


divContainer.appendChild(closeBtn);
divContainer.appendChild(iframe);
document.body.appendChild(div);
document.body.appendChild(divContainer);


async function px_loadWidget(token) {
    try {
        const response = await fetch(`https://patcon.8px.us/api/config/user/widget/config/${token}`, {
            method: "GET",
            headers: {
                Authorization: "XNzZ5zxa3UAbBwR2",
                "Content-Type": "application/json; charset=utf-8",
            },
        });

        const pxDataSetting = await response.json();
        const { position, orientation, iscolapsable } = pxDataSetting.meta;
      
        document.getElementById("px-buttonList").innerHTML = "";
        pxDataSetting.config.forEach((item) => {
            px_createMenuAnchorTag(item, position, orientation, iscolapsable);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function px_createMenuAnchorTag(item, position, orientation, iscollapsable) {
    const buttons = document.createElement("button");
    buttons.className = "btn11"
    const menuItem = document.createElement("a");
    menuItem.href = "#";
    menuItem.className = "px-list-button";

    if (iscollapsable === 0) {
        menuItem.classList.add("px-collapsable");
    } else {
        menuItem.classList.add("px-large-button");
    }

    buttons.onmouseenter = function () {
        if (iscollapsable === 0) {
            menuItem.classList.add("px-expanded");
        }
    };

    buttons.onmouseleave = function () {
        if (iscollapsable === 0) {
            menuItem.classList.remove("px-expanded");
        }
    };
    
    buttons.onclick = function () {
        if (item.type === "iframe") {
            px_openIframe(item.url);
        } else if (item.type === "email") {
            window.location.href = `mailto:${item.url}`;
        } else if (item.type === "newtab") {
            window.open(item.url, '_blank');
        } else if (item.type === "sametab") {
            window.open(item.url, '_self');
        } else if (item.type === "tel") {
            window.location.href = `tel:${item.url}`;
        } else {
            window.location.href = item.url;
        }
    };
    

    const iconElement = document.createElement("i");
    iconElement.className = item.icon;
    iconElement.classList.add("px-font-awesome-icon");

    const labelSpan = document.createElement("span");
    labelSpan.className = "px-label-text";
    labelSpan.innerText = item.label;

    menuItem.appendChild(iconElement);
    menuItem.appendChild(labelSpan);
    buttons.appendChild(menuItem);

    document.getElementById("px-buttonList").appendChild(buttons);

    const div = document.getElementById("px-buttonList");
    div.style.position = "absolute";
    div.style.top = position.top;
    div.style.right = position.right;
    div.style.display = "flex";
    div.style.flexDirection = orientation === 1 ? "column" : "row";
}


function px_openIframe(url) {
    const iframeContainer = document.getElementById("px-iframeContainer");
    const demoIframe = document.getElementById("px-demoIframe");
    demoIframe.src = url;
    iframeContainer.style.display = "block";
}


function px_closeIframe() {
    const iframeContainer = document.getElementById("px-iframeContainer");
    const demoIframe = document.getElementById("px-demoIframe");
    demoIframe.src = "";
    iframeContainer.style.display = "none";
}



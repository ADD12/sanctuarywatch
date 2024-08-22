console.log("THIS IS A TEST");
console.log(post_id);
// screen.orientation.lock('landscape');
console.log("new wp")

// console.log(child_ids);
// access echoed JSON here for use. 
//get all links from single-scene.php


//helper for modal focus trap
function trapFocus(modalElement) {
    function getFocusableElements() {
        return Array.from(modalElement.querySelectorAll(
            'button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }

    function handleKeydown(e) {
        const focusableElements = getFocusableElements();
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab' || e.keyCode === 9) {
            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        } 
    }

    function handleFocus(e) {
        if (!modalElement.contains(e.target)) {
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('focus', handleFocus, true);

    const initialFocusableElement = getFocusableElements()[0];
    if (initialFocusableElement) initialFocusableElement.focus();

    return function cleanup() {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('focus', handleFocus, true);
    };
}




let child_obj = JSON.parse(JSON.stringify(child_ids));
console.log(child_obj);
// console.log("this is the post id: ", post_id);//prob dont need this
let url1 =(JSON.stringify(svg_url));
url = url1.substring(2, url1.length - 2);
console.log(url1);
// let hover_color;
let testData;
let thisInstance;
let sceneLoc;
let colors;
let sectionObj = {};
let sectColors = {};

if (!is_mobile()) {
    // Create a new style element
    const style = document.createElement('style');
    // style.type = 'text/css';
    style.innerHTML = `
        @media (min-width: 512px) and (max-width: 768px) {
            #toc-container{
                margin-left: 0px !important;
            }
            #scene-row > div.col-md-9{
                margin-left: 0px !important;
            }
            #title-container{
                margin-left: 0px !important;
            }
            #title-container > div > div.col-md-2 > div{
                max-width: 96% !important;
            }
            #top-button{
                margin-bottom: 5px;
                font-size: large;
                z-index: 1;
                margin-top: 2%;
            }
            #toggleButton{
                margin-bottom: 0px;
                font-size: large;
                z-index: 1;
            }
            #toc-group{
                padding-top: 2%;
            }
        }
    `;
    // Append the style to the head of the document
    document.head.appendChild(style);
}


function process_child_obj(){
    for (let key in child_obj){
        if (child_obj[key]["scene"]["ID"] !== post_id){
            delete child_obj[key];
        }
        else{
           
            let oldkey = String(key);
            console.log(typeof(oldkey));
            console.log(oldkey);
            // child_obj[newkey] = child_obj[key];
                // child_obj[newkey]["original_name"] = null;
                // delete child_obj[key];
            // }
            let lastChar = oldkey.charAt(oldkey.length - 1);

            let isNumeric = /\d/.test(lastChar);
            console.log(lastChar);
            console.log(isNumeric);
            if (isNumeric){
                let newkey = child_obj[key]["original_name"];
                console.log(newkey);
                child_obj[newkey] = child_obj[key];
                delete child_obj[key];
            }
        }
    }
}
process_child_obj();
console.log("MODIFIED");
console.log(child_obj);
// document.getElementById("svg1").innerHTML =`<img src="${url}" alt="">`;
function make_scene_elements(info, iText, iUrl, scene_data, type, name){
    let collapseListHTML = '<div>';
            for (let i = 1; i < 7; i++){
                // let info_field = "scene_info" + i;
                let info_field = info + i;

                // let info_text = "scene_info_text" + i;
                let info_text = iText + i;

                // let info_url = "scene_info_url" + i;
                let info_url = iUrl + i;

                let scene_info_text = scene_data[info_field][info_text];
                let scene_info_url = scene_data[info_field][info_url];
                if ((scene_info_text == '') && (scene_info_url == '')){
                    continue;
                }
                // console.log(scene_info_text);
                // console.log(scene_info_url);
                let listItem = document.createElement('li');
                let anchor = document.createElement('a');
                anchor.setAttribute('href', 'test'); 
                anchor.textContent = 'test';

                listItem.appendChild(anchor);

                // collapseList.appendChild(listItem);
                collapseListHTML += `<div> <a href="${scene_info_url}">${scene_info_text}</a> </div>`;
                collapseListHTML += '</div>';
            }
    // let acc = createAccordionItem("test-item-1", "test-header-1", "test-collapse-1", "More Info", collapseListHTML);
    let acc = createAccordionItem(`${type}-item-1`, `${type}-header-1`, `${type}-collapse-1`, name, collapseListHTML);

    
    return acc;
}

async function make_title() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const fetchURL = `${protocol}//${host}/wp-json/wp/v2/scene?&order=asc`;

    try {
        let response = await fetch(fetchURL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();

        let currentUrl = window.location.href;
        console.log(currentUrl);
        console.log("all the scenes are here.")
        console.log(data);

        let scene_data = data.find(scene => scene.link === currentUrl);
        if (!scene_data) {
            throw new Error('Scene data not found for the current URL');
        }
        console.log(scene_data);

        let scene_location = scene_data["scene_location"];
        let title = scene_data.title.rendered;

        let titleDom = document.getElementById("title-container");
        let titleh1 = document.createElement("h1");
        titleh1.innerHTML = title;
        titleDom.appendChild(titleh1);

        let acc = make_scene_elements("scene_info", "scene_info_text", "scene_info_url", scene_data, "more-info", "More Info");
        let acc1 = make_scene_elements("scene_photo", "scene_photo_text", "scene_photo_url", scene_data, "images", "Images");
        // let acc2 = make_scene_elements("scene_tagline", "scene_tagline_text", "scene_tagline_url", scene_data, "tagline", "tagline");

        let accgroup = document.createElement("div");
        if (!is_mobile()) {
            accgroup.setAttribute("style", "margin-top: 2%");
        } else {
            accgroup.setAttribute("style", "max-width: 85%; margin-top: 2%");
        }
        accgroup.classList.add("accordion");
        accgroup.appendChild(acc);
        accgroup.appendChild(acc1);
     
        let row = document.createElement("div");
        row.classList.add("row");

       

        let col1 = document.createElement("div");
        // col1.classList.add("col-md-2");
        col1.appendChild(accgroup);

        let col2 = document.createElement("div");
        // col2.classList.add("col-md-10");

        if (!is_mobile()) {
            col1.classList.add("col-md-3");
            col2.classList.add("col-md-9");
            // document.querySelector("#title-container").style.marginLeft = '0%';
            function adjustTitleContainerMargin() {
                if (window.innerWidth < 512) {
                    document.querySelector("#title-container").style.marginLeft = '0%';
                } else {
                    document.querySelector("#title-container").style.marginLeft = '9%'; // Reset or apply other styles if needed
                }
            }
            adjustTitleContainerMargin();
            window.addEventListener('resize', adjustTitleContainerMargin);

        } else {
            col1.classList.add("col-md-2");
            col2.classList.add("col-md-10");
        }

        if (is_mobile()){
            col2.setAttribute("style", "padding-top: 5%; align-content: center; margin-left: 7%;");
        }

        let titleTagline = document.createElement("p");
        titleTagline.innerHTML = scene_data.scene_tagline;
        titleTagline.style.fontStyle = 'italic';
        if (is_mobile()){
            let item = createAccordionItem("taglineAccId", "taglineHeaderId", "taglineCollapseId", "Tagline", scene_data.scene_tagline);
            accgroup.append(item);

        } else {
            col2.appendChild(titleTagline);
        }

        row.appendChild(col1);
        row.appendChild(col2);
        row.setAttribute("style", "margin-top: 1%");

        titleDom.append(row);
        return scene_location;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

let mobileBool = false;

//checks whether or not an icon has an associated mobile layer.
function has_mobile_layer(mob_icons, elemname){
    // console.log("mobile icons here:");
    // console.log(mob_icons);
    if (mob_icons == null){
        console.log("uh oh");
        return false;
    }
    for (let i = 0; i < mob_icons.children.length; i++) {
        let child = mob_icons.children[i];
        // console.log("mob icons helper here");
        // console.log(child); 
        let label = child.getAttribute('inkscape:label');
        if (label === elemname){
            console.log(`found ${label}`);
            return true;
        }             
    }
    console.log("uh oh");
    return false;
}

//returns DOM elements for mobile layer
function get_mobile_layer(mob_icons, elemname){
    for (let i = 0; i < mob_icons.children.length; i++) {
        let child = mob_icons.children[i];
        // console.log("mob icons helper here");
        // console.log(child); 
        let label = child.getAttribute('inkscape:label');
        if (label === elemname){
            // console.log("in get mobile laters");
            // console.log(child);
            return child;
        }             
    }
    return null;
}

function remove_outer_div(){
    let container =  document.querySelector("#entire_thing");
    while (container.firstChild) {
        document.body.insertBefore(container.firstChild, container);
    }
    container.remove();

}

//helper function for creating mobile grid for loadSVG:
function mobile_helper(svgElement, iconsArr, mobile_icons){
    // console.log(svgElement);
    remove_outer_div();
    let defs = svgElement.firstElementChild;
   
    function updateLayout(numCols, numRows) {
        let outer_cont = document.querySelector("body > div.container-fluid");
        outer_cont.innerHTML = '';
    
        let idx = 0;
        for (let i = 0; i < numRows; i++) {
            let row_cont = document.createElement("div");
            row_cont.classList.add("row");
            row_cont.setAttribute("id", `row-${i}`);
            
            for (let j = 0; j < numCols; j++) {
                if (idx < iconsArr.length) {
                    let cont = document.createElement("div");
                    cont.classList.add("col-4");
                    cont.style.paddingBottom = '10px';
                    cont.style.paddingTop = '5px';
                    cont.style.fontWeight = 'bold'; 
                    cont.style.border = '2px solid #000';
                    // cont.style.color = '#008da8';
                    // cont.style.background = 'white';
                    cont.style.background = 'radial-gradient(white, #f0f0f0)'; 
                   
                    let svgClone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
                    cont.appendChild(svgClone);
                    let currIcon = iconsArr[idx].id;
                    let key  ='';
                    if (!has_mobile_layer(mobile_icons, currIcon)){
                        key = svgElement.querySelector(`#${currIcon}`).cloneNode(true);
                    } else {
                        key = get_mobile_layer(mobile_icons, currIcon);
                        let temp = svgElement.querySelector(`#${currIcon}`).cloneNode(true);
                        let tempId = temp.getAttribute("id");
                        key.setAttribute("id",  tempId);
                    }
                    cont.setAttribute("id", `${currIcon}-container`);
                    svgClone.append(defs);
                    svgClone.append(key);
                    
                    let caption = document.createElement("div");
                    if (child_obj[currIcon]){
                        caption.innerText = child_obj[currIcon].title;
                    } else {
                        caption.innerText = "not in wp yet, have to add";
                    }
                    
                    caption.setAttribute("style", "font-size: 15px")
                    cont.appendChild(caption);
                    row_cont.appendChild(cont);
                    setTimeout(() => {
                        let bbox = key.getBBox(); 
                        svgClone.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
                    }, 0);
    
                    idx += 1;
                } else {
                    continue;
                }
            }
            // outer_cont.style.marginTop = '70%';
            outer_cont.style.marginLeft = '-1.5%';
            outer_cont.appendChild(row_cont);
        }
    }

    function updateNumCols() {
        let numCols;
        let numRows;
        // let mobViewImage = document.querySelector("#mobile-view-image");
        // console.log(mobViewImage.style);
        let ogMobViewImage = 'transform: scale(0.3); margin-right: 65%; margin-top: -70%; margin-bottom: -70%'
        let sceneFluid = document.querySelector("#scene-fluid");
        let ogSceneFluid = 'margin-top: 70%; margin-left: -1.5%;'
        let colmd2 = document.querySelector("#title-container > div > div.col-md-2");
        let ogColmd2 = colmd2.getAttribute("style", "");

        if (window.innerWidth > window.innerHeight) {
            let mobViewImage = document.querySelector("#mobile-view-image");
            let sceneFluid = document.querySelector("#scene-fluid");
            let colmd2 = document.querySelector("#title-container > div > div.col-md-2");
            let mobModalDialog = document.querySelector("#mobileModal > div");
            let modalDialogInfo = document.querySelector("#myModal > div");

            console.log("aaahahaha");
            numCols = 4;
            console.log("landscapeee");  
            mobViewImage.setAttribute("style", "transform: scale(0.5); margin-right: 35%; margin-top: -23%")
            sceneFluid.setAttribute("style", "margin-top: 25%;margin-left: -1.5%; display: block");
            colmd2.setAttribute("style", "width: 100%")
            mobModalDialog.setAttribute("style", "z-index: 9999;margin-top: 10%;max-width: 88%;");
            modalDialogInfo.setAttribute("style", "z-index: 9999;margin-top: 10%;max-width: 88%;");
        //   updateLayout();

        } else  {
          numCols = 3;
            let mobViewImage = document.querySelector("#mobile-view-image");
            let sceneFluid = document.querySelector("#scene-fluid");
            let colmd2 = document.querySelector("#title-container > div > div.col-md-2");
            let mobModalDialog = document.querySelector("#mobileModal > div");
            let modalDialogInfo = document.querySelector("#myModal > div");

            console.log("Portrait mode");
            mobViewImage.setAttribute("style", '');
            mobViewImage.setAttribute("style", ogMobViewImage);
            sceneFluid.setAttribute("style", '');
            sceneFluid.setAttribute("style", ogSceneFluid);
            colmd2.setAttribute("style", '');
            colmd2.setAttribute("style", ogColmd2);
            mobModalDialog.setAttribute("style", "z-index: 9999;margin-top: 60%;max-width: 88%;");
            modalDialogInfo.setAttribute("style", "z-index: 9999;margin-top: 60%;max-width: 88%;");

        //   updateLayout();

        }
        // updateLayout();
        numRows = Math.ceil((iconsArr.length/numCols));
        console.log(`Number of columns: ${numCols}`);
        console.log("number of rows: ");
        console.log(numRows);

        updateLayout(numCols, numRows);
        // mobViewImage.remove();
        add_modal();

      }
    updateNumCols();
    window.addEventListener("resize", updateNumCols);

   
}

// Below is the function that will be used to include SVGs within each scene
//based on link_svg from infographiq.js

async function loadSVG(url, containerId) {
    try {
        // Step 1: Fetch the SVG content
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const svgText = await response.text();
        // console.log(svgText);

        // Step 2: Parse the SVG content
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;
        // console.log(svgElement);
        // console.log(svgElement);
        svgElement.setAttribute("id", "svg-elem");

        //Append the SVG to the DOM
        const container = document.getElementById(containerId);
        console.log(container);
        // container.appendChild(svgElement);
        // console.log(svgElement);
        // checking if user device is touchscreen
        if (is_touchscreen()){
            console.log("this is touchscreen");
            // flicker_highlight_icons();
            // console.log("touchscreen recognized");
            if (is_mobile() && (deviceDetector.device != 'tablet')){ //a phone and not a tablet; screen will be its own UI here
                // console.log("mobile recognized within conditional");

                //smaller image preview here for mobile
                let fullImgCont = document.querySelector("#mobile-view-image");

                
                // fullImgCont.setAttribute("style", "");

                console.log(fullImgCont);
                
                let titleRowCont = document.querySelector("#title-container > div");
                let sceneButton = document.createElement("button");
                sceneButton.innerHTML = "<strong>View Full Scene</strong>";
                // sceneButton.setAttribute("style", "margin-left: -13%; max-width: 80%; border-radius: 10px");
                sceneButton.setAttribute("style", "margin-left: -13%; max-width: 80%; border-radius: 10px; background-color: #008da8; color: white;");

                sceneButton.setAttribute("class", "btn ");
                sceneButton.setAttribute("data-toggle", "modal");
                // sceneButton.setAttribute("data-target", "#exampleModal");

                titleRowCont.appendChild(sceneButton);
                let svgElementMobileDisplay = svgElement.cloneNode(true);
                svgElementMobileDisplay.style.height = '10%';
                svgElementMobileDisplay.style.width = '100%';

              
                let modal = document.getElementById("mobileModal");
                // let modalContent = document.querySelector("#mobileModal > div > div");
                let modalBody = document.querySelector("#mobileModal > div > div > div.modal-body")
                modalBody.appendChild(svgElementMobileDisplay);
                // let span = document.getElementsByClassName("close")[0];

                sceneButton.onclick = function() {
                    modal.style.display = "block";
                  }
                  
                  
                  // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                      history.pushState("", document.title, window.location.pathname + window.location.search);
                    }
                  }
                // let closeButton = document.querySelector("#mobileModal > div > div > div.modal-footer > button");
                let closeButton = document.querySelector("#close1");
                closeButton.onclick = function() {
                    // if (event.target == modal) {
                      modal.style.display = "none";
                      history.pushState("", document.title, window.location.pathname + window.location.search);
                    // }
                  }
        
        
                mobileBool = true;
                const iconsElement = svgElement.getElementById("icons");
                //fix here
                let mobileIcons = null;
                if (svgElement.getElementById("mobile")){
                    mobileIcons = svgElement.getElementById("mobile").cloneNode(true);
                } 
                // const mobileIcons = svgElement.getElementById("mobile").cloneNode(true);
                // console.log(iconsElement);
                // console.log("mobile icons here:");
                // console.log(mobileIcons);

                //for mobile: only leave icons, nothing else
                // const parentElement = svgElement.querySelector('g.cls-3');
                // let parentElement = svgElement.querySelector("#g");
                // console.log(svgElement.lastElementChild);
                let parentElement = svgElement.lastElementChild;
                    // console.log(Array.from(parentElement.children));
                const children = Array.from(parentElement.children);
                // console.log(children);
                children.forEach(child => {
                    if ((child !== iconsElement ) ) {
                            parentElement.removeChild(child);
                    }
                });
                // parentElement.appendChild(mobileIcons);
                // console.log(svgElement);
                let iconsArr = Array.from(iconsElement.children);
                mobile_helper(svgElement, iconsArr, mobileIcons);
                // mobile_icons_helper(mobileIcons);

                // add_modal();
                // window.addEventListener('load', function() {
                //     make_title();
                // });
                // make_title();
                // highlight_icons();
                // flicker_highlight_icons();
                
                
            } else{ //if it gets here, device is a tablet
                //hide mobile icons
                
                console.log("tablet");
                // remove_outer_div();
                window.addEventListener('load', function() {
                    let mob_icons = document.querySelector("#mobile");
                    if (mob_icons) {
                        mob_icons.setAttribute("display", "none");
                    }
                });
                
                
                container.appendChild(svgElement);
                // flicker_highlight_icons();
                toggle_text();
                full_screen_button('svg1');
                if (thisInstance.instance_toc_style == "list"){
                    list_toc();
                } else {
                    table_of_contents();
                }               
                add_modal();
                flicker_highlight_icons();
                // make_title();


            }
        }
        else{ //device is a PC
            //hide mobile icons
            window.addEventListener('load', function() {
                let mob_icons = document.querySelector("#mobile");
                if (mob_icons) {
                    mob_icons.setAttribute("display", "none");
                }
            });
            
            container.appendChild(svgElement);
            highlight_icons();
            // table_of_contents();
            // list_toc();
            toggle_text();
            full_screen_button('svg1');
            if (thisInstance.instance_toc_style == "list"){
                list_toc();
            } else {
                table_of_contents();
            }               
            add_modal();
            // make_title();

            
        }
        // highlight_icons();
        // table_of_contents();
        // add_modal();
        // make_title();
        // full_screen_button('svg1');
        // toggle_text();
        // window.addEventListener('load', function() {
        //     make_title();
        //     // console.log(child_obj);
        // });



    } catch (error) {
        console.error('Error fetching or parsing the SVG:', error);
    }
}


//highlight items on mouseover, remove highlight when off; 
//CHANGE HERE FOR TABLET STUFF
function highlight_icons(){
    for (let key in child_obj){
        let elem = document.querySelector('g[id="' + key + '"]');
        // console.log(elem);
        elem.addEventListener('mouseover', function(){
            // console.log('mousing over: ', key); 
            // elem.style.stroke = "yellow"; //this is no longer hard-coded
            // elem.style.stroke = thisInstance.instance_hover_color; //this is no longer hard-coded; //ideally, make a dictionary mapping each  key to a section to a color
            // elem.style.stroke = sectColors[sectionObj[key]];
            if (thisInstance.instance_colored_sections === "yes"){
                // console.log("yes!");
                elem.style.stroke = sectColors[sectionObj[key]];
            } else{
                elem.style.stroke = colors[0];
            }
            // console.log(thisInstance);
            // elem.style.stroke = sectColors[sectionObj[key]];

            elem.style.strokeWidth = "3px";
        });
        elem.addEventListener('mouseout', function(){
            // console.log('mousing out: ', key); 
            elem.style.stroke = "";
            elem.style.strokeWidth = "";
        });
    }  
}
//flicker highlight on and off, for tablets
function flicker_highlight_icons() {
    for (let key in child_obj) {
        let elem = document.querySelector('g[id="' + key + '"]');
        if (elem) {
            // Add transition for smooth fading
            // console.log("elem here is: ");
            // console.log(elem);
            elem.style.transition = 'stroke-opacity 1s ease-in-out';
            
            // Initial state
            // elem.style.stroke = "yellow";
            // elem.style.stroke = sectColors[sectionObj[key]];
            if (thisInstance.instance_colored_sections === "yes"){
                elem.style.stroke = sectColors[sectionObj[key]];
                // console.log("yes here");
            } else{
                elem.style.stroke = colors[0];
            }

            elem.style.strokeWidth = "3";
            elem.style.strokeOpacity = "0";

            // Create flickering effect
            let increasing = true;
            setInterval(() => {
                if (increasing) {
                    elem.style.strokeOpacity = "0.5";
                    increasing = false;
                } else {
                    elem.style.strokeOpacity = "0";
                    increasing = true;
                }
            }, 1500); // Change every 1 second
        }
    }
}



//check if touchscreen
function is_touchscreen(){
    //check multiple things here: type of device, screen width, 
    return ( 'ontouchstart' in window ) || 
           ( navigator.maxTouchPoints > 0 ) || 
           ( navigator.msMaxTouchPoints > 0 );
    
}

//check operating system
// function is_mobile(){
//     return (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        
// }
function is_mobile() {
    return (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
           && (window.innerWidth < 512 || window.innerHeight < 512);
}

//helper function from the internet; using it to check if device is a tablet or not. 
var deviceDetector = (function ()
{
  var ua = navigator.userAgent.toLowerCase();
  var detect = (function(s)
  {
    if(s===undefined)s=ua;
    else ua = s.toLowerCase();
    if(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua))
                return 'tablet';
          else
      if(/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua))            
                    return 'phone';
                else return 'desktop';
    });
    return{
        device:detect(),
        detect:detect,
        isMobile:((detect()!='desktop')?true:false),
        userAgent:ua
    };
}());
 
//creates an accordion item w/custom IDs based on input
function createAccordionItem(accordionId, headerId, collapseId, buttonText, collapseContent) {
    // Create Accordion Item
    let accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");
    accordionItem.setAttribute("id", accordionId);

    // Create Accordion Header
    let accordionHeader = document.createElement('h2');
    accordionHeader.classList.add("accordion-header");
    accordionHeader.setAttribute("id", headerId);

    // Create Accordion Button
    let accordionButton = document.createElement('button');
    // accordionButton.classList.add('accordion-button');
    accordionButton.classList.add('accordion-button', 'collapsed'); // Add 'collapsed' class
    accordionButton.setAttribute("type", "button");
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", `#${collapseId}`);
    accordionButton.setAttribute("aria-expanded", "false");
    accordionButton.setAttribute("aria-controls", collapseId);
    accordionButton.innerHTML = buttonText;

    // Append Button to Header
    accordionHeader.appendChild(accordionButton);

    // Create Accordion Collapse
    let accordionCollapse = document.createElement('div');
    accordionCollapse.classList.add("accordion-collapse", "collapse");
    accordionCollapse.setAttribute("id", collapseId);
    accordionCollapse.setAttribute("aria-labelledby", headerId);

    // Create Accordion Collapse Body
    let accordionCollapseBody = document.createElement('div');
    accordionCollapseBody.classList.add("accordion-body");
    accordionCollapseBody.innerHTML = collapseContent;

    // Append Collapse Body to Collapse
    accordionCollapse.appendChild(accordionCollapseBody);

    // Append Header and Collapse to Accordion Item
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);

    return accordionItem;
}
function render_tab_info(tabContentElement, tabContentContainer, info_obj){
    const containerDiv = document.createElement('div');
    containerDiv.style.background = 'LightGrey';
    containerDiv.style.width = '100%';
    containerDiv.style.display = 'table';
    containerDiv.style.fontSize = '120%';
    containerDiv.style.padding = '10px';
    containerDiv.style.marginBottom = '10px';
    containerDiv.style.margin = '0 auto'; 
    containerDiv.style.borderRadius = '6px 6px 6px 6px'; 


    // Create the table row div
    const tableRowDiv = document.createElement('div');
    tableRowDiv.style.display = 'table-row';

    // Create the left cell div
    const leftCellDiv = document.createElement('div');
    leftCellDiv.style.textAlign = 'left';
    leftCellDiv.style.display = 'table-cell';

    // More Science Link Here
    const firstLink = document.createElement('a');
    firstLink.href = info_obj['scienceLink'];
    firstLink.target = '_blank';
    firstLink.appendChild(document.createTextNode(info_obj['scienceText']));
    let icon1 = `<i class="fa fa-clipboard-list" role="presentation" aria-label="clipboard-list icon" style=""></i> `;
    firstLink.innerHTML = icon1 + firstLink.innerHTML;
    firstLink.style.textDecoration = 'none';
    leftCellDiv.appendChild(firstLink);

    // Create the right cell div
    const rightCellDiv = document.createElement('div');
    rightCellDiv.style.textAlign = 'right';
    rightCellDiv.style.display = 'table-cell';

    // Create the second link
    const secondLink = document.createElement('a');
    secondLink.href = info_obj['dataLink'];
    secondLink.target = '_blank';
    let icon2 = `<i class="fa fa-database" role="presentation" aria-label="database icon"></i>`;
    secondLink.appendChild(document.createTextNode(info_obj['dataText']));
    // secondLink.innerHTML = secondLink.innerHTML + `  ` + icon2;
    secondLink.innerHTML = icon2 + `  ` + secondLink.innerHTML;

    secondLink.style.textDecoration = 'none';


    // Add the second link to the right cell div
    rightCellDiv.appendChild(secondLink);
    tableRowDiv.appendChild(leftCellDiv);
    tableRowDiv.appendChild(rightCellDiv);
    containerDiv.appendChild(tableRowDiv);
    tabContentElement.appendChild(containerDiv);

    const figureDiv = document.createElement('div');
    figureDiv.classList.add('figure');

    const img = document.createElement('img');
    img.src = info_obj['imageLink'];
    img.alt = '';
    figureDiv.appendChild(img);
    figureDiv.setAttribute("display","flex");
    // figureDiv.style.display = "flex";
    figureDiv.style.justifyContent = "center"; // Center horizontally
    figureDiv.style.alignItems = "center";
    img.setAttribute("style", "max-width: 100%;margin-top: 3%; justify-content: center");
    // img.setAttribute("style", "margin-top: 2px;");

    

    // img.setAttribute("style", "justify-content: center;");

    const caption = document.createElement('p');
    caption.classList.add('caption');
    caption.innerHTML = info_obj['shortCaption'];

    figureDiv.appendChild(caption);
    tabContentElement.appendChild(figureDiv);

    // Create the details element
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Click for Details';
    details.appendChild(summary);
    // details.appendChild(document.createTextNode(info_obj['longCaption']));
    let longCaption = document.createElement("p");
    longCaption.innerHTML = info_obj['longCaption'];
    details.appendChild(longCaption);

    // Add the details element to the tab content element
    tabContentElement.appendChild(details);
    tabContentContainer.appendChild(tabContentElement);

    // console.log("tab content container");
    // console.log(tabContentContainer);
}

function fetch_tab_info(tabContentElement, tabContentContainer, tab_label){
    // let id = child_obj['infauna']['id'];
    // console.log(id);
    // console.log(tab_label);
    // tab_label = "test";
    const protocol = window.location.protocol;
    const host = window.location.host;
    const fetchURL  =  protocol + "//" + host  + "/wp-json/wp/v2/figure?&order=asc"
    // let fetchURL = 'http://sanctuary.local/wp-json/wp/v2/modal?&order=asc'; //will have to change eventually, relevant code in admin-modal
    fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // console.log(tab_label);
            figure_data = data.find(figure => figure.figure_tab === tab_label);
            if (!figure_data){
                //we don't create anything here...
                //don't have to render any of the info
                // tabContentContainer.setAttribute("display", "hidden");
                return;
                
            } else{
                console.log(figure_data); 
                // tabContentContainer.setAttribute("display", "");

            // console.log(figure_data['figure_caption_long']);
            //title stuff:
                let img = '';
                if (figure_data['figure_path']==='External'){
                    img = figure_data['figure_external_url'];
                } else {
                    img = figure_data['figure_image'];
                }
                info_obj = {
                "scienceLink": figure_data["figure_science_info"]["figure_science_link_url"],
                "scienceText": figure_data["figure_science_info"]["figure_science_link_text"],
                "dataLink": figure_data["figure_data_info"]["figure_data_link_url"],
                "dataText": figure_data["figure_data_info"]["figure_data_link_text"],
                "imageLink" : img,
                "shortCaption" : figure_data["figure_caption_short"],
                "longCaption": figure_data["figure_caption_long"]
                };
                // console.log(info_obj);
                render_tab_info(tabContentElement, tabContentContainer, info_obj);
            }

        })
    .catch(error => console.error('Error fetching data:', error));
        //new stuff here
   
}

//create tabs
function create_tabs(iter, tab_id, tab_label, title = "") {
    tab_id = tab_label.replace(/\s+/g, '_'); 
    title = title.replace(/\s+/g, '_');
    console.log(tab_id);
    console.log("creating a tab");

    let tab_target = `#${title}-${tab_id}-pane`;
    let tab_controls = `${title}-${tab_id}-pane`;

    let myTab = document.getElementById('myTab');
    let navItem = document.createElement("li");
    navItem.classList.add("nav-item");
    navItem.setAttribute("role", "presentation");
    navItem.style.color = 'black';
    
    const button = document.createElement('button');
    button.classList.add('nav-link');
    if (iter === 1) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
    } else {
        button.setAttribute('aria-selected', 'false');
    }
    button.id = `${title}-${tab_id}`;
    button.setAttribute('data-bs-toggle', 'tab');
    button.setAttribute('data-bs-target', tab_target);
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', tab_controls);
    button.style.color = 'black';
    button.textContent = tab_label;

    navItem.appendChild(button);
    myTab.appendChild(navItem);

    let tabContentContainer = document.getElementById("myTabContent");
    const tabContentElement = document.createElement('div');
    tabContentElement.classList.add('tab-pane', 'fade');
    
    if (iter === 1) {
        tabContentElement.classList.add('show', 'active');
    }
    
    tabContentElement.id = tab_controls;
    tabContentElement.setAttribute('role', 'tabpanel');
    tabContentElement.setAttribute('aria-labelledby', `${title}-${tab_id}`);
    tabContentElement.setAttribute('tabindex', '0');

    tabContentContainer.appendChild(tabContentElement);

    button.addEventListener('click', function() {
        window.location.hash = `${title}/${tab_id}`; 
    });

    fetch_tab_info(tabContentElement, tabContentContainer, tab_label);
}




function render_modal(key){
    let id = child_obj[key]['modal_id'];
    // console.log(child_obj[key]);
    const protocol = window.location.protocol;
    const host = window.location.host;
    const fetchURL  =  protocol + "//" + host  + `/wp-json/wp/v2/modal/${id}`;
    // let fetchURL = 'http://sanctuary.local/wp-json/wp/v2/modal?&order=asc'; //will have to change eventually, relevant code in admin-modal
    fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            console.log(id);
            modal_data = data //.find(modal => modal.id === id);
            console.log("modal data here:");
            console.log(modal_data); 
            //title stuff:
            let title = child_obj[key]['title'];  //importat! pass as argument
            let modal_title = document.getElementById("modal-title");
            
            modal_title.innerHTML = title;

            //tagline container
            let tagline_container = document.getElementById('tagline-container');
            //add stuff for formatting here...
            // console.log(modal_data);
            let modal_tagline = modal_data["modal_tagline"];
            tagline_container.innerHTML =  "<em>" + modal_tagline + "<em>";

            //generate accordion
            // Select the container where the accordion will be appended
            let accordion_container = document.getElementById('accordion-container');
            //add stuff for formatting here...
            // accordion_container.innerHTML = '';
            // Create the accordion element
            let acc = document.createElement("div");
            acc.classList.add("accordion");

            if (is_mobile()){
                console.log("is mobile");
                tagline_container.setAttribute("class", "");
                accordion_container.setAttribute("class", "");

                tagline_container.classList.add("col-6");
                accordion_container.classList.add("col-6");
                // tagline_container.setAttribute("style", "min-width: 300px;max-width: 85%; margin-left: -20%");
                tagline_container.setAttribute("style", "min-width: 300px");

                // accordion_container.setAttribute("style", "max-width: 20%;");
                // function handleOrientationChange() {
                //     let tagline_container = document.getElementById('tagline-container');
                //     let accordion_container = document.getElementById('accordion-container');
                //     if ((window.innerWidth < window.innerHeight)) {
                //         accordion_container.style.minWidth = '300px';
                //         accordion_container.style.maxWidth = '20%';
                //         tagline_container.style.width = '85% !important'
                //     } else {
                //         print("landscape mf");
                //         accordion_container.style.minWidth = ''; 
                //         accordion_container.style.maxWidth = '';
                //         accordion_container.style.width = '0 !important';
                //         tagline_container.style.width = '0 !important';
                //     }
                // }
                
                // handleOrientationChange();
                // window.addEventListener('resize', handleOrientationChange);

                let modalDialog = document.querySelector("#myModal > div");
                // modalDialog.setAttribute("style", "z-index: 9999; margin-top: 55%;max-width: 90%;margin-left: 17px;");
                // modalDialog.setAttribute("style", "z-index: 9999; margin-top: 35%;max-width: 90%;margin-left: 4.5%;");

            } else{
                tagline_container.setAttribute("class", "");
                accordion_container.setAttribute("class", "");
                tagline_container.classList.add("col-9");
                accordion_container.classList.add("col-3");
                // tagline_container.setAttribute("style", "min-width: 300px;max-width: 85%; margin-left: -20%");
                // accordion_container.setAttribute("style", "min-width: 300px; min-width: 10%; max-width: 20%;");
            }
            // let collapseList = document.createElement("ul");
            //for more info
            let collapseListHTML = '<div>';
            for (let i = 1; i < 7; i++){
                let info_field = "modal_info" + i;
                let info_text = "modal_info_text" + i;
                let info_url = "modal_info_url" + i;

                let modal_info_text = modal_data[info_field][info_text];
                let modal_info_url = modal_data[info_field][info_url];
                if ((modal_info_text == '') && (modal_info_url == '')){
                    continue;
                }
                // console.log(modal_info_text);
                // console.log(modal_info_url);
                let listItem = document.createElement('li');
                let anchor = document.createElement('a');
                anchor.setAttribute('href', modal_info_url); 
                anchor.textContent = modal_info_text;

                listItem.appendChild(anchor);

                // collapseList.appendChild(listItem);
                collapseListHTML += `<div> <a href="${modal_info_url}">${modal_info_text}</a> </div>`;
                collapseListHTML += '</div>';
            }
            //for photos:
            let collapsePhotoHTML = '<div>';
            for (let i = 1; i < 7; i++){
                let info_field = "modal_photo" + i;
                let info_text = "modal_photo_text" + i;
                let info_url = "modal_photo_url" + i;

                let modal_info_text = modal_data[info_field][info_text];
                let modal_info_url = modal_data[info_field][info_url];
                if ((modal_info_text == '') && (modal_info_url == '')){
                    continue;
                }
                // console.log(modal_info_text);
                // console.log(modal_info_url);
                let listItem = document.createElement('li');
                let anchor = document.createElement('a');
                anchor.setAttribute('href', modal_info_url); 
                anchor.textContent = modal_info_text;

                listItem.appendChild(anchor);

                // collapseList.appendChild(listItem);
                collapsePhotoHTML += `<div> <a href="${modal_info_url}">${modal_info_text}</a> </div>`;
                collapsePhotoHTML += '</div>';
            }
            
            let accordionItem1 = createAccordionItem("accordion-item-1", "accordion-header-1", "accordion-collapse-1", "More Info", collapseListHTML);
            let accordionItem2 = createAccordionItem("accordion-item-2", "accordion-header-2", "accordion-collapse-2", "Images", collapsePhotoHTML);

            acc.appendChild(accordionItem1);
            acc.appendChild(accordionItem2);


            accordion_container.appendChild(acc);
            // allkeyobj[key] = true;

            //for tabs jere:
            // window.addEventListener('load', function() {
            
            let num_tabs = Number(modal_data["modal_tab_number"]);
            for (let i =1; i <= num_tabs; i++){
                let tab_key = "modal_tab_title" + i;
                let tab_title = modal_data[tab_key];

               
                create_tabs(i, tab_key, tab_title, title);
                console.log(`iteration ${i}, tab key ${tab_key} tab title ${tab_title}`);
                if (i === num_tabs){
                    break;
                }
                // let tabContentContainer = document.getElementById("myTabContent");
                // tabContentContainer.innerHTML = '';
                // document.querySelector("#myModal > div > div>div").innerHTML = '';
                // let myModal = document.querySelector("#myModal");
                let mdialog = document.querySelector("#myModal > div"); //document.querySelector("#myModal");
                // trapFocus(myModal);
                trapFocus(mdialog);
              
            }
        // });
            



        })
    .catch(error => console.error('Error fetching data:', error));
    
}

function full_screen_button(svgId){
    // let toc_container = document.querySelector("#toc-container");
    // let button = document.createElement("button");
    // // <button style="margin-bottom: 5px; font-size: large;" class="btn btn-info fa fa-arrows-alt btn-block" id="top-button"> Full Screen</button>
    // button.setAttribute("style", "margin-botton: 5px; font-size: large");
    // button.setAttribute("id", "top-button");
    // button.setAttribute('class', `btn btn-info fa fa-arrows-alt btn-block`);
    // toc_container.prepend(button);
    // button.innerHTML = "Full Screen";
    if (thisInstance.instance_full_screen_button != "yes"){
        return;
    }

    if ((document.fullscreenEnabled || document.webkitFullscreenEnabled)){ 
        let toc_container = document.querySelector("#toc-container");
        let button = document.createElement("button");
        
        // Button attributes
        button.setAttribute("style", "margin-bottom: 5px; font-size: large; z-index: 1");
        button.setAttribute("id", "top-button");
        button.setAttribute('class', 'btn btn-info btn-block');
        button.innerHTML = "Full Screen";
        
        // let row = document.createElement("div");
        let row = document.createElement("div");

        row.classList.add("row");
        row.setAttribute("id", "buttonRow");
        // let col = document.createElement("div");
        // col.classList.add("col");
        // col.appendChild(button);
        row.appendChild(button);

        toc_container.prepend(row);
        
        // Fullscreen change event for SVG
        var webkitElem = document.getElementById(svgId);
        webkitElem.addEventListener('webkitfullscreenchange', (event) => {
          if (document.webkitFullscreenElement) {
            webkitElem.style.width = (window.innerWidth) + 'px';
            webkitElem.style.height = (window.innerHeight) + 'px';
          } else {
            webkitElem.style.width = width;
            webkitElem.style.height = height;
          }
        });
        
        
        // Open Fullscreen Function
        function openFullScreen() {
          var elem = document.getElementById(svgId);
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
          }
          let modal = document.getElementById("myModal");
            elem.prepend(modal);
        }

        

        
        // Button click event
        button.addEventListener('click', function() {
          openFullScreen();
          // add_modal(); // Ensure add_modal() is defined and functional
        });
        
    }

}

function toggle_text() {
    if (thisInstance.instance_text_toggle === "none") {
        return;
    }

    let toc_container = document.querySelector("#toc-container");

    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-info btn-block"); // w-100 makes the button full width
    button.setAttribute("id", "toggleButton");
    button.setAttribute("style", "margin-bottom: 5px; font-size: large; z-index: 1;");

    let initialState = thisInstance.instance_text_toggle === "toggle_on";
    let svgText = document.querySelector("#text");
    button.innerHTML = initialState ? "Hide Image Text" : "Show Image Text";

    if (initialState) {
        svgText.setAttribute("display", "none");
    } else {
        svgText.setAttribute("display", "");
    }

    let row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("id", "buttonRow");

    // let col = document.createElement("div");
    // col.classList.add("col");
    // col.appendChild(button);

    row.appendChild(button);
    toc_container.append(row);

    button.addEventListener('click', function() {
        if (svgText.getAttribute("display") === "none") {
            svgText.setAttribute("display", "");
            button.innerHTML = "Hide Image Text";
        } else {
            svgText.setAttribute("display", "none");
            button.innerHTML = "Show Image Text";
        }
    });
}

//should create sections and pertinent collapsible, implemented as accordion
function sectioned_list(){
    let sections = [];
    for (let key in child_obj) {
        let section = child_obj[key]['section_name'];
        if (!sections.includes(section)) {
            sections.push(section);
        }
        sectionObj[key] = section;
    }
    sections.sort();
    console.log(sectionObj);

    let toc_container = document.querySelector("#toc-container");
    let toc_group = document.createElement("div");
    // toc_group.classList.add("accordion");
    toc_group.setAttribute("id", "toc-group");
    let colorIdx = 0;

    for (let i = 0; i < sections.length; i++) {
        // if (sections[i] == "None"){
        //     continue;
        // }
        sectColors[sections[i]] = colors[colorIdx]; 
        colorIdx = (colorIdx + 1) % colors.length;


        let sect = document.createElement("div");
        // sect.classList.add("accordion-item");

        let heading = document.createElement("h5");
        // heading.classList.add("accordion-header");
        heading.setAttribute("id", `heading${i}`);
        // if (sections[i] != "None"){
        //     heading.innerHTML = sections[i];
        // }
        heading.setAttribute("style", `color: ${sectColors[sections[i]]}`);

        sect.appendChild(heading);

        let tocCollapse = document.createElement("div");

        let tocbody = document.createElement("div");
        // tocbody.classList.add("accordion-body");

        let sectlist = document.createElement("ul");
        sectlist.setAttribute("id", sections[i]);
        sectlist.setAttribute("style", `color: ${sectColors[sections[i]]}`);
        tocbody.appendChild(sectlist);
        tocCollapse.appendChild(tocbody);

        sect.appendChild(tocCollapse);
        toc_group.appendChild(sect);
    }
    toc_container.appendChild(toc_group);
    console.log(sectColors);
}


function toc_sections() {
    let sections = [];
    for (let key in child_obj) {
        let section = child_obj[key]['section_name'];
        if (!sections.includes(section)) {
            sections.push(section);
        }
        sectionObj[key] = section;
    }
    sections.sort();
    console.log(sectionObj);

    let toc_container = document.querySelector("#toc-container");
    let toc_group = document.createElement("div");
    toc_group.classList.add("accordion");
    toc_group.setAttribute("id", "toc-group");
    let colorIdx = 0;

    for (let i = 0; i < sections.length; i++) {
        // if (sections[i] == "None"){
        //     continue;
        // }
        sectColors[sections[i]] = colors[colorIdx]; 
        colorIdx = (colorIdx + 1) % colors.length;


        let sect = document.createElement("div");
        sect.classList.add("accordion-item");

        let heading = document.createElement("h2");
        heading.classList.add("accordion-header");
        heading.setAttribute("id", `heading${i}`);

        let button = document.createElement("button");
        // button.classList.add("accordion-button");
        button.classList.add("accordion-button", "collapsed");
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#toccollapse${i}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `toccollapse${i}`);
        if (sections[i]!="None"){
            button.innerHTML = sections[i];
        } else {
            button.innerHTML = "Table of Contents";
        }
        

        let arrowSpan = document.createElement("span");
        arrowSpan.classList.add("arrow");
        button.appendChild(arrowSpan);

        heading.appendChild(button);
        sect.appendChild(heading);

        let tocCollapse = document.createElement("div");
        tocCollapse.setAttribute("id", `toccollapse${i}`);
        tocCollapse.classList.add("accordion-collapse", "collapse");
        tocCollapse.setAttribute("aria-labelledby", `heading${i}`);
        // tocCollapse.setAttribute("data-bs-parent", "#toc-group");

        let tocbody = document.createElement("div");
        tocbody.classList.add("accordion-body");

        let sectlist = document.createElement("ul");
        sectlist.setAttribute("id", sections[i]);
        tocbody.appendChild(sectlist);
        tocCollapse.appendChild(tocbody);

        sect.appendChild(tocCollapse);
        toc_group.appendChild(sect);
    }
    toc_container.appendChild(toc_group);
    console.log(sectColors);
}
// toc_sections();
//generates table of contents; modal table of contents open modal window, others go to external URLs
//can either be: "accordion", "list", or "sectioned_list"
function table_of_contents(){
    // toc_sections();
    // sectioned_list();
    // console.log(thisInstance);
    if (thisInstance.instance_toc_style == "accordion"){
        toc_sections();
    } else {
        sectioned_list();
    }               
    // let elem = document.getElementById("toc1");
    // let elem = document.createElement("ul")
    for (let key in child_obj){
        // document.querySelector("#Section\\ 1")
        let elem = document.getElementById(child_obj[key]['section_name']);
        let item = document.createElement("li");
        
        let title = child_obj[key]['title'];  
        let link = document.createElement("a");
        link.setAttribute("id", title.replace(/\s+/g, '_'));

        let modal = child_obj[key]['modal'];
        if (modal) {
            link.setAttribute("href", '#'); //just added
            link.classList.add("modal-link"); 
            link.innerHTML = title;
            item.appendChild(link);
            
            item.addEventListener('click', function() {
                
                let modal = document.getElementById("myModal");
                modal.style.display = "block";
                render_modal(key);
            });

            let closeButton = document.getElementById("close");
            closeButton.addEventListener('click', function() {
                    
                // modal.style.display = "none";
                let accordion_container = document.getElementById('accordion-container');
                accordion_container.innerHTML = '';

                let tagline_container = document.getElementById('tagline-container');
                tagline_container.innerHTML = '';
                history.pushState("", document.title, window.location.pathname + window.location.search);
        });
        window.onclick = function(event) {
            if (event.target === modal) { // Check if the click is outside the modal content
                // modal.style.display = "none";
                document.getElementById('accordion-container').innerHTML = '';
                document.getElementById('tagline-container').innerHTML = '';
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }
        };
        }
        
        else{
            link.href = child_obj[key]['external_url'];
            // console.log(link.href);
            link.innerHTML = title;
            item.appendChild(link);
        }
        let svg_elem = document.querySelector('g[id="' + key + '"]');
        // console.log(elem);
        //CHANGE HERE FOR TABLET STUFF

        item.addEventListener('mouseover', function(){
            // console.log('mousing over: ', key); 
            // svg_elem.style.stroke = "yellow";
            // svg_elem.style.stroke = thisInstance.instance_hover_color;
            // console.log(sectionObj);
            // console.log(sectColors);
            if (thisInstance.instance_colored_sections === "yes"){
                svg_elem.style.stroke = sectColors[sectionObj[key]];
            } else{
                svg_elem.style.stroke = colors[0];
            }
            
            svg_elem.style.strokeWidth = "3";
        });
        item.addEventListener('mouseout', function(){
            // console.log('mousing out: ', key); 
            svg_elem.style.stroke = "";
            svg_elem.style.strokeWidth = "";
        });
        
        
        elem.appendChild(item);
        // console.log(elem);
        // return elem;
    }
        
    
}

function list_toc(){
    let sections = [];
    for (let key in child_obj) {
        let section = child_obj[key]['section_name'];
        if (!sections.includes(section)) {
            sections.push(section);
        }
        sectionObj[key] = section;
    }
    sections.sort();

    let toc_container = document.querySelector("#toc-container");
    let toc_group = document.createElement("ul");
    let colorIdx = 0;
    let i = 0;
    for (let key in child_obj) {
        // let elem = document.getElementById(child_obj[key]['section_name']);
        sectColors[sections[i]] = colors[colorIdx]; 
        colorIdx = (colorIdx + 1) % colors.length;
        i++;

        let item = document.createElement("li");
    
        let title = child_obj[key]['title'];  
        let link = document.createElement("a");
        let modal = child_obj[key]['modal'];
    
        if (modal) {
            link.setAttribute("href", '#'); //just added
            link.setAttribute("id", title.replace(/\s+/g, '_'));
          
            // link.setAttribute("role", "button");

            link.classList.add("modal-link");
            link.innerHTML = title;
            item.appendChild(link);
    
            item.addEventListener('click', function() {
                let modal = document.getElementById("myModal");
                modal.style.display = "block";
                render_modal(key);
            });
    
            let closeButton = document.getElementById("close");
            closeButton.addEventListener('click', function() {
                let modal = document.getElementById("myModal");
                // link.setAttribute("href", ''); //just added

                modal.style.display = "none";
                history.pushState("", document.title, window.location.pathname + window.location.search);
            });
            window.onclick = function(event) {
                if (event.target === modal) { 
                    // link.setAttribute("href", ''); //just added
                    modal.style.display = "none";
                    history.pushState("", document.title, window.location.pathname + window.location.search);

                }
            };
        } else {
            link.href = child_obj[key]['external_url'];
            link.innerHTML = title;
            item.appendChild(link);
        }
    
        let svg_elem = document.querySelector('g[id="' + key + '"]');
    
        item.addEventListener('mouseover', function() {
            // svg_elem.style.stroke = thisInstance.instance_hover_color;
            // svg_elem.style.stroke = sectColors[sectionObj[key]];
            if (thisInstance.instance_colored_sections === "yes"){
                svg_elem.style.stroke = sectColors[sectionObj[key]];
            } else{
                svg_elem.style.stroke = colors[0];
            }

            svg_elem.style.strokeWidth = "3";
        });
    
        item.addEventListener('mouseout', function() {
            svg_elem.style.stroke = "";
            svg_elem.style.strokeWidth = "";
        });
    
        toc_group.appendChild(item);
    }
    toc_container.appendChild(toc_group);
}


//generates modal window when SVG element is clicked. 
function add_modal(){
    for (let key in child_obj){
        let elem = document.querySelector('g[id="' + key + '"]');
        if (child_obj[key]['modal']){
            // let elem = document.querySelector('g[id="' + key + '"]');
            let modal = document.getElementById("myModal");
            let closeButton = document.getElementById("close");
            
            // elem.addEventListener('click', function() {
            //         modal.style.display = "block";
            //         render_modal(key );

            // });
            
            if (mobileBool){
                let itemContainer = document.querySelector(`#${key}-container`);
                itemContainer.addEventListener('click', function() {
                    modal.style.display = "block";
                    render_modal(key );

            });
            } else {
                elem.addEventListener('click', function() {
                    modal.style.display = "block";
                    render_modal(key );

            });
            }
            
            closeButton.addEventListener('click', function() {
                    
                    modal.style.display = "none";
                    let accordion_container = document.getElementById('accordion-container');
                    accordion_container.innerHTML = '';

                    let tagline_container = document.getElementById('tagline-container');
                    tagline_container.innerHTML = '';


                    let myTab = document.getElementById('myTab');
                    myTab.innerHTML = '';

                    let tabContentContainer = document.getElementById("myTabContent");
                    tabContentContainer.innerHTML = '';
                    history.pushState("", document.title, window.location.pathname + window.location.search);
            });
            window.onclick = function(event) {
                if (event.target === modal) { // Check if the click is outside the modal content
                    modal.style.display = "none";
                    document.getElementById('accordion-container').innerHTML = '';
                    document.getElementById('tagline-container').innerHTML = '';
                    document.getElementById('myTab').innerHTML = '';
                    document.getElementById('myTabContent').innerHTML = '';
                    history.pushState("", document.title, window.location.pathname + window.location.search);
                }
            };
    
        } else {
            elem.addEventListener('click', function() {
                let link =  child_obj[key]['external_url'];
                window.location.href = link;

        });
        if (mobileBool){
            let itemContainer = document.querySelector(`#${key}-container`);
            itemContainer.addEventListener('click', function() {
                let link =  child_obj[key]['external_url'];
                window.location.href = link;

        });
        // let modalDialog = document.querySelector("#myModal > div");
        // modalDialog.setAttribute("style", "z-index: 9999;/* margin: 10% auto; */margin-top: 65%;max-width: 90%;margin-left: 17px;");
        }
        }
    }
}






// loadSVG(url, "svg1");

async function handleHashNavigation() {
    if (window.location.hash) {
        let tabId = window.location.hash.substring(1);
        console.log(tabId);

        let modalName = tabId.split('/')[0];
        console.log(modalName);

        tabId = tabId.replace(/\//g, '-');

        history.pushState("", document.title, window.location.pathname + window.location.search);

        await new Promise(resolve => setTimeout(resolve, 200));


        // let modalButton = document.querySelector("#toc-container > ul > li:nth-child(2) > a");
        let modalButton = document.querySelector(`#${modalName}`);

        console.log(modalButton);

        if (modalButton) {
            modalButton.click();

            await new Promise(resolve => setTimeout(resolve, 200));

            let tabButton = document.querySelector(`#${tabId}`);
            console.log(tabButton);
            if (tabButton) {
                tabButton.click();
            }
        }
    } else {
        console.log("nope");
    }
}






async function load_instance_details() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const fetchURL = `${protocol}//${host}/wp-json/wp/v2/instance?&order=asc`;
  
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function init() {
    try {
        testData = await load_instance_details();
        console.log("here is the global variable");
        console.log(testData);
        // hover_color = "red";
        // console.log(hover_color);
        sceneLoc = await make_title();
        console.log("scene location is ");
        console.log(sceneLoc);

        thisInstance = testData.find(data => data.id === Number(sceneLoc));
        console.log(thisInstance);
        colors = thisInstance.instance_hover_color.split(',');
        // console.log(colors[0]);
        // console.log(colors);
        
        loadSVG(url, "svg1"); // Call load_svg with the fetched data

    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init(); 
    handleHashNavigation();

});

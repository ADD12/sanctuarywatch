console.log("THIS IS A TEST");
// console.log(child_ids);
// access echoed JSON here for use. 
//get all links from single-scene.php
let child_obj = JSON.parse(JSON.stringify(child_ids));
console.log(child_obj);
// console.log("this is the post id: ", post_id);//prob dont need this
let url1 =(JSON.stringify(svg_url));
url = url1.substring(2, url1.length - 2);
// console.log(url)

//lol
// document.getElementById("svg1").innerHTML =`<img src="${url}" alt="">`;


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

        // Step 2: Parse the SVG content
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Step 3: Move the SVG upwards
        // const translateY = -10; // Adjust this value to move the image up
        // const existingTransform = svgElement.getAttribute("transform") || "";
        // const newTransform = `translate(0, ${translateY}) ${existingTransform}`;
        // svgElement.setAttribute("transform", newTransform.trim());

        // Step 4: Append the SVG to the DOM
        const container = document.getElementById(containerId);
        container.appendChild(svgElement);
        // console.log(svgElement);
        highlight_icons();
        table_of_contents();
        add_modal();
    } catch (error) {
        console.error('Error fetching or parsing the SVG:', error);
    }
}

//TODO: lot of redundant code within below 3 functions, a working start; might be a good idea to clean up at some point


//highlight items on mouseover, remove highlight when off; 
function highlight_icons(){
    for (let key in child_obj){
        let elem = document.querySelector('g[id="' + key + '"]');
        console.log(elem);
        elem.addEventListener('mouseover', function(){
            // console.log('mousing over: ', key); 
            elem.style.stroke = "yellow";
            elem.style.strokeWidth = "6";
        });
        elem.addEventListener('mouseout', function(){
            // console.log('mousing out: ', key); 
            elem.style.stroke = "";
            elem.style.strokeWidth = "";
        });
    }  
}
 
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
    accordionButton.classList.add('accordion-button');
    accordionButton.setAttribute("type", "button");
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", `#${collapseId}`);
    accordionButton.setAttribute("aria-expanded", "true");
    accordionButton.setAttribute("aria-controls", collapseId);
    accordionButton.innerHTML = buttonText;

    // Append Button to Header
    accordionHeader.appendChild(accordionButton);

    // Create Accordion Collapse
    let accordionCollapse = document.createElement('div');
    accordionCollapse.classList.add("accordion-collapse", "collapse", "show");
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

let allkeys = Object.keys(child_obj);
console.log(allkeys);
let allkeyobj = {};
allkeys.forEach(key => {
    allkeyobj[key] = false;
});

console.log(allkeyobj);


function render_modal(key){
    // fetch data from JSON
    // if (allkeyobj[key]){
    //     return;
    // }
    console.log(allkeyobj);
    let id = child_obj[key]['modal_id'];
    let fetchURL = 'http://sanctuary.local/wp-json/wp/v2/modal?&order=asc';
    fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
            modal_data = data.find(modal => modal.id === id);
            console.log(modal_data); 
            //title stuff:
            let title = child_obj[key]['title'];  
            let modal_title = document.getElementById("modal-title");
            
            modal_title.innerHTML = title;

            //tagline container
            let tagline_container = document.getElementById('tagline-container');
            let modal_tagline = modal_data["modal_tagline"];
            tagline_container.innerHTML =  "<em>" + modal_tagline + "<em>";

            //generate accordion
            // Select the container where the accordion will be appended
            let accordion_container = document.getElementById('accordion-container');
            // accordion_container.innerHTML = '';
            // Create the accordion element
            let acc = document.createElement("div");
            acc.classList.add("accordion");

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
                console.log(modal_info_text);
                console.log(modal_info_url);
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
                console.log(modal_info_text);
                console.log(modal_info_url);
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
            
            



        })
    .catch(error => console.error('Error fetching data:', error));
    
}


//generates table of contents; modal table of contents open modal window, others go to external URLs
function table_of_contents(){
    let elem = document.getElementById("toc1");
    for (let key in child_obj){
        let item = document.createElement("li");
        
        let title = child_obj[key]['title'];  
        let link = document.createElement("a");
        let modal = child_obj[key]['modal'];
        if (modal) {
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
                    
                modal.style.display = "none";
                let accordion_container = document.getElementById('accordion-container');
                accordion_container.innerHTML = '';

                let tagline_container = document.getElementById('tagline-container');
                tagline_container.innerHTML = '';

        });
        }
        
        else{
            link.href = child_obj[key]['external_url'];
            link.innerHTML = title;
            item.appendChild(link);
        }
        let svg_elem = document.querySelector('g[id="' + key + '"]');
        // console.log(elem);
        item.addEventListener('mouseover', function(){
            // console.log('mousing over: ', key); 
            svg_elem.style.stroke = "yellow";
            svg_elem.style.strokeWidth = "6";
        });
        item.addEventListener('mouseout', function(){
            // console.log('mousing out: ', key); 
            svg_elem.style.stroke = "";
            svg_elem.style.strokeWidth = "";
        });
        
        
        elem.appendChild(item);
        console.log(elem);
    }
        
    
}


//generates modal window when SVG element is clicked. 
function add_modal(){
    for (let key in child_obj){
        if (child_obj[key]['modal']){
            let elem = document.querySelector('g[id="' + key + '"]');
            let modal = document.getElementById("myModal");
            let closeButton = document.getElementById("close");
            

            elem.addEventListener('click', function() {
                    modal.style.display = "block";
                    render_modal(key )

            });
            
            closeButton.addEventListener('click', function() {
                    
                    modal.style.display = "none";
                    let accordion_container = document.getElementById('accordion-container');
                    accordion_container.innerHTML = '';

                    let tagline_container = document.getElementById('tagline-container');
                    tagline_container.innerHTML = '';

            });
        }
    }
}







loadSVG(url, "svg1");








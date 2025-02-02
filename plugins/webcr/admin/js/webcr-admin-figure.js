// These functions only fire upon editing or creating a post of Scene custom content type
(function( $ ) {
    'use strict';

    displayCorrectImageField ();

    function figureInstanceChange(){
        const protocol = window.location.protocol;
        const host = window.location.host;
        const figureInstance = document.getElementsByName("location")[0].value;
        const restScene = protocol + "//" + host  + "/wp-json/wp/v2/scene?_fields=id,title&orderby=title&order=asc&scene_location="+figureInstance;

        fetch(restScene)
        .then(response => response.json())
        .then(data => {
            let figureScene = document.getElementsByName("figure_scene")[0];
            figureScene.value ="";
            figureScene.innerHTML ="";
            let optionScene1 = document.createElement('option');
            optionScene1.text = "Scenes";
            optionScene1.value = "";
            figureScene.add(optionScene1);
        
            data.forEach(targetRow => {
                    let optionScene = document.createElement('option');
                    optionScene.value = targetRow['id'];
                    optionScene.text = targetRow['title']['rendered'];
                    figureScene.appendChild(optionScene);
            });

            let figureModal = document.getElementsByName("figure_modal")[0];
            figureModal.value ="";
            figureModal.innerHTML ="";
            let optionModal = document.createElement('option');
            optionModal.text = "Icons";
            optionModal.value = "";
            figureModal.add(optionModal);

            let figureTab = document.getElementsByName("figure_tab")[0];
            figureTab.value ="";
            figureTab.innerHTML ="";
            let optionTab = document.createElement('option');
            optionTab.text = "Tabs";
            optionTab.value = "";
            figureTab.add(optionTab);
        })
        .catch((err) => {console.error(err)});
    }

    // reset icons on scene change
    function figureSceneChange(){
        const protocol = window.location.protocol;
        const host = window.location.host;
        const figureScene = document.getElementsByName("figure_scene")[0].value;

        //FIX: the REST API for modal is retrieving all records even when icon_function and modal_scene are set for some reason 
        // CHECK - THIS IS FIXED I THINK?
        const restModal = protocol + "//" + host  + "/wp-json/wp/v2/modal?_fields=id,title,modal_scene,icon_function&orderby=title&order=asc";
        fetch(restModal)
        .then(response => response.json())
        .then(data => {
            let figureModal = document.getElementsByName("figure_modal")[0];
            figureModal.value ="";
            figureModal.innerHTML ="";
            let optionIcon1 = document.createElement('option');
            optionIcon1.text = "Icons";
            optionIcon1.value = "";
            figureModal.add(optionIcon1);
        
            data.forEach(targetRow => {
                if (targetRow['icon_function']=="Modal" && targetRow['modal_scene']==figureScene ){

                    let optionIcon = document.createElement('option');
                    optionIcon.value = targetRow['id'];
                    optionIcon.text = targetRow['title']['rendered'];
                    figureModal.appendChild(optionIcon);
                }
            });
            let figureTab = document.getElementsByName("figure_tab")[0];
            figureTab.value ="";
            figureTab.innerHTML ="";
            let optionTab = document.createElement('option');
            optionTab.text = "Tabs";
            optionTab.value = "";
            figureTab.add(optionTab);
        })
        .catch((err) => {console.error(err)});
    }

    // reset tabs on icon change
    function figureIconChange(){

        const figureModal = document.getElementsByName("figure_modal")[0].value;
        
        const protocol = window.location.protocol;
        const host = window.location.host;

        const restModal = protocol + "//" + host  + "/wp-json/wp/v2/modal/" + figureModal;

        fetch(restModal)
            .then(response => response.json())
            .then(data => {

                let figureTab = document.getElementsByName("figure_tab")[0];
                figureTab.value ="";
                figureTab.innerHTML ="";
                let optionTab = document.createElement('option');
                optionTab.text = "Tabs";
                optionTab.value = "";
                figureTab.add(optionTab);
            
                if (figureModal != ""){
                    let targetField ="";
                    for (let i = 1; i < 7; i++){
                        targetField = "modal_tab_title" + i;
                        if (data[targetField]!= ""){
                            let optionTitleTab = document.createElement('option');
                            optionTitleTab.text = data[targetField];
                            optionTitleTab.value = data[targetField];
                            figureTab.appendChild(optionTitleTab);
                        }
                    }
                }

            })
            .catch((err) => {console.error(err)});

    }


    // Should the image be an external URL or an internal URL? Show the relevant fields either way
    function displayCorrectImageField () {
        const imageType = document.getElementsByName("figure_path")[0].value;
        // Select the container with data-depend-id="figure_image"
        let figureImageContainer = document.querySelector('[data-depend-id="figure_image"]');

        // Select the nested container with class "exopite-sof-image-preview"
        let imagePreviewContainer = figureImageContainer.querySelector('.exopite-sof-image-preview');
        // Select the img tag within the class "exopite-sof-image-preview"
        let imagePreviewImg = imagePreviewContainer.querySelector('img');

        let figureJsonContainer = document.querySelector('[data-depend-id="figure_json"]');

        // Select the nested container with class "exopite-sof-image-preview"
        let jsonPreviewContainer = figureJsonContainer.querySelector('.exopite-sof-image-preview');
        // Select the img tag within the class "exopite-sof-image-preview"
        let jsonPreviewImg = jsonPreviewContainer.querySelector('img');


        switch (imageType) {
            case "Internal":
                document.getElementsByName("figure_json")[0].parentElement.parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_json")[0].value = "";

                document.getElementsByName("figure_external_alt")[0].parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_external_alt")[0].value = "";

                // Add the "hidden" class to the nested container
                jsonPreviewContainer.classList.add('hidden');
                jsonPreviewImg.src ="";

                document.getElementsByName("figure_image")[0].parentElement.parentElement.parentElement.style.display = "block";
                document.getElementsByName("figure_external_url")[0].parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_external_url")[0].value = "";

                document.getElementsByName("figure_json_arguments")[0].parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_json_arguments")[0].value = "";

                // Add the "hidden" class to the nested container
                if (imagePreviewImg.src.includes("uploads")) {
                    imagePreviewContainer.classList.remove('hidden');
                }
                break;
            case "External":
                document.getElementsByName("figure_json")[0].parentElement.parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_json")[0].value = "";

                document.getElementsByName("figure_external_alt")[0].parentElement.parentElement.style.display = "block";

                // Add the "hidden" class to the nested container
                jsonPreviewContainer.classList.add('hidden');
                jsonPreviewImg.src ="";

                document.getElementsByName("figure_image")[0].parentElement.parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_image")[0].value = "";

                // Add the "hidden" class to the nested container
                imagePreviewContainer.classList.add('hidden');
                imagePreviewImg.src ="";

                document.getElementsByName("figure_json_arguments")[0].parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_json_arguments")[0].value = "";

                document.getElementsByName("figure_external_url")[0].parentElement.parentElement.style.display = "block";
                break;         
            case "Interactive":   
                document.getElementsByName("figure_json")[0].parentElement.parentElement.parentElement.style.display = "block";
                // Add the "hidden" class to the nested container
                if (jsonPreviewImg.src.includes("uploads")) {
                    jsonPreviewContainer.classList.remove('hidden');
                }

                document.getElementsByName("figure_external_alt")[0].parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_external_alt")[0].value = "";

                document.getElementsByName("figure_image")[0].parentElement.parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_image")[0].value = "";
                document.getElementsByName("figure_external_url")[0].parentElement.parentElement.style.display = "none";
                document.getElementsByName("figure_external_url")[0].value = "";
                // Add the "hidden" class to the nested container
                if (imagePreviewImg.src.includes("uploads")) {
                    imagePreviewContainer.classList.remove('hidden');
                }
                document.getElementsByName("figure_json_arguments")[0].parentElement.parentElement.style.display = "block";

                break; 
        } 
    }

    $( "select[name='figure_path']" ).change(displayCorrectImageField);
    $( "select[name='figure_modal']" ).change(figureIconChange);
    $( "select[name='figure_scene']" ).change(figureSceneChange);
    $( "select[name='location']" ).change(figureInstanceChange);

    
    $('.figure_preview').click(function(){
        // Let's remove the preview window if it already exists
        var previewWindow = document.getElementById('preview_window');
        // If the element exists
        if (previewWindow) {
            // Remove the scene window
            previewWindow.parentNode.removeChild(previewWindow);
        }

    // Find element
    const firstFigurePreview = document.querySelector('.figure_preview');

    // Find the second parent element
    const secondParent = firstFigurePreview.parentElement.parentElement;

    // Create a new div element
    let newDiv = document.createElement('div');
    newDiv.id = "preview_window";
    newDiv.classList.add("container", "figure_preview");

    const scienceUrl = document.getElementsByName("figure_science_info[figure_science_link_url]")[0].value;
    const dataUrl = document.getElementsByName("figure_data_info[figure_data_link_url]")[0].value;

    let txtOutput;
    if (scienceUrl !="" || dataUrl != ""){
        let firstRow = document.createElement("div");
        firstRow.classList.add("grayFigureRow");


        if (scienceUrl !=""){
            let scienceA = document.createElement("a");
            scienceA.classList.add("grayFigureRowLinks");
            scienceA.href = document.getElementsByName("figure_science_info[figure_science_link_url]")[0].value;
            scienceA.target="_blank";
            let dataIcon = document.createElement("i");
            dataIcon.classList.add("fa-solid", "fa-clipboard-list", "grayFigureRowIcon");
            let urlText = document.createElement("span");
            urlText.classList.add("grayFigureRowText");
            urlText.innerHTML = document.getElementsByName("figure_science_info[figure_science_link_text]")[0].value;
            scienceA.appendChild(dataIcon);
            scienceA.appendChild(urlText);
            firstRow.appendChild(scienceA);
           // firstRow.appendChild(urlText);
        }

        if (dataUrl !=""){
            let dataA = document.createElement("a");
            dataA.classList.add("grayFigureRowLinks");//, "grayFigureRowRightLink");
            dataA.href = document.getElementsByName("figure_data_info[figure_data_link_url]")[0].value;
            dataA.target="_blank";
            let dataIcon = document.createElement("i");
            dataIcon.classList.add("fa-solid", "fa-database", "grayFigureRowIcon");
            let urlText = document.createElement("span");
            urlText.classList.add("grayFigureRowText");
            urlText.innerHTML = document.getElementsByName("figure_data_info[figure_data_link_text]")[0].value;
            dataA.appendChild(dataIcon);
            dataA.appendChild(urlText);
            firstRow.appendChild(dataA);
           // firstRow.appendChild(urlText);
        }

        newDiv.appendChild(firstRow);
    } 

    let imageRow = document.createElement("div");
    imageRow.classList.add("imageRow");
    let figureImage = document.createElement("img");
    figureImage.classList.add("figureImage");

    const figurePath = document.getElementsByName("figure_path")[0].value;
    let figureSrc;
    if (figurePath == "Internal"){
        figureSrc = document.getElementsByName("figure_image")[0].value;
        if (figureSrc != ""){
        figureImage.src = figureSrc;
        } else {imageRow.textContent = "No figure image."}
    } else {
        figureSrc = document.getElementsByName("figure_external_url")[0].value;
        if (figureSrc != ""){
        figureImage.src = figureSrc;
        } else {imageRow.textContent = "No figure image."}
    }

    const containerWidth = document.querySelector('[data-depend-id="figure_preview"]').parentElement.parentElement.parentElement.clientWidth;

    if (containerWidth < 800){
        figureImage.style.width = (containerWidth-88) + "px";
    }
    imageRow.appendChild(figureImage);
    newDiv.appendChild(imageRow);

    let captionRow = document.createElement("div");
    captionRow.classList.add("captionRow");

    // Step 1: Access the iframe element
    let iframeShort = document.getElementById('figure_caption_short_ifr');

    // Step 2: Get the document inside the iframe
    const iframeShortDocument = iframeShort.contentDocument || iframeShort.contentWindow.document;
  
    // Step 3: Select the <body> element with the specified data-id attribute
    const bodyElementShort = iframeShortDocument.querySelector('body[data-id="figure_caption_short"]');
  
    // Step 4: Retrieve and store its contents
    let shortCaption = bodyElementShort ? bodyElementShort.innerHTML : null;
    //let shortCaption = document.getElementById("figure_caption_short").value;
   // if (shortCaption == ""){
   //     shortCaption = "No short caption";
   // }

    // Step 1: Access the iframe element
    let iframeLong = document.getElementById('figure_caption_long_ifr');

    // Step 2: Get the document inside the iframe
    const iframeLongDocument = iframeLong.contentDocument || iframeLong.contentWindow.document;
  
    // Step 3: Select the <body> element with the specified data-id attribute
    const bodyElementLong = iframeLongDocument.querySelector('body[data-id="figure_caption_long"]');
  
    // Step 4: Retrieve and store its contents
    let longCaption = bodyElementLong ? bodyElementLong.innerHTML : null;
   
 //   let longCaption = document.getElementById("figure_caption_long").value;
 //   if (longCaption == ""){
 //       longCaption = "No long caption";
 //   }

    let shortCaptionElementContent = document.createElement("p");
    shortCaptionElementContent.innerHTML = shortCaption;
    shortCaptionElementContent.classList.add("captionOptions");
    captionRow.appendChild(shortCaptionElementContent);
    let longCaptionElement = document.createElement("details");
   // longCaptionElement.classList.add("captionOptions");
    let longCaptionElementSummary = document.createElement("summary");
    longCaptionElementSummary.textContent = "Click here for more details.";
    let longCaptionElementContent = document.createElement("p");
    longCaptionElementContent.classList.add("captionOptions");
    longCaptionElementContent.innerHTML = longCaption;
    longCaptionElement.appendChild(longCaptionElementSummary);
    longCaptionElement.appendChild(longCaptionElementContent);
    captionRow.appendChild(longCaptionElement);
    newDiv.appendChild(captionRow);

    secondParent.appendChild(newDiv);


     });

// Claude code for json functionality
$('#select-json-btn').on('click', function(e) {
    e.preventDefault();
    
    // Create file input
    var fileInput = $('<input type="file" accept=".json" style="display: none;">');
    $('body').append(fileInput);
    
    fileInput.trigger('click');
    
    fileInput.on('change', function() {
        var file = this.files[0];
        if (!file) return;
        
        // Validate file size (optional, adjust limit as needed)
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size too large. Please select a file under 5MB.');
            fileInput.remove();
            return;
        }
        
        var formData = new FormData();
        formData.append('action', 'figure_json_upload');
        formData.append('nonce', figureJsonUploader.nonce);
        formData.append('json_file', file);
        
        // Show loading state
        $('#select-json-btn').prop('disabled', true).text('Uploading...');
        
        $.ajax({
            url: figureJsonUploader.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    $('#figure_json_path').val(response.data.file_path);
                    
                    // Add clear button if it doesn't exist
                    if ($('#clear-json-btn').length === 0) {
                        $('<button type="button" class="button" id="clear-json-btn">Clear</button>')
                            .insertAfter('#select-json-btn');
                    }
                } else {
                    alert('Upload failed: ' + response.data);
                }
            },
            error: function() {
                alert('Upload failed. Please try again.');
            },
            complete: function() {
                $('#select-json-btn').prop('disabled', false).text('Select JSON');
                fileInput.remove();
            }
        });
    });
});

// Handle clear button click
$(document).on('click', '#clear-json-btn', function(e) {
    e.preventDefault();
    $('#figure_json_path').val('');
    $(this).remove();
});
    
})( jQuery );
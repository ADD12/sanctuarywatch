// These functions only fire upon editing or creating a post of Scene custom content type
(function( $ ) {
	'use strict';

	let opening_scene_info_entries = $(".range[data-depend-id='scene_info_entries']").val();
	displayEntries(opening_scene_info_entries, ".text-class[data-depend-id='scene_info_");
	let opening_scene_photo_entries = $(".range[data-depend-id='scene_photo_entries']").val();
	displayEntries(opening_scene_photo_entries, ".text-class[data-depend-id='scene_photo_");	

	function displayEntries (entry_number, string_prefix){
		for (let $i = 6; $i > entry_number; $i--){
			let $target_text = string_prefix + "text" + $i + "']";
			let $target_url = string_prefix + "url" + $i + "']";
			$($target_text).parents().eq(6).css("display", "none");
			$($target_text).val(function(){return  "";});
			$($target_url).val(function(){return  "";});
		}

		for (let $i = 1; $i <= entry_number; $i++){
			let $target = string_prefix + "text" + $i + "']";
			$($target).parents().eq(6).css("display", "block");
		}
	}

	$(".range[data-depend-id='scene_info_entries']").change(function(){ 
		let number_of_scene_info_entries = $(".range[data-depend-id='scene_info_entries']").val();
		displayEntries(number_of_scene_info_entries, ".text-class[data-depend-id='scene_info_");
	});

	$(".range[data-depend-id='scene_photo_entries']").change(function(){ 
		let number_of_scene_info_entries = $(".range[data-depend-id='scene_photo_entries']").val();
		displayEntries(number_of_scene_info_entries, ".text-class[data-depend-id='scene_photo_");
	});

	$('.scene_preview').click(function(){ alert("Hello"); });

	const OnSceneEditPage = document.getElementsByName("scene_tagline").length; //determining if we are on a page where we are editing a scene
	const SceneError = getCookie("scene_post_status");

	if (OnSceneEditPage === 1 && SceneError === "post_error") {
		let SceneFields = JSON.parse(getCookie("scene_error_all_fields"));
		console.log(SceneFields);
		SceneFields.forEach((element) => {
			if (element === null){
				element ="";
			}
		});	
		console.log(SceneFields);
		const SceneFieldNames =["scene_location", "scene_infographic", "scene_tagline", "scene_info_entries", "scene_photo_entries"];
		SceneFields["scene_tagline"] = SceneFields["scene_tagline"].replace("\\'","\'");

		SceneFieldNames.forEach((element) => document.getElementsByName(element)[0].value = SceneFields[element]);

		document.getElementsByName("scene_info_entries")[0].parentElement.childNodes[1].value = SceneFields["scene_info_entries"];
		displayEntries(SceneFields["scene_info_entries"], ".text-class[data-depend-id='scene_info_");

		document.getElementsByName("scene_photo_entries")[0].parentElement.childNodes[1].value = SceneFields["scene_photo_entries"];
		displayEntries(SceneFields["scene_photo_entries"], ".text-class[data-depend-id='photo_info_");

		let elementName;
		let secondElementName;
		const fieldClass = ["info"]//, "photo"];
		for (let i = 1; i < 2; i++){
			fieldClass.forEach((array_value) => {
				elementName = "scene_" + array_value + i + "[scene_" + array_value + "_url" + i + "]";
				secondElementName = "scene_" + array_value + "_url" + i;
				console.log(elementName + " " + secondElementName);
				console.log(document.getElementsByName(elementName)[0].value + " " + SceneFields[secondElementName]);
				document.getElementsByName(elementName)[0].value = SceneFields[secondElementName];
				elementName = "scene_" + array_value + i + "[scene_" + array_value + "_text" + i + "]";
				secondElementName = "scene_" + array_value + "_text" + i;
				console.log(elementName + " " + secondElementName);
				console.log(document.getElementsByName(elementName)[0].value + " " + SceneFields[secondElementName]);
				document.getElementsByName(elementName)[0].value = SceneFields[secondElementName];
			});
		}

	


	//	<input type="text" name="scene_info2[scene_info_text2]" value="" class="text-class" data-depend-id="scene_info_text2"></input>
//<input type="text" name="scene_info2[scene_info_url2]" value="" class="text-class" data-depend-id="scene_info_url2"></input>

	//	console.log(document.getElementsByName("scene_info_entries")[0].value);
	//	for (const Field of SceneFieldNames){
	//		document.getElementsByName(Field)[0].value = SceneFields[Field];
//		}
	//	$scene_fields['scene_location'] = $_POST['scene_location'];
    //    $scene_fields['scene_infographic'] = $_POST['scene_infographic'];
    //    $scene_fields['scene_tagline'] = $_POST['scene_tagline'];
    //    $scene_fields['scene_info_link'] = $_POST['scene_info_link'];
    //    $scene_fields['scene_info_photo_link'] = $_POST['scene_info_photo_link'];


	//	console.log(SceneFields["scene_info_photo_link"]);	
	//	consoleMessage = "on scene edit page";
	}
    // console.log(consoleMessage);
//	console.log(document.cookie);
//	console.log(getCookie("scene_post_status"));

	function getCookie(cookieName) {
		let cookies = document.cookie;
		let cookieArray = cookies.split("; ");
	 
		for (let i = 0; i < cookieArray.length; i++) {
		   let cookie = cookieArray[i];
		   let [name, value] = cookie.split("=");
		  
		   if (name === cookieName) {
			  return decodeURIComponent(value);
		   }
		}
		
		return null;
	 }


	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

})( jQuery );

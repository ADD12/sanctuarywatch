<?php
/**
 * Detailed Scene Page Template
 *
 * This template file is designed for displaying detailed pages of the 'scene' post type within a WordPress theme. 
 * It dynamically loads and presents various content elements such as scene information, photos, and infographics 
 * based on associated post metadata. The template handles the presentation logic including conditional rendering 
 * of content sections and integrates Bootstrap components for styling. Key functionalities include:
 *
 * - **Header and Footer**: Incorporates the common header and footer across the site using `get_header()` and `get_footer()`.
 * - **Post Identification**: Retrieves the current post ID with `get_the_ID()` to fetch associated metadata.
 * - **Metadata Retrieval**: Uses a custom function `get_scene_info_photo()` to obtain arrays of text and URLs for 
 *   scene information and photos, which are then passed to another function for rendering as accordion components.
 * - **Conditional Layouts**: Depending on the availability of scene information or photos, the layout adjusts to 
 *   display these elements appropriately. If both information types are available, they are displayed side-by-side;
 *   otherwise, the tagline or main content takes more visual precedence.
 * - **Dynamic Content Rendering**: Content sections for scene information and photos are rendered using the 
 *   `generateAccordionSection()` function which creates Bootstrap accordions dynamically. Additionally, any 
 *   available infographic is displayed as an image.
 * - **Styling and Structure**: Inline styles are used temporarily for layout control, intended to be moved to 
 *   an external CSS file for better maintainability and performance.
 *
 * This template is critical for providing a detailed and interactive view of individual scenes, facilitating 
 * better user engagement and content discovery through well-structured and dynamic data presentation.
 */

defined( 'ABSPATH' ) || exit;

get_header();

//ALL CURRENTLY ASSUME THERE IS POSTMETA AND THERE IS ALL SUFFICIENT INFORMATION
//IMPLEMENT ERROR CHECKS LATER


// Retrieves the ID of the current post
$post_id = get_the_ID();

// Fetches scene information and photos based on the current post ID
//array structure(triple nested arrays): arr = [[text1, url1],[text2, url2], ....]
$total_arr = get_scene_info_photo($post_id);
$scene_info_arr = $total_arr[0];
$scene_photo_arr = $total_arr[1];
?>
<div class="container-fluid main-container">
    <div>
        <!-- Displays the title of the current post -->
        <h1 class="title toc-ignore"><?php echo get_the_title( $post_id ) ?></h1>
    </div>
    <p></p>
    <!-- Temporary Following bootstrap styling, will move to css file later -->
    <div style="display: flex">
        <!-- Accordion section begins -->
        <?php 
            // If the scene info array is not empty, or if its not empty and the scene title is not overview, create the accordion
            if((!empty($scene_info_arr) || !empty($scene_photo_arr)) && $scene_title != 'Overview') : 
        ?> 
            <div style="margin-top: 10px;margin-bottom: 10px; margin-right: 10px; flex: 1;">
                <div class="accordion" id="sceneAccordions">
                    <?php
                    // Function calls to generate accordion sections for scene information and photos
                        generateAccordionSection('Scene Info', $scene_info_arr);
                        generateAccordionSection('Scene Photo', $scene_photo_arr);
                    ?>
                </div>
            </div>
            <div style="margin: 10px; font-style: italic; flex: 20; ">
        <?php else: ?>
            <!-- If no accordion is needed, adjust the container flex sizing -->
            <div style="flex: 20; ">
        <?php endif; 
        // Displays the tagline fetched from post meta
            echo get_post_meta($post_id, "scene_tagline")[0];
        ?>
            </div>
    </div>
    <div class="svg">
    <?php
        // Fetches and displays an SVG graphic if available
        $svg_url = get_post_meta($post_id, 'scene_infographic', true);
        if (!empty($svg_url)) {
            echo '<img src="' . esc_url($svg_url) . '" alt="Description of SVG">';
        }
        if($svg_url){
            //NEED TO CALL THE DOM CLASS
            $relative_path = ltrim(parse_url($svg_url)['path'], "/");

            //Call to undefined function get_home_path()
            $full_path = ABSPATH . $relative_path;

            $svg_content = file_get_contents($full_path);

            if(!$svg_content){
                die("Fail to load SVG file");
            }
            $dom  = new DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadXML($svg_content);
            libxml_clear_errors();

            $xpath = new DOMXPath($dom);

            $icons_element = $xpath->query('//*[@id="icons"]')->item(0);

            if($icons_element === null){
                die('Element with ID "icons" not found');
            }

            $child_elements = $icons_element->childNodes;

            $child_ids = array();
            foreach($child_elements as $child){
                if($child->nodeType === XML_ELEMENT_NODE && $child->hasAttribute('id')) {
                    $child_ids[] = $child->getAttribute('id');
                }
            }

            asort($child_ids);
            /*
            json file structure:
            name:
            title:
            post-id:
            function: 
                modal:
                link:
                    scene:
                    external:
            
            notes: external should open a new page
            */ 
            for ($i = 0; $i < count($child_ids); $i++){
                $query = new WP_Query(postQuery($child_ids[$i]));
                if($query->have_posts()){
                    $child_post_id = $query->posts[0];
                    $post = get_post($child_post_id);
                    $icon_type = get_post_meta($child_post_id, "icon_function");
                    $icon_title = get_post_meta($child_post_id, "post_title");
                    $modal = "";
                    $scene_url = "";
                    $external_url = "";
                    if($icon_type[0] === "External URL"){
                        $external_url = get_post_meta( $child_post_id, "icon_external_url");
                    }
                    if($icon_type[0] === "Scene"){
                        $scene_id = get_post_meta( $child_post_id, "icon_scene_out");
                        $scene_url = get_permalink($scene_id[0]);
                    }
                    //TODO
                    if($icon_type[0] === "Modal"){
                        $modal = "Modal TODO";
                    }
                    $child_ids[$i] = ["name" => $child_ids[$i], 
                                      "title" => $icon_title[0],
                                      "post_id" => $child_post_id,
                                      "icon_function" => [
                                        "modal" => $modal,
                                        "link"  => [
                                            "scene" => $scene_url,
                                            "external" => $external_url[0]
                                        ]
                                      ]
                                    ];
                }
            }
            wp_reset_postdata();
        }
        function postQuery($icon_name){
            $args = array(
                'post_type' => 'any', 
                'meta_query' => array(
                    array(
                        'key'     => 'modal_icons',
                        'value'   => $icon_name,
                        'compare' => '='
                    )
                ),
                'fields' => 'ids' 
            );
            return $args;
        }
    ?>
    </div>
</div>
<?php
get_footer();
?>
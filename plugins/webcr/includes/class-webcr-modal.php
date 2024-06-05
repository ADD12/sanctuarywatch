<?php
/**
 * Register class that defines the Modal custom content type as well as associated Modal functions temp
 * 
 */
class Webcr_Modal {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

    /**
	 * Create Modal custom content type.
	 *
	 * @since    1.0.0
	 */
    function custom_content_type_modal() {
        $labels = array(
            'name'                  => _x( 'Modals', 'Post type general name', 'textdomain' ),
            'singular_name'         => _x( 'Modal', 'Post type singular name', 'textdomain' ),
            'menu_name'             => _x( 'Modals', 'Admin Menu text', 'textdomain' ),
            'name_admin_bar'        => _x( 'Modal', 'Add New on Toolbar', 'textdomain' ),
            'add_new'               => __( 'Add New Modal', 'textdomain' ),
            'add_new_item'          => __( 'Add New Modal', 'textdomain' ),
            'new_item'              => __( 'New Modal', 'textdomain' ),
            'edit_item'             => __( 'Edit Modal', 'textdomain' ),
            'view_item'             => __( 'View Modal', 'textdomain' ),
            'all_items'             => __( 'All Modals', 'textdomain' ),
            'search_items'          => __( 'Search Modals', 'textdomain' ),
            'parent_item_colon'     => __( 'Parent Modals:', 'textdomain' ),
            'not_found'             => __( 'No Modals found.', 'textdomain' ),
            'not_found_in_trash'    => __( 'No Modals found in Trash.', 'textdomain' ),
            'featured_image'        => _x( 'Modal Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain' ),
            'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
            'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
            'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
            'archives'              => _x( 'Modal archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'textdomain' ),
            'insert_into_item'      => _x( 'Insert into Modal', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'textdomain' ),
            'uploaded_to_this_item' => _x( 'Uploaded to this Modal', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'textdomain' ),
            'filter_items_list'     => _x( 'Filter Modals list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'textdomain' ),
            'items_list_navigation' => _x( 'Modals list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'textdomain' ),
            'items_list'            => _x( 'Modals list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'textdomain' ),
        );
    
        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array( 'slug' => 'modals' ),
            'capability_type'    => 'post',
            'menu_icon'          => 'dashicons-category',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array( 'title', 'revisions' ),
        );
    
        register_post_type( 'modal', $args );
    }

    /**
	 * Create custom fields, using metaboxes, for Modal custom content type.
	 *
	 * @since    1.0.0
	 */
    public function create_modal_fields() {

        $config_metabox = array(

            /*
             * METABOX
             */
            'type'              => 'metabox',                       // Required, menu or metabox
            'id'                => $this->plugin_name,              // Required, meta box id, unique, for saving meta: id[field-id]
            'post_types'        => array( 'modal' ),                 // Post types to display meta box
            'context'           => 'advanced',                      // 	The context within the screen where the boxes should display: 'normal', 'side', and 'advanced'.
            'priority'          => 'default',                       // 	The priority within the context where the boxes should show ('high', 'low').
            'title'             => 'Modal Fields',                  // The title of the metabox
            'capability'        => 'edit_posts',                    // The capability needed to view the page
            'tabbed'            => true,
            'options'           => 'simple',                        // Only for metabox, options is stored az induvidual meta key, value pair.
        );

        // get list of locations, which is saved as a taxonomy
        $locations_array = get_terms(array('taxonomy' => 'location', 'hide_empty' => false));
        $locations=[];
        foreach ( $locations_array as $locations_row ){
            $locations[$locations_row -> name] = $locations_row -> name;
        }

        // used by both scene and icon dropdowns
        if (array_key_exists("post", $_GET)) {
            $modal_id = intval($_GET["post"]);
            $scene_id = intval(get_post_meta($modal_id, "modal_scene", true));
        }

        $scene_titles =[];
        $scene_titles[""] = "Modal Scene";
        if (array_key_exists("post", $_GET)) {
            $scene_location = get_post_meta($modal_id, "modal_location", true);
            $scene_name = get_post_meta($scene_id, "post_title", true);
            $scenes[$scene_id] = $scene_name;

            $args = array(
                'post_type' => 'scene',  // Your custom post type
                'meta_query' => array(
                    array(
                        'key' => 'scene_location',      // The custom field key
                        'value' => $scene_location, // The value you are searching for
                        'compare' => '='         // Comparison operator
                    )
                ),
                'fields' => 'ids'            // Only return post IDs
            );
            
            // Execute the query
            $query = new WP_Query($args);
            
            // Get the array of post IDs
            $scene_post_ids = $query->posts;

            $scene_titles =[];
            foreach ($scene_post_ids as $target_id){
                $target_title = get_post_meta($target_id, "post_title", true);
                $scene_titles[$target_id] = $target_title;
            }
            asort($scene_titles);
            $tempo= 1+1;
        }

        $modal_icons = array(" " => "Modal Icons");
        if (array_key_exists("post", $_GET)) {
            $scene_infographic = get_post_meta($scene_id, "scene_infographic", true);
            if ($scene_infographic == true){
                $relative_path =  ltrim(parse_url($scene_infographic)['path'], "/");

                $full_path = get_home_path() . $relative_path;

                $svg_content = file_get_contents($full_path);

                if ($svg_content === false) {
                    die("Failed to load SVG file.");
                }
                
                // Create a new DOMDocument instance and load the SVG content 828 242 5661
                $dom = new DOMDocument();
                libxml_use_internal_errors(true); // Suppress errors related to invalid XML
                $dom->loadXML($svg_content);
                libxml_clear_errors();
                
                // Create a new DOMXPath instance
                $xpath = new DOMXPath($dom);
                
                // Find the element with the ID "icons"
                $icons_element = $xpath->query('//*[@id="icons"]')->item(0);
                
                if ($icons_element === null) {
                    die('Element with ID "icons" not found.');
                }
                
                // Get all child elements of the "icons" element
                $child_elements = $icons_element->childNodes;
                
                // Initialize an array to hold the IDs
                $child_ids = array();
                
                // Loop through the child elements and extract their IDs
                foreach ($child_elements as $child) {
                    if ($child->nodeType === XML_ELEMENT_NODE && $child->hasAttribute('id')) {
                        $child_ids[] = $child->getAttribute('id');
                    }
                }
                asort($child_ids);
            //    $modal_icons = array();
                foreach ($child_ids as $single_icon){
                    $modal_icons[$single_icon] = $single_icon;
                }

            }
        }

        $fields[] = array(
            'name'   => 'basic',
            'title'  => 'Basic',
            'icon'   => 'dashicons-admin-generic',
            'fields' => array(

                array(
                    'id'             => 'modal_location',
                    'type'           => 'select',
                    'title'          => 'Instance',
                    'options'        => $locations,
                    'default_option' => 'Modal Instance',
                    'description' => 'Modal Instance description',
                     'default'     => ' ',
                     'class'      => 'chosen', 
                ),
                array(
                    'id'             => 'modal_scene',
                    'type'           => 'select',
                    'title'          => 'Scene',
                    'options'        => $scene_titles,
//                    'options'        => array ("" => "Modal Scene", 58 => "Deep Seafloor", 45 => "Tempo 55"), 
                    'description' => 'Modal Scene description',
                ),
                array(
                    'id'             => 'modal_icons',
                    'type'           => 'select',
                    'title'          => 'Icons',
                    'options'        => $modal_icons, // array (" " => "Modal Icons")
                    'description' => 'Modal Icons description',
                ),
                array(
                    'id'             => 'icon_function',
                    'type'           => 'select',
                    'title'          => 'Icon Function',
                    'options'        => array("External URL" => "External URL", "Modal" => "Modal", "Scene" => "Scene"),
                    'description' => 'Icon Function description',
                    'default'     => 'Modal',
                     'class'      => 'chosen', 
                ),
                array(
                    'id'          => 'icon_external_url',
                    'type'        => 'text',
                    'title'       => 'Icon External URL',
                     'class'       => 'text-class',   
                     'description' => 'Icon External URL Description',  
                ),
                array(
                    'id'             => 'icon_scene_out',
                    'type'           => 'select',
                    'title'          => 'Icon Scene Out',
                    'options'        => array ("" => "Icon Scene Out"), 
                    'description' => 'Icon Scene Out description',
                ),

                array(
                    'id'          => 'modal_tagline',
                    'type'        => 'textarea',
                    'title'       => 'Modal Tagline',
                    'description' => 'Modal Tagline description',
                ),
                array(
                    'id'      => 'modal_info_entries',
                    'type'    => 'range',
                    'title'   => 'Number of Modal Info Entries',
                    'description' => 'Number of Modal Info Entries description',
                    'min'     => 0,    
                     'default' => 1,    
                     'max'     => 6,         
                     'step'    => 1,             
                ),              
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_info1',
                    'title'   => 'Modal Info Link 1',
                    'description' => 'Modal Info Link 1 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_info_text1',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_info_url1',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_info2',
                    'title'   => 'Modal Info Link 2',
                    'description' => 'Modal Info Link 2 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_info_text2',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_info_url2',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_info3',
                    'title'   => 'Modal Info Link 3',
                    'description' => 'Modal Info Link 3 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_info_text3',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_info_url3',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_info4',
                    'title'   => 'Modal Info Link 4',
                    'description' => 'Modal Info Link 4 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_info_text4',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_info_url4',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_info5',
                    'title'   => 'Modal Info Link 5',
                    'description' => 'Modal Info Link 5 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_info_text5',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_info_url5',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),

                array(
                    'type' => 'fieldset',
                    'id' => 'modal_info6',
                    'title'   => 'Modal Info Link 6',
                    'description' => 'Modal Info Link 6 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_info_text6',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_info_url6',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),

                array(
                    'id'      => 'modal_photo_entries',
                    'type'    => 'range',
                    'title'   => 'Number of Modal Photo Entries',
                    'description' => 'Number of Modal Photo Entries description',
                    'min'     => 0,    
                     'default' => 1,    
                     'max'     => 6,         
                     'step'    => 1,             
                ),              
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_photo1',
                    'title'   => 'Modal Photo Link 1',
                    'description' => 'Modal Photo 1 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_photo_text1',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_photo_url1',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_photo2',
                    'title'   => 'Modal Photo Link 2',
                    'description' => 'Modal Photo Link 2 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_photo_text2',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_photo_url2',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_photo3',
                    'title'   => 'Modal Photo Link 3',
                    'description' => 'Modal Photo Link 3 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_photo_text3',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_photo_url3',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_photo4',
                    'title'   => 'Modal Photo Link 4',
                    'description' => 'Modal Photo Link 4 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_photo_text4',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_photo_url4',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),
                array(
                    'type' => 'fieldset',
                    'id' => 'modal_photo5',
                    'title'   => 'Modal Photo Link 5',
                    'description' => 'Modal Photo Link 5 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_photo_text5',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_photo_url5',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),

                array(
                    'type' => 'fieldset',
                    'id' => 'modal_photo6',
                    'title'   => 'Modal Photo Link 6',
                    'description' => 'Modal Photo Link 6 description',
                    'fields' => array(
                        array(
                            'id'          => 'modal_photo_text6',
                            'type'        => 'text',
                            'title'       => 'Text',
                            'class'       => 'text-class',
                        ),
                        array(
                            'id'          => 'modal_photo_url6',
                            'type'        => 'text',
                            'title'       => 'URL',
                            'class'       => 'text-class',
                        ),
                    ),
                ),

                array(
                    'id'      => 'modal_tab_number',
                    'type'    => 'range',
                    'title'   => 'Number of Modal Tabs',
                    'description' => 'Number of Modal Tabs description',
                    'min'     => 0,    
                     'default' => 1,    
                     'max'     => 6,         
                     'step'    => 1,             
                ),              
                array(
                    'id'          => 'modal_tab_title1',
                    'type'        => 'text',
                    'title'       => 'Modal Tab Title 1',
                     'class'       => 'text-class',   
                     'description' => 'Modal Tab Title 1 Description',  
                ),
                array(
                    'id'          => 'modal_tab_title2',
                    'type'        => 'text',
                    'title'       => 'Modal Tab Title 2',
                     'class'       => 'text-class',   
                     'description' => 'Modal Tab Title 2 Description',  
                ),
                array(
                    'id'          => 'modal_tab_title3',
                    'type'        => 'text',
                    'title'       => 'Modal Tab Title 3',
                     'class'       => 'text-class',   
                     'description' => 'Modal Tab Title 3 Description',  
                ),
                array(
                    'id'          => 'modal_tab_title4',
                    'type'        => 'text',
                    'title'       => 'Modal Tab Title 4',
                     'class'       => 'text-class',   
                     'description' => 'Modal Tab Title 4 Description',  
                ),                
                array(
                    'id'          => 'modal_tab_title5',
                    'type'        => 'text',
                    'title'       => 'Modal Tab Title 5',
                     'class'       => 'text-class',   
                     'description' => 'Modal Tab Title 5 Description',  
                ),                
                array(
                    'id'          => 'modal_tab_title6',
                    'type'        => 'text',
                    'title'       => 'Modal Tab Title 6',
                     'class'       => 'text-class',   
                     'description' => 'Modal Tab Title 6 Description',  
                ),
                array(
                    'id'          => 'modal_preview',
                    'type'        => 'button',
                    'title'       => 'Preview Modal',
                    'class'        => 'modal_preview',
                    'options'     => array(
                        'href'  =>  '#nowhere',
                        'target' => '_self',
                        'value' => 'Preview',
                        'btn-class' => 'exopite-sof-btn'
                    ),
                ),
            )
        );

        // instantiate the admin page
        $options_panel = new Exopite_Simple_Options_Framework( $config_metabox, $fields );

    }

    /**
	 * Set columns in admin screen for Modal custom content type.
	 *
     * @link https://www.smashingmagazine.com/2017/12/customizing-admin-columns-wordpress/
	 * @since    1.0.0
	 */
    function change_modal_columns( $columns ) {
        $columns = array (
            //'cb' => $columns['cb'],
            'title' => 'Title',
            'modal_location' => 'Instance',
            'scene' => 'Scene',		
            'scene_icon' => 'Scene Icon',	
            'icon_function' => 'Function',		
            'scene_tagline' => 'Tagline',			
            'scene_info_link' => 'Info Link #',		
            'scene_info_photo_link' => 'Photo Link #',
            'tab_number' => 'Tab #',	
            'status' => 'Status',
        );
        return $columns;
    }

    /**
	 * Populate custom fields for Modal content type in the admin screen.
	 *
     * @param string $column The name of the column.
     * @param int $post_id The database id of the post.
	 * @since    1.0.0
	 */
    public function custom_modal_column( $column, $post_id ) {  


        // maybe knock this next section out
        if (isset($_GET["field_length"])) {
            $field_length = $_GET["field_length"];
        } else {
            $field_length = "large";
        }

        if ( $column === 'modal_location' ) {
            echo get_post_meta( $post_id, 'modal_location', true ); 
        }


 //       if ($column == 'scene_tagline'){
 //           $scene_tagline = get_post_meta( $post_id, 'scene_tagline', true );
 //           switch ($field_length){
 //               case "large":
 //                   echo $scene_tagline;
   //                 break;
     //           case "medium":
       //             echo $this->stringTruncate($scene_tagline, 75);
         //           break;
           //     case "small":
             //       if ($scene_tagline != NULL){
               //         echo '<span class="dashicons dashicons-yes"></span>';
                 //   }
                   // break;
    //        }
      //  }

        if ($column == 'modal_info_photo_link'){
            $url_count = 0;
            for ($i = 1; $i < 7; $i++){
                $search_fieldset = "modal_photo" . $i;
                $search_field = "modal_photo_url" . $i;
                $database_value = get_post_meta( $post_id, $search_fieldset, true )[$search_field]; 
                if ($database_value != ""){
                    $url_count++;
                }
            }
            echo $url_count; 

        }

        if ($column == 'modal_info_link'){

            $url_count = 0;
            for ($i = 1; $i < 7; $i++){
                $search_fieldset = "modal_info" . $i;
                $search_field = "modal_info_url" . $i;
                $database_value = get_post_meta( $post_id, $search_fieldset, true )[$search_field]; 
                if ($database_value != ""){
                    $url_count++;
                }
            }
            echo $url_count; 

        }


        if ($column === "status"){
            date_default_timezone_set('America/Los_Angeles'); 
            $last_modified_time = get_post_modified_time('g:i A', false, $post_id, true);
            $last_modified_date = get_post_modified_time('F j, Y', false, $post_id, true);
            $last_modified_user_id = get_post_field('post_author', $post_id);
            $last_modified_user = get_userdata($last_modified_user_id);
            $last_modified_name = $last_modified_user -> first_name . " " . $last_modified_user -> last_name; 

            echo "Last updated at " . $last_modified_time . " Pacific Time on " . $last_modified_date . " by " . $last_modified_name;
        }
    }


    public function modal_admin_notice() {
        // First let's determine where we are. We only want to show admin notices in the right places. Namely in one of our custom 
        // posts after it has been updated. The if statement is looking for three things: 1. Scene post type? 2. An individual post (as opposed to the scene
        // admin screen)? 3. A new post?
        $current_screen = get_current_screen();
        if ($current_screen->base == "post" && $current_screen->id =="modal" && !($current_screen->action =="add") ) { 
            if( isset( $_COOKIE["modal_post_status"] ) ) {
                $modal_post_status =  $_COOKIE["modal_post_status"];
                if ($modal_post_status == "post_good") {
                    echo '<div class="notice notice-info is-dismissible"><p>Modal created or updated.</p></div>';
                } 
                else {
                    if (isset($_COOKIE["modal_errors"])) {
                        $error_message = "<p>Error or errors in modal</p>";
                        $error_list_coded = stripslashes($_COOKIE["modal_errors"]);
                        $error_list_array = json_decode($error_list_coded);
                        $error_array_length = count($error_list_array);
                        $error_message = $error_message . '<p><ul>';
                        for ($i = 0; $i < $error_array_length; $i++){
                            $error_message = $error_message . '<li>' . $error_list_array[$i] . '</li>';
                        }
                        $error_message = $error_message . '</ul></p>';
                    }
                    echo '<div class="notice notice-error is-dismissible">' . $error_message . '</div>'; 

                    if (isset($_COOKIE["modal_error_all_fields"])) {
                        $modal_fields_coded = stripslashes($_COOKIE["modal_error_all_fields"]);
                        $modal_fields_array = json_decode($modal_fields_coded, true);	
                        $_POST['modal_location'] = $modal_fields_array['modal_location'];
                        $_POST['modal_scene'] = $modal_fields_array['modal_scene'];
                        $_POST['modal_icons'] = $modal_fields_array['modal_icons'];
                        $_POST['icon_function'] = $modal_fields_array['icon_function'];
                        $_POST['icon_external_url'] = $modal_fields_array['icon_external_url'];
                        $_POST['icon_scene_out'] = $modal_fields_array['icon_scene_out'];
                        $_POST['modal_tagline'] = $modal_fields_array['modal_tagline'];
                        $_POST['modal_info_entries'] = $modal_fields_array['modal_info_entries'];
                        $_POST['modal_photo_entries'] = $modal_fields_array['modal_photo_entries'];
                        $_POST['modal_tab_number'] = $modal_fields_array['modal_tab_number'];


                    }
                }
             //   setcookie("scene_post_status", "", time() - 300, "/");
            }
            if (isset($_COOKIE["modal_warnings"])){
                $warning_message = "<p>Warning or warnings in modal</p>";
                $warning_list_coded = stripslashes($_COOKIE["modal_warnings"]);
                $warning_list_array = json_decode($warning_list_coded);
                $warning_array_length = count($warning_list_array);
                $warning_message = $warning_message . '<p><ul>';
                for ($i = 0; $i < $warning_array_length; $i++){
                    $warning_message = $warning_message . '<li>' . $warning_list_array[$i] . '</li>';
                }
                $warning_message = $warning_message . '</ul></p>';
                echo '<div class="notice notice-warning is-dismissible">' . $warning_message . '</div>'; 
            }
        }
    }


}

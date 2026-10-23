<?php
/**
 * Opportunities: internships, jobs and project briefs, added under Opportunities in the dashboard.
 * Published openings appear on the Opportunities pages. An opening disappears by itself after its "Apply by" date.
 */

defined( 'ABSPATH' ) || exit;

function dgt_register_types() {
	register_post_type( 'dgt_opening', array(
		'labels'          => array(
			'name'          => 'Opportunities',
			'singular_name' => 'Opening',
			'add_new'       => 'Add opening',
			'add_new_item'  => 'Add an opening',
			'edit_item'     => 'Edit opening',
			'all_items'     => 'All openings',
			'not_found'     => 'No openings yet.',
		),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'menu_position'   => 21,
		'menu_icon'       => 'dashicons-megaphone',
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'map_meta_cap'    => true,
	) );
	register_post_type( 'dgt_enquiry', array(
		'labels'          => array(
			'name'          => 'Enquiries',
			'singular_name' => 'Enquiry',
			'edit_item'     => 'Enquiry',
			'all_items'     => 'All enquiries',
			'not_found'     => 'No enquiries yet.',
			'search_items'  => 'Search enquiries',
		),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'menu_position'   => 22,
		'menu_icon'       => 'dashicons-email-alt',
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap'    => true,
	) );
}
add_action( 'init', 'dgt_register_types' );

function dgt_opening_fields() {
	return array(
		'type'             => array( 'Type', 'select', array( 'internship' => 'Internship', 'job' => 'Job', 'project' => 'Project brief' ) ),
		'company'          => array( 'Company', 'text' ),
		'location'         => array( 'City', 'text', null, 'A city, or Remote.' ),
		'country'          => array( 'Country', 'text', null, 'Leave as India for openings in India. Any other country lists the opening under Abroad.' ),
		'mode'             => array( 'Work mode', 'select', array( 'On-site' => 'On-site', 'Remote' => 'Remote', 'Hybrid' => 'Hybrid' ) ),
		'domain'           => array( 'Field', 'select', array( 'it' => 'IT & Digital', 'engineering' => 'Engineering & Industrial', 'business' => 'Business & Management', 'healthcare' => 'Healthcare & Nursing' ) ),
		'duration'         => array( 'Duration', 'text', null, 'For internships and projects, for example 3 months.' ),
		'pay'              => array( 'Pay', 'text', null, 'For example: Stipend ₹10,000 a month, Unpaid, or a salary range.' ),
		'closes'           => array( 'Apply by', 'date', null, 'Optional. The opening is hidden after this date.' ),
		'summary'          => array( 'Summary', 'textarea', null, 'One or two sentences shown on the listing card.' ),
		'responsibilities' => array( 'What they will do', 'textarea', null, 'One point per line.' ),
		'requirements'     => array( 'What they need', 'textarea', null, 'One point per line.' ),
		'about'            => array( 'About the company', 'textarea' ),
	);
}

add_action( 'add_meta_boxes_dgt_opening', function () {
	add_meta_box( 'dgt_opening_details', 'Details', function ( $post ) {
		wp_nonce_field( 'dgt_opening', 'dgt_opening_nonce' );
		echo '<table class="form-table" role="presentation"><tbody>';
		foreach ( dgt_opening_fields() as $key => $f ) {
			$value = get_post_meta( $post->ID, '_dgt_' . $key, true );
			if ( '' === $value && 'country' === $key ) {
				$value = 'India';
			}
			$id = 'dgt-' . $key;
			echo '<tr><th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $f[0] ) . '</label></th><td>';
			if ( 'select' === $f[1] ) {
				echo '<select id="' . esc_attr( $id ) . '" name="dgt[' . esc_attr( $key ) . ']">';
				foreach ( $f[2] as $v => $label ) {
					echo '<option value="' . esc_attr( $v ) . '"' . selected( $value, $v, false ) . '>' . esc_html( $label ) . '</option>';
				}
				echo '</select>';
			} elseif ( 'textarea' === $f[1] ) {
				echo '<textarea class="large-text" rows="4" id="' . esc_attr( $id ) . '" name="dgt[' . esc_attr( $key ) . ']">' . esc_textarea( $value ) . '</textarea>';
			} else {
				echo '<input class="regular-text" type="' . esc_attr( $f[1] ) . '" id="' . esc_attr( $id ) . '" name="dgt[' . esc_attr( $key ) . ']" value="' . esc_attr( $value ) . '">';
			}
			if ( ! empty( $f[3] ) ) {
				echo '<p class="description">' . esc_html( $f[3] ) . '</p>';
			}
			echo '</td></tr>';
		}
		echo '</tbody></table>';
	}, 'dgt_opening', 'normal', 'high' );
} );

add_action( 'save_post_dgt_opening', function ( $post_id ) {
	if ( ! isset( $_POST['dgt_opening_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dgt_opening_nonce'] ) ), 'dgt_opening' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$in = isset( $_POST['dgt'] ) && is_array( $_POST['dgt'] ) ? wp_unslash( $_POST['dgt'] ) : array();
	foreach ( dgt_opening_fields() as $key => $f ) {
		$v = $in[ $key ] ?? '';
		$v = 'textarea' === $f[1] ? sanitize_textarea_field( $v ) : sanitize_text_field( $v );
		if ( 'select' === $f[1] && ! isset( $f[2][ $v ] ) ) {
			$v = array_key_first( $f[2] );
		}
		if ( 'date' === $f[1] && $v && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $v ) ) {
			$v = '';
		}
		update_post_meta( $post_id, '_dgt_' . $key, $v );
	}
} );

add_filter( 'manage_dgt_opening_posts_columns', function ( $cols ) {
	return array( 'cb' => $cols['cb'], 'title' => 'Opening', 'dgt_type' => 'Type', 'dgt_company' => 'Company', 'dgt_where' => 'Where', 'dgt_closes' => 'Apply by', 'date' => 'Date' );
} );
add_action( 'manage_dgt_opening_posts_custom_column', function ( $col, $id ) {
	$m = function ( $k ) use ( $id ) { return get_post_meta( $id, '_dgt_' . $k, true ); };
	if ( 'dgt_type' === $col ) {
		echo esc_html( dgt_opening_fields()['type'][2][ $m( 'type' ) ] ?? '' );
	} elseif ( 'dgt_company' === $col ) {
		echo esc_html( $m( 'company' ) );
	} elseif ( 'dgt_where' === $col ) {
		echo esc_html( trim( $m( 'location' ) . ', ' . $m( 'country' ), ', ' ) );
	} elseif ( 'dgt_closes' === $col ) {
		$c = $m( 'closes' );
		echo esc_html( $c ? $c : '—' );
		if ( $c && $c < current_time( 'Y-m-d' ) ) {
			echo ' <em>(closed)</em>';
		}
	}
}, 10, 2 );

/** The published, still-open openings, in the format the site's script reads. */
function dgt_opportunities_for_site() {
	$today = current_time( 'Y-m-d' );
	$out   = array();
	$posts = get_posts( array( 'post_type' => 'dgt_opening', 'post_status' => 'publish', 'numberposts' => 200, 'orderby' => 'date', 'order' => 'DESC' ) );
	foreach ( $posts as $p ) {
		$m = function ( $k ) use ( $p ) { return (string) get_post_meta( $p->ID, '_dgt_' . $k, true ); };
		if ( $m( 'closes' ) && $m( 'closes' ) < $today ) {
			continue;
		}
		$lines = function ( $text ) { return array_values( array_filter( array_map( 'trim', preg_split( '/\r?\n/', $text ) ) ) ); };
		$out[] = array_filter( array(
			'id'               => $p->post_name ? $p->post_name : 'opening-' . $p->ID,
			'type'             => $m( 'type' ) ? $m( 'type' ) : 'job',
			'title'            => get_the_title( $p ),
			'company'          => $m( 'company' ),
			'location'         => $m( 'location' ),
			'country'          => $m( 'country' ),
			'mode'             => $m( 'mode' ),
			'domain'           => $m( 'domain' ),
			'duration'         => $m( 'duration' ),
			'pay'              => $m( 'pay' ),
			'posted'           => get_the_date( 'Y-m-d', $p ),
			'closes'           => $m( 'closes' ),
			'summary'          => $m( 'summary' ),
			'responsibilities' => $lines( $m( 'responsibilities' ) ),
			'requirements'     => $lines( $m( 'requirements' ) ),
			'about'            => $m( 'about' ),
		) );
	}
	return $out;
}

// Openings are not public pages of their own, but each needs a stable id for its link; make sure a draft gets a slug.
add_filter( 'wp_insert_post_data', function ( $data ) {
	if ( 'dgt_opening' === $data['post_type'] && empty( $data['post_name'] ) && ! empty( $data['post_title'] ) && 'auto-draft' !== $data['post_status'] ) {
		$data['post_name'] = sanitize_title( $data['post_title'] );
	}
	return $data;
} );

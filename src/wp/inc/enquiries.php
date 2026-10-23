<?php
/**
 * Enquiries: the forms on the site post here. Each enquiry is saved under Enquiries in the dashboard
 * and emailed to the address in Settings > Digitaleem.
 */

defined( 'ABSPATH' ) || exit;

const DGT_FORMS = array(
	'student'     => 'Student enquiry',
	'interview'   => 'Interview prep',
	'nursing'     => 'Nursing in Germany',
	'language'    => 'Language for work',
	'college'     => 'College proposal',
	'hire'        => 'Hiring requirement',
	'workforce'   => 'Workforce training',
	'collaborate' => 'College collaboration',
	'intlhire'    => 'Nurse recruitment (employer)',
	'mentor'      => 'Mentor application',
	'apply'       => 'Application for an opening',
);

add_action( 'rest_api_init', function () {
	register_rest_route( 'digitaleem/v1', '/enquiry', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'dgt_receive_enquiry',
	) );
} );

function dgt_clean( $value, $depth = 0 ) {
	if ( is_array( $value ) && $depth < 2 ) {
		return array_slice( array_map( function ( $v ) use ( $depth ) { return dgt_clean( $v, $depth + 1 ); }, $value ), 0, 40 );
	}
	if ( is_scalar( $value ) ) {
		return mb_substr( sanitize_textarea_field( (string) $value ), 0, 3000 );
	}
	return '';
}

function dgt_receive_enquiry( WP_REST_Request $request ) {
	$data = $request->get_json_params();
	if ( ! is_array( $data ) ) {
		return new WP_Error( 'dgt_bad', 'Invalid enquiry.', array( 'status' => 400 ) );
	}
	// Bots fill the hidden field. Accept quietly and keep nothing.
	if ( ! empty( $data['_hp'] ) ) {
		return array( 'ok' => true );
	}
	$form = isset( $data['form'] ) ? sanitize_key( $data['form'] ) : '';
	if ( ! isset( DGT_FORMS[ $form ] ) ) {
		return new WP_Error( 'dgt_bad', 'Unknown form.', array( 'status' => 400 ) );
	}
	$name  = isset( $data['name'] ) ? sanitize_text_field( $data['name'] ) : '';
	$email = isset( $data['email'] ) ? sanitize_email( $data['email'] ) : '';
	$phone = isset( $data['phone'] ) ? sanitize_text_field( $data['phone'] ) : '';
	if ( ! $name || ( ! $phone && ! is_email( $email ) ) ) {
		return new WP_Error( 'dgt_bad', 'Name and a phone number or email are required.', array( 'status' => 400 ) );
	}

	// At most 10 enquiries an hour from one address.
	$ip   = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$key  = 'dgt_rl_' . md5( $ip );
	$seen = (int) get_transient( $key );
	if ( $seen >= 10 ) {
		return new WP_Error( 'dgt_slow', 'Too many enquiries. Please try again later.', array( 'status' => 429 ) );
	}
	set_transient( $key, $seen + 1, HOUR_IN_SECONDS );

	$readable = array();
	if ( isset( $data['_readable'] ) && is_array( $data['_readable'] ) ) {
		foreach ( array_slice( $data['_readable'], 0, 40 ) as $row ) {
			if ( is_array( $row ) && 2 === count( $row ) ) {
				$readable[] = array( dgt_clean( $row[0] ), dgt_clean( $row[1] ) );
			}
		}
	}
	$context = isset( $data['context'] ) ? dgt_clean( $data['context'] ) : '';
	$page    = isset( $data['page'] ) ? dgt_clean( $data['page'] ) : '';
	$label   = DGT_FORMS[ $form ];

	$raw = array();
	foreach ( $data as $k => $v ) {
		if ( '_' !== substr( (string) $k, 0, 1 ) ) {
			$raw[ sanitize_key( $k ) ] = dgt_clean( $v );
		}
	}

	$id = wp_insert_post( array(
		'post_type'   => 'dgt_enquiry',
		'post_status' => 'private',
		'post_title'  => $label . ': ' . $name,
	), true );
	if ( is_wp_error( $id ) ) {
		return new WP_Error( 'dgt_fail', 'Could not save the enquiry.', array( 'status' => 500 ) );
	}
	update_post_meta( $id, '_dgt_form', $form );
	update_post_meta( $id, '_dgt_name', $name );
	update_post_meta( $id, '_dgt_phone', $phone );
	update_post_meta( $id, '_dgt_email', $email );
	update_post_meta( $id, '_dgt_context', $context );
	update_post_meta( $id, '_dgt_page', $page );
	update_post_meta( $id, '_dgt_readable', wp_slash( wp_json_encode( $readable ) ) );
	update_post_meta( $id, '_dgt_raw', wp_slash( wp_json_encode( $raw ) ) );

	$lines = array( $label, '' );
	if ( $context ) {
		$lines[] = 'Opening: ' . $context;
	}
	foreach ( $readable as $row ) {
		$lines[] = $row[0] . ': ' . $row[1];
	}
	$lines[] = '';
	$lines[] = 'Sent from: ' . home_url( $page );
	$lines[] = 'View in WordPress: ' . admin_url( 'post.php?post=' . $id . '&action=edit' );
	$headers = array();
	if ( is_email( $email ) ) {
		$headers[] = 'Reply-To: ' . str_replace( array( "\r", "\n", '<', '>' ), '', $name ) . ' <' . $email . '>';
	}
	wp_mail( dgt_notify_email(), 'New enquiry: ' . $label . ' from ' . $name, implode( "\n", $lines ), $headers );

	return array( 'ok' => true );
}

/* ---------- Dashboard list ---------- */
add_filter( 'manage_dgt_enquiry_posts_columns', function () {
	return array( 'cb' => '<input type="checkbox">', 'title' => 'Enquiry', 'dgt_form' => 'Type', 'dgt_contact' => 'Contact', 'date' => 'Received' );
} );

add_action( 'manage_dgt_enquiry_posts_custom_column', function ( $col, $id ) {
	if ( 'dgt_form' === $col ) {
		$f = get_post_meta( $id, '_dgt_form', true );
		echo esc_html( DGT_FORMS[ $f ] ?? $f );
	}
	if ( 'dgt_contact' === $col ) {
		$phone = get_post_meta( $id, '_dgt_phone', true );
		$email = get_post_meta( $id, '_dgt_email', true );
		echo esc_html( $phone );
		if ( $email ) {
			echo '<br><a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>';
		}
	}
}, 10, 2 );

add_action( 'restrict_manage_posts', function ( $type ) {
	if ( 'dgt_enquiry' !== $type ) {
		return;
	}
	$cur = isset( $_GET['dgt_form'] ) ? sanitize_key( $_GET['dgt_form'] ) : '';
	echo '<select name="dgt_form"><option value="">All types</option>';
	foreach ( DGT_FORMS as $k => $label ) {
		echo '<option value="' . esc_attr( $k ) . '"' . selected( $cur, $k, false ) . '>' . esc_html( $label ) . '</option>';
	}
	echo '</select>';
} );

add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && 'dgt_enquiry' === $q->get( 'post_type' ) && ! empty( $_GET['dgt_form'] ) ) {
		$q->set( 'meta_key', '_dgt_form' );
		$q->set( 'meta_value', sanitize_key( $_GET['dgt_form'] ) );
	}
} );

add_action( 'add_meta_boxes_dgt_enquiry', function () {
	add_meta_box( 'dgt_enquiry_details', 'Details', function ( $post ) {
		$rows    = json_decode( (string) get_post_meta( $post->ID, '_dgt_readable', true ), true ) ?: array();
		$context = get_post_meta( $post->ID, '_dgt_context', true );
		$page    = get_post_meta( $post->ID, '_dgt_page', true );
		echo '<table class="widefat striped"><tbody>';
		if ( $context ) {
			echo '<tr><th style="width:30%">Opening</th><td>' . esc_html( $context ) . '</td></tr>';
		}
		foreach ( $rows as $r ) {
			$value = (string) $r[1];
			$cell  = preg_match( '#^https?://#', $value ) ? '<a href="' . esc_url( $value ) . '" target="_blank" rel="noopener">' . esc_html( $value ) . '</a>' : nl2br( esc_html( $value ) );
			echo '<tr><th style="width:30%">' . esc_html( $r[0] ) . '</th><td>' . $cell . '</td></tr>'; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above
		}
		if ( $page ) {
			echo '<tr><th>Sent from</th><td>' . esc_html( $page ) . '</td></tr>';
		}
		echo '</tbody></table>';
	}, 'dgt_enquiry', 'normal', 'high' );
	remove_meta_box( 'submitdiv', 'dgt_enquiry', 'side' );
	add_meta_box( 'dgt_enquiry_actions', 'Enquiry', function ( $post ) {
		echo '<p>Received ' . esc_html( get_the_date( 'j M Y, g:i a', $post ) ) . '</p>';
		echo '<p><a class="button-link-delete" href="' . esc_url( get_delete_post_link( $post->ID ) ) . '">Move to bin</a></p>';
	}, 'dgt_enquiry', 'side' );
} );

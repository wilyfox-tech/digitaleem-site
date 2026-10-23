<?php
/**
 * Settings > Digitaleem.
 */

defined( 'ABSPATH' ) || exit;

function dgt_option( $key ) {
	$options = get_option( 'dgt_settings', array() );
	$value   = isset( $options[ $key ] ) ? $options[ $key ] : '';
	if ( '' === $value && 'contact_email' === $key && ! get_option( 'dgt_settings' ) ) {
		$value = 'contact@digitaleem.co';
	}
	return $value;
}

function dgt_notify_email() {
	$email = dgt_option( 'notify_email' );
	return is_email( $email ) ? $email : get_option( 'admin_email' );
}

add_action( 'admin_init', function () {
	register_setting( 'dgt_settings', 'dgt_settings', array(
		'type'              => 'array',
		'sanitize_callback' => function ( $in ) {
			$in = is_array( $in ) ? $in : array();
			return array(
				'notify_email'  => sanitize_email( $in['notify_email'] ?? '' ),
				'contact_email' => sanitize_email( $in['contact_email'] ?? '' ),
				'contact_phone' => sanitize_text_field( $in['contact_phone'] ?? '' ),
			);
		},
	) );

	if ( isset( $_POST['dgt_update_pages'] ) && current_user_can( 'manage_options' ) ) {
		check_admin_referer( 'dgt_update_pages' );
		$r = dgt_import_pages( true );
		wp_safe_redirect( add_query_arg( array( 'page' => 'digitaleem', 'dgt_done' => $r['created'] . '-' . $r['updated'] ), admin_url( 'options-general.php' ) ) );
		exit;
	}
} );

add_action( 'admin_menu', function () {
	add_options_page( 'Digitaleem', 'Digitaleem', 'manage_options', 'digitaleem', 'dgt_settings_page' );
} );

function dgt_settings_page() {
	$o = get_option( 'dgt_settings', array() );
	?>
	<div class="wrap">
		<h1>Digitaleem</h1>
		<?php if ( isset( $_GET['dgt_done'] ) ) : list( $c, $u ) = array_map( 'intval', explode( '-', sanitize_text_field( wp_unslash( $_GET['dgt_done'] ) ) . '-0' ) ); ?>
			<div class="notice notice-success"><p><?php echo esc_html( sprintf( 'Pages updated from the theme: %d created, %d updated.', $c, $u ) ); ?></p></div>
		<?php endif; ?>
		<form method="post" action="options.php">
			<?php settings_fields( 'dgt_settings' ); ?>
			<h2>Enquiries</h2>
			<table class="form-table" role="presentation">
				<tr><th scope="row"><label for="dgt-notify">Email enquiries to</label></th>
					<td><input type="email" class="regular-text" id="dgt-notify" name="dgt_settings[notify_email]" value="<?php echo esc_attr( $o['notify_email'] ?? '' ); ?>" placeholder="<?php echo esc_attr( get_option( 'admin_email' ) ); ?>">
					<p class="description">Every enquiry is saved under Enquiries and also emailed here. Leave empty to use the site admin email.</p></td></tr>
			</table>
			<h2>Contact details shown in the footer</h2>
			<table class="form-table" role="presentation">
				<tr><th scope="row"><label for="dgt-email">Email</label></th>
					<td><input type="email" class="regular-text" id="dgt-email" name="dgt_settings[contact_email]" value="<?php echo esc_attr( dgt_option( 'contact_email' ) ); ?>"></td></tr>
				<tr><th scope="row"><label for="dgt-phone">Phone</label></th>
					<td><input type="text" class="regular-text" id="dgt-phone" name="dgt_settings[contact_phone]" value="<?php echo esc_attr( $o['contact_phone'] ?? '' ); ?>" placeholder="+91 98765 43210">
					<p class="description">Leave empty to hide it.</p></td></tr>
			</table>
			<?php submit_button(); ?>
		</form>
		<hr>
		<h2>Pages</h2>
		<p>The theme created the site's pages when it was activated. After a theme update, this brings every page back in line with the theme. <strong>It replaces any edits made to those pages in WordPress.</strong></p>
		<form method="post" onsubmit="return confirm('Replace the content of every Digitaleem page with the version in the theme?');">
			<?php wp_nonce_field( 'dgt_update_pages' ); ?>
			<input type="hidden" name="dgt_update_pages" value="1">
			<?php submit_button( 'Update pages from the theme', 'secondary', 'submit', false ); ?>
		</form>
	</div>
	<?php
}

<?php
/**
 * Creates the site's pages from content/pages.json.
 * On activation only missing pages are created, so nothing an editor has changed is overwritten.
 * Settings > Digitaleem has a button that brings every page back in line with the theme, for theme updates.
 */

defined( 'ABSPATH' ) || exit;

function dgt_content() {
	$file = DGT_DIR . '/content/pages.json';
	$data = file_exists( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
	return is_array( $data ) ? $data : array();
}

function dgt_find_page( $path ) {
	if ( '/' === $path ) {
		$ids = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 'meta_key' => '_dgt_path', 'meta_value' => '/', 'fields' => 'ids', 'numberposts' => 1 ) );
		return $ids ? get_post( $ids[0] ) : null;
	}
	return get_page_by_path( trim( $path, '/' ), OBJECT, 'page' );
}

/**
 * @param bool $overwrite Replace the content of pages that already exist.
 * @return array{created:int,updated:int}
 */
function dgt_import_pages( $overwrite = false ) {
	$result = array( 'created' => 0, 'updated' => 0 );
	$pages  = dgt_content();
	if ( ! $pages ) {
		return $result;
	}
	// Parents first.
	usort( $pages, function ( $a, $b ) {
		return substr_count( $a['path'], '/' ) - substr_count( $b['path'], '/' );
	} );

	// Page markup includes forms, buttons and SVG; save it exactly as built.
	kses_remove_filters();

	$order = 0;
	foreach ( $pages as $page ) {
		$order++;
		$parent_id = 0;
		if ( $page['parent'] ) {
			$parent    = dgt_find_page( $page['parent'] );
			$parent_id = $parent ? $parent->ID : 0;
		}
		$content  = "<!-- wp:html -->\n" . $page['content'] . "\n<!-- /wp:html -->";
		$existing = dgt_find_page( $page['path'] );
		$postarr  = array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $page['title'],
			'post_name'    => $page['slug'],
			'post_parent'  => $parent_id,
			'post_excerpt' => $page['description'],
			'post_content' => $content,
			'menu_order'   => $order,
		);
		if ( $existing ) {
			if ( ! $overwrite ) {
				continue;
			}
			$postarr['ID'] = $existing->ID;
			$id            = wp_update_post( wp_slash( $postarr ), true );
			$result['updated']++;
		} else {
			$id = wp_insert_post( wp_slash( $postarr ), true );
			$result['created']++;
		}
		if ( is_wp_error( $id ) ) {
			continue;
		}
		update_post_meta( $id, '_dgt_designed', 1 );
		update_post_meta( $id, '_dgt_path', $page['path'] );
		if ( $page['noindex'] ) {
			update_post_meta( $id, '_dgt_noindex', 1 );
		} else {
			delete_post_meta( $id, '_dgt_noindex' );
		}
		if ( $page['jsonld'] ) {
			update_post_meta( $id, '_dgt_jsonld', wp_slash( wp_json_encode( $page['jsonld'] ) ) );
		}
		if ( '/' === $page['path'] ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $id );
		}
	}

	kses_init_filters();

	if ( ! get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}
	flush_rewrite_rules();
	update_option( 'dgt_content_version', DGT_VERSION );
	return $result;
}

add_action( 'after_switch_theme', function () {
	dgt_register_types();
	dgt_import_pages( false );
} );


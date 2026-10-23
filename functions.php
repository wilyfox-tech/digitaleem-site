<?php
/**
 * Digitaleem theme.
 *
 * inc/setup.php          creates the site's pages when the theme is activated, and updates them on request
 * inc/settings.php       Settings > Digitaleem: contact details, where enquiries are emailed
 * inc/enquiries.php      the endpoint the enquiry forms post to, and the Enquiries list in the dashboard
 * inc/opportunities.php  Opportunities (internships, jobs, project briefs) managed in the dashboard
 */

defined( 'ABSPATH' ) || exit;

define( 'DGT_VERSION', wp_get_theme( get_template() )->get( 'Version' ) );
define( 'DGT_DIR', get_template_directory() );
define( 'DGT_URI', get_template_directory_uri() );

require DGT_DIR . '/inc/setup.php';
require DGT_DIR . '/inc/settings.php';
require DGT_DIR . '/inc/enquiries.php';
require DGT_DIR . '/inc/opportunities.php';

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'script', 'style', 'search-form', 'gallery', 'caption' ) );
	add_theme_support( 'responsive-embeds' );
} );

/* ---------- Links ----------
   Page content and the header and footer use root-relative links (/students/).
   They are rewritten to the site address, so the site also works from a subfolder or a staging domain. */
function dgt_links( $html ) {
	$home = untrailingslashit( home_url() );
	return preg_replace( '#\b(href|action)="/(?!/)#', '$1="' . $home . '/', $html );
}

/* ---------- Styles and scripts ---------- */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'dgt-fonts', 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap', array(), null );
	wp_enqueue_style( 'dgt-site', DGT_URI . '/assets/css/site.css', array(), DGT_VERSION );

	wp_enqueue_script( 'dgt-forms', DGT_URI . '/assets/js/forms.js', array(), DGT_VERSION, true );
	wp_enqueue_script( 'dgt-site', DGT_URI . '/assets/js/site.js', array( 'dgt-forms' ), DGT_VERSION, true );
	$config = array( 'formEndpoint' => esc_url_raw( rest_url( 'digitaleem/v1/enquiry' ) ), 'formExtra' => new stdClass() );
	wp_add_inline_script( 'dgt-forms', 'window.DGT_CONFIG = ' . wp_json_encode( $config ) . ';', 'before' );
	wp_add_inline_script( 'dgt-site', 'window.DGT_OPPORTUNITIES = ' . wp_json_encode( dgt_opportunities_for_site() ) . ';', 'before' );

	// The design does not use block styles; leave them out on pages built by the theme.
	if ( dgt_is_designed() ) {
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
		wp_dequeue_style( 'classic-theme-styles' );
		wp_dequeue_style( 'global-styles' );
	}
}, 20 );

add_action( 'init', function () {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
} );

/* ---------- Head: title, description, social cards ---------- */
add_filter( 'document_title_separator', function () { return '·'; } );
add_filter( 'document_title_parts', function ( $parts ) {
	if ( is_front_page() ) {
		return array( 'title' => get_bloginfo( 'name' ) );
	}
	unset( $parts['tagline'] );
	return $parts;
} );

function dgt_is_designed( $post_id = 0 ) {
	if ( ! $post_id ) {
		if ( ! is_singular( 'page' ) ) {
			return false;
		}
		$post_id = get_queried_object_id();
	}
	return (bool) get_post_meta( $post_id, '_dgt_designed', true );
}

add_action( 'wp_head', function () {
	echo '<link rel="icon" href="' . esc_url( DGT_URI . '/assets/img/favicon.svg' ) . '" type="image/svg+xml">' . "\n";
	echo '<meta name="theme-color" content="#111A33">' . "\n";
	if ( ! is_singular() ) {
		return;
	}
	$id    = get_queried_object_id();
	$desc  = get_the_excerpt( $id );
	$title = is_front_page() ? get_bloginfo( 'name' ) : get_the_title( $id );
	if ( $desc ) {
		echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
	}
	echo '<meta property="og:type" content="website"><meta property="og:site_name" content="' . esc_attr( get_bloginfo( 'name' ) ) . '">' . "\n";
	echo '<meta property="og:title" content="' . esc_attr( $title ) . '">';
	if ( $desc ) {
		echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">';
	}
	echo '<meta property="og:url" content="' . esc_url( get_permalink( $id ) ) . '">' . "\n";
	if ( get_post_meta( $id, '_dgt_noindex', true ) ) {
		echo '<meta name="robots" content="noindex">' . "\n";
	}
	$jsonld = get_post_meta( $id, '_dgt_jsonld', true );
	if ( $jsonld ) {
		$data = json_decode( $jsonld, true );
		if ( is_array( $data ) ) {
			$data['url'] = home_url( '/' );
			$email       = dgt_option( 'contact_email' );
			if ( $email ) {
				$data['email'] = $email;
			}
			echo '<script type="application/ld+json">' . wp_json_encode( $data ) . '</script>' . "\n";
		}
	}
}, 1 );

add_filter( 'language_attributes', function ( $output ) {
	return preg_replace( '/lang="en-US"/', 'lang="en-IN"', $output );
} );

/* Pages built by the theme always use its own page template, whatever template or page builder an earlier site set. */
add_filter( 'template_include', function ( $template ) {
	if ( dgt_is_designed() ) {
		return DGT_DIR . '/page.php';
	}
	return $template;
}, 999 );

/* ---------- Header and footer ---------- */
function dgt_part( $name ) {
	$file = DGT_DIR . '/parts/' . $name . '.html';
	return file_exists( $file ) ? file_get_contents( $file ) : '';
}

function dgt_render_header() {
	$html = dgt_part( 'header' );
	$path = '/' . ltrim( wp_parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH ), '/' );
	$base = wp_parse_url( home_url( '/' ), PHP_URL_PATH ) ?: '/';
	if ( '/' !== $base && 0 === strpos( $path, $base ) ) {
		$path = '/' . substr( $path, strlen( $base ) );
	}
	foreach ( array( '/students/', '/colleges/', '/industry/', '/mentors/', '/opportunities/', '/about/' ) as $p ) {
		if ( 0 === strpos( $path, $p ) ) {
			$html = preg_replace( '#<a href="' . preg_quote( $p, '#' ) . '">#', '<a href="' . $p . '" aria-current="page">', $html, 1 );
		}
	}
	if ( preg_match( '#^/(programs|domains|careers-abroad)/#', $path ) ) {
		$html = str_replace( '<button type="button" aria-expanded="false">Programs</button>', '<button type="button" aria-expanded="false" aria-current="page">Programs</button>', $html );
	}
	return dgt_links( $html );
}

function dgt_render_footer() {
	$html    = dgt_part( 'footer' );
	$contact = array();
	foreach ( array( 'contact_email', 'contact_phone' ) as $key ) {
		$value = dgt_option( $key );
		if ( $value ) {
			$contact[] = '<span>' . esc_html( $value ) . '</span>';
		}
	}
	$block = $contact ? '<div class="footer-contact">' . implode( '', $contact ) . '</div>' : '';
	$html  = str_replace( '<!--dgt:contact-->', $block, $html );
	return dgt_links( $html );
}

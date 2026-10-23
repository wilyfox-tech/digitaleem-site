<?php
/* Pages built by the theme are output as designed. Any other page gets a simple heading and readable text. */
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) :
	the_post();
	if ( dgt_is_designed( get_the_ID() ) ) :
		echo dgt_links( do_blocks( get_post_field( 'post_content', get_the_ID(), 'raw' ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- page markup saved by an editor
	else :
		get_template_part( 'parts/plain' );
	endif;
endwhile;
get_footer();

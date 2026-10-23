<?php
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) :
	the_post();
	get_template_part( 'parts/plain' );
endwhile;
get_footer();

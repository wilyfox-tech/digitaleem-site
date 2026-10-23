<?php
defined( 'ABSPATH' ) || exit;
get_header();
echo dgt_links( dgt_part( '404' ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- theme markup
get_footer();

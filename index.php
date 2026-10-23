<?php
defined( 'ABSPATH' ) || exit;
get_header();
?>
<section class="page-hero"><div class="wrap"><h1><?php echo esc_html( is_search() ? 'Search results' : ( is_archive() ? wp_strip_all_tags( get_the_archive_title() ) : get_bloginfo( 'name' ) ) ); ?></h1></div></section>
<section class="section"><div class="wrap stack" style="gap:1.5rem">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<article class="card"><h2 style="font-size:var(--step-1)"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p class="muted"><?php echo esc_html( get_the_excerpt() ); ?></p></article>
<?php endwhile; the_posts_pagination(); else : ?>
	<p class="lead">Nothing here yet.</p>
<?php endif; ?>
</div></section>
<?php
get_footer();

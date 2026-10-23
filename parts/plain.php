<?php defined( 'ABSPATH' ) || exit; ?>
<section class="page-hero"><div class="wrap">
	<nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a><span aria-hidden="true">/</span><span><?php the_title(); ?></span></nav>
	<h1><?php the_title(); ?></h1>
	<?php if ( has_excerpt() ) : ?><p class="lead"><?php echo esc_html( get_the_excerpt() ); ?></p><?php endif; ?>
</div></section>
<section class="section"><div class="wrap"><div class="prose"><?php the_content(); ?></div></div></section>

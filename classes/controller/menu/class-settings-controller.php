<?php
/**
 * Settings class
 *
 * @package P4BKS\Controllers\Menu
 * @since 1.40.0
 */

namespace P4GBKS\Controllers\Menu;

use P4GBKS\Command\Shortcode_To_Gutenberg;

if ( ! class_exists( 'Settings_Controller' ) ) {

	/**
	 * Class Settings_Controller
	 */
	class Settings_Controller extends Controller {

		/**
		 * Create menu/submenu entry.
		 */
		public function create_admin_menu() {

			$current_user = wp_get_current_user();

			if ( in_array( 'administrator', $current_user->roles, true ) && current_user_can( 'manage_options' ) ) {
				add_menu_page(
					__( 'Blocks', 'planet4-blocks-backend' ),
					__( 'Blocks', 'planet4-blocks-backend' ),
					'manage_options',
					P4GBKS_PLUGIN_SLUG_NAME,
					null,
					'dashicons-layout'
				);
			}
		}

		/**
		 * Validates the settings input.
		 *
		 * @param array $settings The associative array with the settings that are registered for the plugin.
		 *
		 * @return bool
		 */
		public function validate( $settings ) : bool {
			$has_errors = false;
			return ! $has_errors;
		}

		/**
		 * Sanitizes the settings input.
		 *
		 * @param array $settings The associative array with the settings that are registered for the plugin.
		 */
		public function sanitize( &$settings ) {
			if ( $settings ) {
				foreach ( $settings as $name => $setting ) {
					$settings[ $name ] = sanitize_text_field( $setting );
				}
			}
		}
	}
}

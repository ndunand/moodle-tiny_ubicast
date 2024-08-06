<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * tiny text editor integration version file.
 *
 * @package    tiny_ubicast
 * @copyright  2024 UbiCast {@link https://www.ubicast.eu}
 * @author     Nicolas Alexandropoulos <nicolas.alexandropoulos@unil.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$ADMIN->add('editortiny', new admin_category('tiny_ubicast', new lang_string('pluginname', 'tiny_ubicast')));

$settings = new admin_settingpage('tiny_ubicast_settings', new lang_string('pluginname', 'tiny_ubicast'));
if ($ADMIN->fulltree) {
    $helpstring = get_string('usefilter_desc', 'tiny_ubicast');
    if (!array_key_exists('ubicast', filter_get_globally_enabled_filters_with_config())) {
        $alertlevel = (get_config('tiny_ubicast', 'usefilter')) ? ('error') : ('warning');
        $helpstring .= html_writer::div(get_string('filternotinstalled', 'tiny_ubicast'), 'alert alert-' . $alertlevel);
    }
    $setting = new admin_setting_configcheckbox('tiny_ubicast/usefilter', get_string('usefilter', 'tiny_ubicast'), $helpstring, false);
    $settings->add($setting);
}

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from './common';

const usefilter = getPluginOptionName(pluginName, 'usefilter');
const ubicastURL = getPluginOptionName(pluginName, 'ubicastURL');
const courseid = getPluginOptionName(pluginName, 'courseid');

/**
 * Options registration function.
 *
 * @param {tinyMCE} editor
 */
export const register = (editor) => {

    // For each option, register it with the editor.
    // Valid type are defined in https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editoroptions/
    editor.options.register(usefilter, {
        processor: 'string',
    });
    editor.options.register(ubicastURL, {
        processor: 'string',
    });
    editor.options.register(courseid, {
        processor: 'number',
    });
};

export const useFilter = (editor) => editor.options.get(usefilter);

export const getUbicastURL = (editor) => editor.options.get(ubicastURL);

export const getCourseId = (editor) => editor.options.get(courseid);

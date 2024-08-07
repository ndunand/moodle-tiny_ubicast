import {icon, component} from './common';
import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';

import {getCourseId, getUbicastURL, useFilter} from "./options";

/**
 * Add a correction on the current selection.
 * @param {tinyMCE} editor
 * @returns {void}
 */
async function insertMedia(editor) {
    const courseid = getCourseId(editor);
    const usefilter = useFilter(editor) === '1';
    const ubicastURL = getUbicastURL(editor);
    const [
        panelTitle,
    ] = await Promise.all([
        getString('pluginname', component),
    ]);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //Create iframe content
            const form_id = 'id_resource_tiny_ubicast_' + new Date().getTime();
            const content = document.createElement('div');
            content.innerHTML = this.responseText;
            content.querySelector('form').id = form_id;

            editor.windowManager.open({
                title: panelTitle,
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'htmlpanel',
                            html: '<div id="ubicast_content"></div>'
                        },
                    ]
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: 'Close'
                    },
                    {
                        type: 'submit',
                        text: 'Save',
                        buttonType: 'primary'
                    }
                ],
                onSubmit: (api) => {
                    const video_link = create_video_link(courseid, usefilter, ubicastURL);
                    editor.insertContent(video_link);
                    api.close();
                }
            });
            document.getElementById('ubicast_content').appendChild(content);
            setTimeout(function () {
                // Use setTimeout to wait for MediaSelector loading.
                window.mediaSelector = new window.MediaSelector({
                    moodleURL: window.M.cfg.wwwroot + '/mod/ubicast/lti.php?id=' + courseid,
                    nudgisURL: ubicastURL,
                    filterBySpeaker: true,
                    target: form_id
                });
            }, (window.MediaSelector ? 10 : 2000));
        }
    };
    xhttp.open('GET', window.M.cfg.wwwroot + '/lib/editor/tiny/plugins/ubicast/media.php', true);
    xhttp.send();
}


export const getSetup = async () => {
    const [
        insertButtonName,
        buttonImage,
    ] = await Promise.all([
        getString('inputsubmit', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the insert media Toolbar Button.
        editor.ui.registry.addButton('insert_media', {
            icon: icon,
            tooltip: insertButtonName,
            onAction: () => insertMedia(editor)
        });
    };
};

/**
 * Function to retrieve the course id from the current page.
 *
 * @method create_video_link
 * @param {number} course_id The course id.
 * @param {boolean} use_filter The use filter option.
 * @param {string} ubicast_url The ubicast url.
 * @return {string} The cource id.
 * @private
 */
export function create_video_link(course_id, use_filter, ubicast_url) {

    const media_id = document.getElementById('id_mediaid').value;
    const media_width = document.getElementById('id_mediawidth').value;
    const media_height = document.getElementById('id_mediaheight').value;
    const media_thumb = document.getElementById('id_mediaimg').value || '/static/mediaserver/images/video.svg';

    let video_url = '';
    if (media_id) {
        if (use_filter) {
            const thumb_url = ubicast_url + media_thumb;
            video_url = '<img class="tiny_ubicast courseid_' + course_id + '_mediaid_'
                + media_id + '" style="display: block; width: '
                + media_width + '; height: ' + media_height + ';"' + ' src="' + thumb_url + '" alt=""/>';
        } else {
            const url = '/lib/editor/tiny/plugins/ubicast/view.php?course=' + course_id + ' &video= + ' + media_id;
            video_url = '<iframe class="nudgis-iframe" ' +
                'style="width:' + media_width + '; height: ' + media_height + '; background-color: #ddd;" ' +
                'src="' + window.M.cfg.wwwroot + url + '" ' +
                ' allow="autoplay; encrypted-media" allowfullscreen="allowfullscreen">' +
                '</iframe>';
        }
    }

    return video_url;
}
import {getCourseId, getUbicastURL, useFilter} from "./options";
/**
 * Add a correction on the current selection.
 * @param {tinyMCE} editor
 * @returns {void}
 */
function insertMedia(editor) {

    const courseid = getCourseId(editor);
    const usefilter = useFilter(editor) === '1';
    const ubicastURL = getUbicastURL(editor);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //Create iframe content
            const formId = 'id_resource_atto_ubicast_' + new Date().getTime();
            const content = Y.Node.create(this.responseText);
            content.set('id', formId);
            const fieldset = content.one('fieldset');
            if (fieldset) {
                // The fieldset can be null with Moodle < 4.0
                fieldset.setStyle('overflow', 'auto');
                fieldset.setStyle('padding', '20px');
                fieldset.setStyle('max-height', 0.7 * window.innerHeight);
            }

            editor.windowManager.open({
                title: 'Example plugin',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'htmlpanel',
                            html: '<div id="content"></div>'
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
            Y.one('#content').insert(content, 'after');
            setTimeout(function () {
                // Use setTimeout to wait for MediaSelector loading.
                window.mediaSelector = new window.MediaSelector({
                    moodleURL: window.M.cfg.wwwroot + '/mod/ubicast/lti.php?id=' + courseid,
                    nudgisURL: ubicastURL,
                    filterBySpeaker: true,
                    target: formId
                });
            }, (window.MediaSelector ? 10 : 2000));
        }
    };
    xhttp.open('GET', window.M.cfg.wwwroot + '/lib/editor/atto/plugins/ubicast/media.php', true);
    xhttp.send();
}


export const getSetup = async () => {
    return (editor) => {

        // Register the insert media Toolbar Button.
        editor.ui.registry.addButton('insert_media', {
            icon: 'user',
            tooltip: "Insert media",
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
            video_url = '<img class="atto_ubicast courseid_' + course_id + '_mediaid_'
                + media_id + '" style="display: block; width: '
                + media_width + '; height: ' + media_height + ' }};"' + ' src="' + thumb_url + '" alt=""/>';
        } else {
            const url = '/lib/editor/atto/plugins/ubicast/view.php?course=' + course_id + ' &video= + ' + media_id;
            video_url = '<iframe class="nudgis-iframe" ' +
                'style="width:' + media_width + '; height: ' + media_height + '; background-color: #ddd;" ' +
                'src="' + window.M.cfg.wwwroot + url + '" ' +
                ' allow="autoplay; encrypted-media" allowfullscreen="allowfullscreen">' +
                '</iframe>';
        }
    }

    return video_url;
}
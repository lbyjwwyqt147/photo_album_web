/***
 * 员工个人档案详情
 * @type {{init}}
 */
var SnippetMainPageStaffParticulars = function() {
    var serverUrl = BaseUtils.serverAddress;






    //== Public Functions
    return {
        // public functions
        init: function() {
            // Tooltip
            $('[data-toggle="tooltip"]').tooltip();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageStaffParticulars.init();
});
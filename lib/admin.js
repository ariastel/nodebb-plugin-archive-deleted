'use strict';


define('admin/plugins/archive-deleted', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('archive-deleted', $('.archive-deleted-settings'));

		$('#save').on('click', function () {
			Settings.save('archive-deleted', $('.archive-deleted-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'archive-deleted-saved',
					title: 'Settings Saved',
					message: 'Please restart your NodeBB to apply these settings, or click on this alert to do so.',
					clickfn: function () {
						socket.emit('admin.restart');
					},
				});
			});
		});
	};

	return ACP;
});

'use strict';

const Meta = require.main.require('./src/meta');
const Topic = require.main.require('./src/topics');

const ArchiveDeletedPlugin = {
  settings: null
};

ArchiveDeletedPlugin.init = function (data, callback) {
  function render(_, res) {
    res.render('admin/plugins/archive-deleted', {});
  }

  data.router.get('/admin/plugins/archive-deleted', data.middleware.admin.buildHeader, render);
  data.router.get('/api/admin/plugins/archive-deleted', render);

  Meta.settings.get('archive-deleted', async function (_, settings) {
    ArchiveDeletedPlugin.settings = settings;
    callback();
  });
}

ArchiveDeletedPlugin.addAdminNavigation = function (custom_header, callback) {
  custom_header.plugins.push({
    'route': '/plugins/archive-deleted',
    "name": 'Archive Deleted'
  });
  callback(null, custom_header);
};

ArchiveDeletedPlugin.onTopicDelete = function({ topic }) {
  return Topic.tools.move(topic.tid, { cid: ArchiveDeletedPlugin.settings.targetCid })
}

module.exports = ArchiveDeletedPlugin;
// Active versions
module.exports = activeVersions = (function ($) {
  var that;

  return {
    $: {
      $versionList: $('#version-list').find('.version-list-wrapper'),
      $apiBaseUrl: '/docsitalia/api/document/',
      $activeVerionsEndpoint: READTHEDOCS_DATA.project + '/active_versions/',
      $activeVersions: [],
      $projectBaseUrl: [
        '',
        DOCSITALIA_DATA.publisher_slug,
        DOCSITALIA_DATA.publisher_project_slug,
        READTHEDOCS_DATA.project,
        READTHEDOCS_DATA.language,
        ''
      ].join('/'),
      $versionElement: '<a class="dropdown-item" href="%url%">%name%</a>'
    },

    init: function() {
      
      that = this.$;
      $.ajax({
        dataType: 'json',
        url: READTHEDOCS_DATA.api_host + that.$apiBaseUrl + that.$activeVerionsEndpoint,
        success: activeVersions.success,
        error: activeVersions.error,
        complete: activeVersions.updateVersionList,
        cache: false
      });
    },
    
    success: function(data) {
      that.$activeVersions = data.versions.reduce(function(activeVersions, version) {
        (version.active == true && version.built == true)
          && activeVersions.push({
            name: version.verbose_name,
            url: that.$projectBaseUrl + version.slug + '/'
          });
          return activeVersions
      }, []);
    },
    
    error: function() {
      that.$activeVersions = LOCAL ? [{
        name: READTHEDOCS_DATA.version,
        url: '#'
      }] : [];
    },
    
    updateVersionList: function() {
      that.$activeVersions.map(function(version) {
        that.$versionList.append(that.$versionElement.replace(/%\w+%/g, function(match) {
          return version[match.replace(/%/g, '')] || match;
        }));
      });
    }
  }
})(jQuery);

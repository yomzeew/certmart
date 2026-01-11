const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withCleanPermissions(config) {
  return withAndroidManifest(config, config => {
    const manifest = config.modResults;
    
    // Media permissions to completely remove (Google Play restricted)
    const permissionsToRemove = [
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.MANAGE_EXTERNAL_STORAGE'
    ];

    // Legacy storage permissions to limit to Android 12 and below
    const legacyStoragePermissions = [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE'
    ];

    // Process uses-permission
    if (manifest.manifest['uses-permission']) {
      manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'].filter(perm => {
        const permName = perm.$['android:name'];
        
        // Remove restricted media permissions completely
        if (permissionsToRemove.includes(permName)) {
          return false;
        }
        
        // Add maxSdkVersion to legacy storage permissions
        if (legacyStoragePermissions.includes(permName)) {
          perm.$['android:maxSdkVersion'] = '32';
        }
        
        return true;
      });
    }

    // Process uses-permission-sdk-23
    if (manifest.manifest['uses-permission-sdk-23']) {
      manifest.manifest['uses-permission-sdk-23'] = manifest.manifest['uses-permission-sdk-23'].filter(perm => {
        const permName = perm.$['android:name'];
        
        // Remove all restricted and legacy permissions from SDK 23 block
        return !permissionsToRemove.includes(permName) && !legacyStoragePermissions.includes(permName);
      });
    }

    return config;
  });
};

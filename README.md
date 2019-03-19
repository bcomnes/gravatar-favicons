# gravatar-favicons

Generate favicons from a gravatar email.

## Usage

```console
generate-favicon --email person@example.com --dest ./some/folder
generate-favicon --config ./example-config.js
generate-favicon --config ./example-config.json
```

### Example config

```js
module.exports = {
  email: 'bcomnes@gmail.com',
  dest: './out',
  faviconConfig: {
    path: '/', // Path for overriding default icons path. `string`
    appName: 'bret.io', // Your application's name. `string`
    appDescription: 'Bret Comnes\'s website', // Your application's description. `string`
    developerName: 'Bret Comnes', // Your (or your developer's) name. `string`
    developerURL: 'https://bret.io', // Your (or your developer's) URL. `string`
    dir: 'auto', // Primary text direction for name, short_name, and description
    lang: 'en-US', // Primary language for name and short_name
    background: '#232830', // Background colour for flattened icons. `string`
    theme_color: '#232830', // Theme color user for example in Android's task switcher. `string`
    display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
    orientation: 'any', // Default orientation: "any", "natural", "portrait" or "landscape". `string`
    start_url: '/?homescreen=1', // Start URL when launching the application from a device. `string`
    version: '1.0', // Your application's version string. `string`
    logging: true, // Print logs to console? `boolean`
    icons: {
      // Platform Options:
      // - offset - offset in percentage
      // - background:
      //   * false - use default
      //   * true - force use default, e.g. set background for Android icons
      //   * color - set background for the specified icons
      //
      android: false, // Create Android homescreen icon. `boolean` or `{ offset, background }`
      appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background }`
      appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background }`
      coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background }`
      favicons: true, // Create regular favicons. `boolean`
      firefox: false, // Create Firefox OS icons. `boolean` or `{ offset, background }`
      windows: true, // Create Windows 8 tile icons. `boolean` or `{ background }`
      yandex: false // Create Yandex browser icon. `boolean` or `{ background }`
    }
  }
}
```

The `faviconConfig` field is the same options that can be passed to [favicons](https://github.com/itgalaxy/favicons).


Creates the following assets:

```console
├── apple-touch-icon-1024x1024.png
├── apple-touch-icon-114x114.png
├── apple-touch-icon-120x120.png
├── apple-touch-icon-144x144.png
├── apple-touch-icon-152x152.png
├── apple-touch-icon-167x167.png
├── apple-touch-icon-180x180.png
├── apple-touch-icon-57x57.png
├── apple-touch-icon-60x60.png
├── apple-touch-icon-72x72.png
├── apple-touch-icon-76x76.png
├── apple-touch-icon-precomposed.png
├── apple-touch-icon.png
├── browserconfig.xml
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── mstile-144x144.png
├── mstile-150x150.png
├── mstile-310x150.png
├── mstile-310x310.png
├── mstile-70x70.png
└── snippets.html
```

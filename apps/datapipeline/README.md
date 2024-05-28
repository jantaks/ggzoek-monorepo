Insert javascript in the browser console to load jQuery for testing purposes:

```javascript
var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
jQuery.noConflict();
```

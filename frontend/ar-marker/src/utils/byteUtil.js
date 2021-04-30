export const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(""+Math.floor(Math.log(bytes) / Math.log(1000)));
    return (bytes / Math.pow(1000, i)).toFixed(2) + ' ' + sizes[i];
 }

export var LocalStorage;
(function (LocalStorage) {
    function getItem(key) {
        const itemString = localStorage.getItem(key);
        if (!itemString) {
            return null;
        }
        const item = JSON.parse(itemString);
        if (item.expiry !== undefined && item.expiry < new Date().getTime()) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
    LocalStorage.getItem = getItem;
    function setItem(key, value, ttl = undefined) {
        const item = {
            value,
            expiry: ttl !== undefined ? new Date().getTime() + ttl : undefined
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
    LocalStorage.setItem = setItem;
})(LocalStorage || (LocalStorage = {}));

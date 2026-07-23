export function saveCurrentShopToLocalStorage(shop) {
    localStorage.setItem('connectedShop_id', shop.id);
    localStorage.setItem('connectedShop_name', shop.name);
    localStorage.setItem('connectedShop_address', shop.address);
    localStorage.setItem('connectedShop_phone', shop.phone);
}

export function getCurrentShopFromLocalStorage() {
    const shopId = localStorage.getItem('connectedShop_id');
    const shopName = localStorage.getItem('connectedShop_name');
    const shopAddress = localStorage.getItem('connectedShop_address');
    const shopPhone = localStorage.getItem('connectedShop_phone');      

    return {
        shopId,
        shopName,
        shopAddress,
        shopPhone
    };
}

export function resetCurrentShopInLocalStorage() {
    localStorage.setItem('connectedShop_id', null);
    localStorage.setItem('connectedShop_name', null);
    localStorage.setItem('connectedShop_address', null);
    localStorage.setItem('connectedShop_phone', null);
}
export function saveDelayToLocalStorage(dateEnd,message,nbDelay) {
    localStorage.setItem('dateEnd', dateEnd);
    localStorage.setItem('message', message);
    localStorage.setItem('nbDelay', nbDelay);
    window.dispatchEvent(new Event('delay-updated'));
}

export function getDelayFromLocalStorage() {
    const dateEnd = localStorage.getItem('dateEnd');
    const message = localStorage.getItem('message');
    const nbDelay = localStorage.getItem('nbDelay');

    return {
        dateEnd,
        message,
        nbDelay
    };
}

export function resetDelayInLocalStorage() {
    localStorage.setItem('dateEnd', null);
    localStorage.setItem('message', null);
    localStorage.setItem('nbDelay', null);
    window.dispatchEvent(new Event('delay-updated'));
}
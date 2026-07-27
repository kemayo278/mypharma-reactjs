const KEY = 'institution_data';

export function saveInstitutionToLocalStorage(inst) {
    localStorage.setItem(KEY, JSON.stringify({
        id:              inst.Institution_id              ?? null,
        name:            inst.Institution_name            ?? '',
        state:           inst.Institution_state           ?? '',
        matriculation:   inst.Institution_matriculation   ?? '',
        phone:           inst.Institution_phone           ?? '',
        pj:              inst.Institution_pj              ?? '',
        number_register: inst.Institution_number_register ?? '',
        pj_register:     inst.Institution_pj_register     ?? '',
        num_declaration: inst.Institution_num_declaration ?? '',
        cycle:           inst.Institution_cycle           ?? '',
        telephone:       inst.Institution_telephone       ?? '',
        couverture:      inst.Institution_couverture      ?? '',
    }));
    window.dispatchEvent(new Event('institution-updated'));
}

export function getInstitutionFromLocalStorage() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function resetInstitutionInLocalStorage() {
    localStorage.removeItem(KEY);
}

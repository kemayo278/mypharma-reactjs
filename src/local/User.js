export function saveUserProfileToLocalStorage(userProfile) {
    localStorage.setItem('profile_first_name', userProfile.user_first_name);
    localStorage.setItem('profile_second_name', userProfile.user_second_name);
    localStorage.setItem('profile_date_of_birth', userProfile.user_date_of_birth);
    localStorage.setItem('profile_phone', userProfile.user_phone);    
    localStorage.setItem('profile_email', userProfile.user_email);
    localStorage.setItem('profile_state', userProfile.user_state);    
    localStorage.setItem('profile_degree', userProfile.user_degree);   
    localStorage.setItem('profile_img', userProfile.user_img);    
    localStorage.setItem('profile_cni_number', userProfile.user_cni_number);
    localStorage.setItem('profile_pseudo', userProfile.user_pseudo);
    localStorage.setItem('profile_role', userProfile.role);
    localStorage.setItem('profile_phone', userProfile.user_phone);
}

export function getUserProfileFromLocalStorage() {
    const profileImg = localStorage.getItem('profile_img');
    const profileFirstName = localStorage.getItem('profile_first_name');
    const profileSecondName = localStorage.getItem('profile_second_name');
    const profileDateOfBirth = localStorage.getItem('profile_date_of_birth');
    const profileEmail = localStorage.getItem('profile_email');
    const profileState = localStorage.getItem('profile_state');
    const profileDegree = localStorage.getItem('profile_degree');
    const profileCniNumber = localStorage.getItem('profile_cni_number');
    const profilePseudo = localStorage.getItem('profile_pseudo');
    const profileRole = localStorage.getItem('profile_role');              
    const profilePhone = localStorage.getItem('profile_phone');

    return {
        profileImg,
        profileFirstName,
        profileSecondName,
        profileDateOfBirth,
        profileEmail,
        profileState,
        profileDegree,
        profileCniNumber,
        profilePseudo,
        profileRole,
        profilePhone
    };
}

export function resetUserProfileInLocalStorage() {
    localStorage.setItem('profile_first_name', null);
    localStorage.setItem('profile_second_name', null);
    localStorage.setItem('profile_date_of_birth', null);
    localStorage.setItem('profile_email', null);
    localStorage.setItem('profile_state', null);
    localStorage.setItem('profile_degree', null);
    localStorage.setItem('profile_cni_number', null);
    localStorage.setItem('profile_pseudo', null);
    localStorage.setItem('profile_phone', null);
    localStorage.setItem('profile_role', []);
}
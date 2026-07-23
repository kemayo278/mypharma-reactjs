const AuthReducer = (state,action) => {
    switch (action.type) {
        case "LOGIN":{
            const { user, token } = action.payload;
            return {
                currentUser: user,
                token: token
            };
        }
        case "LOGOUT" : {
            return {
                currentUser: null,
                token: null
            };
        }
        default:
            return state;
    }
};

export default AuthReducer
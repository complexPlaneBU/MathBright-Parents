// utils.js

export function getUserAvatarUrl(user) {

    const DEFAULT_AVATAR_URL = 'https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Blank&hatColor=PastelBlue&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Black&eyeType=WinkWacky&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light';

    // check if we need to just return the default avatar.
    if (!user || !user.avatar_config) {
        return DEFAULT_AVATAR_URL;
    }

    const avatarConfig = JSON.parse(user.avatar_config);
    if (avatarConfig) {
        let avatarUrl = 'https://avataaars.io/?';
        Object.keys(avatarConfig).forEach(key => {
            avatarUrl += `${key}=${avatarConfig[key]}&`;
        });
        return avatarUrl;
    } else {
        return DEFAULT_AVATAR_URL;

    }
}
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { get_api_base } from "../common/API";

interface AvatarContextType {
    avatarVersion: number;
    refreshAvatar: () => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider = ({ children }: { children: ReactNode }) => {
    const [avatarVersion, setAvatarVersion] = useState(0);
    
    const refreshAvatar = () => {
        setAvatarVersion(prev => prev + 1);
    };
    
    return (
        <AvatarContext.Provider value={{ avatarVersion, refreshAvatar }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error("useAvatar must be used within AvatarProvider");
    }
    return context;
};

export const useProfilePic = () => {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const { avatarVersion } = useAvatar();
    const token = localStorage.getItem('access_token');
    const api = get_api_base(token || "");

    useEffect(() => {
        const fetchPic = async () => {
            try {
                const response = await api.get("/users/profilepic");
                const image = `data:image/jpeg;base64,${response.data}`;
                setProfilePic(image);
            } catch (error) {
                console.error(error);
                setProfilePic(null);
            }};
        fetchPic();
    }, [avatarVersion]);

    return profilePic;

};